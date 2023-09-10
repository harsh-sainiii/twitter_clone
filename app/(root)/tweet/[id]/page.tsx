import TweetCard from "@/components/cards/TweetCard";
import Comment from "@/components/forms/Comment";
import { fetchTweetById } from "@/lib/actions/tweet.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";

type TweetProps = {
  params: { id: string };
};

const getTweet = cache(async (id: string) => {
  const result = await fetchTweetById(id);
  if (!result) return null;
  return result;
});

export async function generateMetadata({
  params: { id },
}: TweetProps): Promise<Metadata> {
  const tweet = await getTweet(id);
  return {
    title: `${tweet.author.name}: ${tweet.text} | Twitter by Goldie Tiara"`,
  };
}

export default async function Tweet({ params }: TweetProps) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboard) redirect("/onboarding");

  const result = await getTweet(params.id);
  // const result = await getTweet(id);

  return (
    <section>
      <h1 className="text-heading3-bold text-white">Home</h1>
      <div className="mt-9 flex flex-col gap-10">
        <TweetCard
          key={result._id}
          id={result._id}
          currentUserId={user?.id || ""}
          image={result.image}
          parentId={result.parentId}
          content={result.text}
          author={result.author}
          community={result.community}
          createdAt={result.createdAt}
          comments={result.children}
          likes={result.likes}
          userInfoId={userInfo._id}
        />
      </div>
      <div className="mt-7">
        <Comment
          tweetId={params.id}
          currentUserImg={user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
          buttonTitle="Reply"
        />
      </div>
      <div className="mt-10">
        {result.children.map((v: any) => (
          <TweetCard
            key={v._id}
            id={v._id}
            currentUserId={user.id}
            parentId={v.parentId}
            image={v.image}
            content={v.text}
            author={v.author}
            community={v.community}
            createdAt={v.createdAt}
            comments={v.children}
            likes={v.likes}
            userInfoId={userInfo._id}
            isComment
          />
        ))}
      </div>
    </section>
  );
}
