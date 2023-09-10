"use server";

import { revalidatePath } from "next/cache";
import Tweet from "../models/tweet.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Community from "../models/community.model";

interface CreateLikeParams {
  userInfoId: string;
  post: string;
  path: string;
}

export async function createLike({ userInfoId, post, path }: CreateLikeParams) {
  try {
    connectToDB();

    const tweet = await Tweet.findById(post);
    // const getUser = await User.findOne({ id: userInfoId });
    // const getUserId = getUser._id;

    if (!tweet) {
      throw new Error("Tweet not found");
    }

    if (!tweet.likes.includes(userInfoId)) {
      tweet.likes.push(userInfoId);
      await tweet.save();

      const user = await User.findById(userInfoId);
      user.likes.push(post);
      await user.save();
    } else {
      tweet.likes = tweet.likes.filter(
        (id: any) => id.toString() !== userInfoId
      );
      await tweet.save();

      const user = await User.findById(userInfoId);
      user.likes = user.likes.filter((id: any) => id.toString() !== post);
      await user.save();
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to like Tweet: ${error.message}`);
  }
}

export async function getUserLikes(userInfoId: string) {
  try {
    connectToDB();

    const user = await User.findOne({ _id: userInfoId }).populate({
      path: "likes",
      select: "_id text author username",
      populate: {
        path: "author",
        select: "_id id",
      },
    });
    return user;
  } catch (error: any) {
    throw new Error(`Failed to fetch user likes : ${error.message}`);
  }
}

export async function fetchLikedPosts(tweetId: string) {
  try {
    connectToDB();
    // Find all tweets authored by the user with the given userId
    const tweets = await Tweet.find({ _id: tweetId }).populate([
      {
        path: "community",
        model: Community,
        select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
      },
      {
        path: "author",
        model: User,
        select: "name id image _id username", // Select the "name" and "_id" fields from the "Community" model
      },
      {
        path: "children",
        model: Tweet,
        populate: {
          path: "author",
          model: User,
          select: "name image id _id username", // Select the "name" and "_id" fields from the "User" model
        },
      },
    ]);
    return tweets;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}
