"use server";

import { revalidatePath } from "next/cache";
import Tweet from "../models/tweet.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Community from "../models/community.model";

//page pagination
export async function fetchPosts(pageNumber = 1, pagesize = 20) {
  connectToDB();

  //number of posts to skip
  const skipAmount = (pageNumber - 1) * pagesize;

  const postQuery = Tweet.find({ parentId: { $in: [null, undefined] } })
    .sort({
      createdAt: "desc",
    })
    .skip(skipAmount)
    .limit(pagesize)
    .populate({ path: "author", model: User })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image username",
      },
    });

  const totalPostCount = await Tweet.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const post = await postQuery.exec(); // execute

  const isNext = totalPostCount > skipAmount + post.length;

  return { post, isNext };
}

interface CreateTweetParams {
  text: string;
  author: string;
  image: string | null;
  communityId: string | null;
  path: string;
}

export async function createTweet({
  text,
  author,
  image,
  communityId,
  path,
}: CreateTweetParams) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    //create tweet
    const createdTweet = await Tweet.create({
      text,
      author,
      image: !image ? null : image,
      community: communityIdObject,
    });

    if (image) {
      createdTweet.image = image;
    }

    await User.findByIdAndUpdate(author, {
      $push: { tweets: createdTweet._id },
    });
    //update user model
    if (communityIdObject) {
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { tweets: createdTweet._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to post Tweet: ${error.message}`);
  }
}

async function fetchAllChildTweets(tweetId: string): Promise<any[]> {
  const childTweets = await Tweet.find({ parentId: tweetId });

  const descendantTweets = [];
  for (const childTweet of childTweets) {
    const descendants = await fetchAllChildTweets(childTweet._id);
    descendantTweets.push(childTweet, ...descendants);
  }

  return descendantTweets;
}

export async function deleteTweet(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the tweet to be deleted (the main tweet)
    const mainTweet = await Tweet.findById(id).populate("author community");

    if (!mainTweet) {
      throw new Error("Tweet not found");
    }

    // Fetch all child Tweets and their descendants recursively
    const descendantTweets = await fetchAllChildTweets(id);

    // Get all descendant tweet IDs including the main tweet ID and child tweet IDs
    const descendantTweetIds = [
      id,
      ...descendantTweets.map((tweet) => tweet._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantTweets.map((tweet) => tweet.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainTweet.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantTweets.map((tweet) => tweet.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainTweet.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child tweets and their descendants
    await Tweet.deleteMany({ _id: { $in: descendantTweetIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { tweets: { $in: descendantTweetIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { tweets: { $in: descendantTweetIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete tweet: ${error.message}`);
  }
}

export async function fetchTweetById(id: string) {
  try {
    connectToDB();

    const tweet = await Tweet.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image username",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image username",
          },
          {
            path: "children",
            model: Tweet,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image username",
            },
          },
        ],
      })
      .exec();
    return tweet;
  } catch (error: any) {
    throw new Error(`Failed to fetch comment ${error.message}`);
  }
}

export async function addCommentToTweet(
  tweetId: string,
  commentText: string,
  userId: string,
  path: string
) {
  try {
    connectToDB();

    const originalTweet = await Tweet.findById(tweetId);

    if (!originalTweet) throw new Error(`Tweet not found!`);

    const commentTweet = new Tweet({
      text: commentText,
      author: userId,
      parentId: tweetId,
    });

    const saveCommentTweet = await commentTweet.save();

    originalTweet.children.push(saveCommentTweet._id);

    await originalTweet.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to post comment: ${error.message}`);
  }
}

interface followUnfollowParams {
  currentUser: string;
  otherUser: string;
  path: string;
}

export async function followUnfollow({
  currentUser,
  otherUser,
  // post,
  path,
}: followUnfollowParams) {
  try {
    connectToDB();

    const userToFollow = await User.findById(otherUser);

    if (!userToFollow) {
      throw new Error("Tweet not found");
    }

    if (!userToFollow.followers.includes(currentUser)) {
      userToFollow.followers.push(currentUser);
      await userToFollow.save();

      const currentUserFollowing = await User.findById(currentUser);
      currentUserFollowing.following.push(otherUser);
      await currentUserFollowing.save();
    }

    //   const user = await User.findById(currentUser);
    //   user.likes.push(post);
    //   await user.save();
    // } else {
    //   tweet.likes = tweet.likes.filter(
    //     (id: any) => id.toString() !== currentUser
    //   );
    //   await tweet.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to like Tweet: ${error.message}`);
  }
}
