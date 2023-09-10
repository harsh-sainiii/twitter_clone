import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import TweetCard from "../cards/TweetCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { fetchTweetById } from "@/lib/actions/tweet.actions";
import { fetchLikedPosts } from "@/lib/actions/like.actions";
import { TbMessage2Heart } from "react-icons/tb";

type TweetsTabProps = {
  accountId: string;
  userInfoId: string;
  isDelete: string;
};

export default async function LikesTab({
  accountId,
  userInfoId,
  isDelete,
}: TweetsTabProps) {
  const result = await fetchLikedPosts(accountId);

  if (!result || result.length < 1)
    return (
      <span className="flex flex-col gap-3 justify-center mt-10 items-center m-auto text-light-2/80">
        <TbMessage2Heart className=" text-[100px]" />
        <p>
          You haven't like any a tweet, once you have they will show up here.
        </p>
      </span>
    );

  return (
    <section className=" mt-9 flex flex-col gap-10">
      {result.map((v: any) => (
        <TweetCard
          key={v._id}
          id={v._id}
          currentUserId={v.author.id}
          parentId={v.parentId}
          content={v.text}
          author={{
            name: v.author.name,
            image: v.author.image,
            id: v.author.id,
            username: v.author.username,
          }}
          community={v.community}
          createdAt={v.createdAt}
          comments={v.children}
          image={v.image}
          userInfoId={userInfoId}
          likes={v.likes}
          isDelete={isDelete}
        />
      ))}
    </section>
  );
}
