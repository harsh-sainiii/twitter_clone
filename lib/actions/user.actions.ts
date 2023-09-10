"use server";

import User from "../models/user.model";
import Tweet from "../models/tweet.model";
import Community from "../models/community.model";
import { connectToDB } from "../mongoose";
import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

export async function fetchUser(userId: string) {
  try {
    await connectToDB();
    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

type UserActionProps = {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
};

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: UserActionProps): Promise<void> {
  try {
    connectToDB();
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLocaleLowerCase(),
        name,
        bio,
        image,
        onboard: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();
    // Find all tweets authored by the user with the given userId
    const tweets = await User.findOne({ id: userId }).populate({
      path: "tweets",
      model: Tweet,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "children",
          model: Tweet,
          populate: {
            path: "author",
            model: User,
            select: "name image id username", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });

    return tweets;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}
export async function fetchUserMedia(userId: string) {
  try {
    connectToDB();
    // Find all tweets authored by the user with the given userId
    const tweets = await User.findOne({ id: userId }).populate({
      path: "tweets",
      model: Tweet,
      match: { image: { $exists: true } },
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "children",
          model: Tweet,
          populate: {
            path: "author",
            model: User,
            select: "name image id username", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });

    return tweets;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}

type FetchUsersProps = {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
};

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: FetchUsersProps) {
  try {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    //get all user tweets created by user
    const userTweets = await Tweet.find({ author: userId });

    //collect all replies id
    const childrenTweetIds = userTweets.reduce((acc, userTweet) => {
      return acc.concat(userTweet.children);
    }, []);

    const replies = await Tweet.find({
      _id: { $in: childrenTweetIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id username",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to catch any activity: ${error.message}`);
  }
}
