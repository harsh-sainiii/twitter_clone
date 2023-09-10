import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DeleteTweet from "../forms/DeleteTweet";
import PostButtons from "../shared/PostButtons";
import { TbMessage2, TbShare2 } from "react-icons/tb";

type TweetCardProps = {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    username: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  image: string;
  likes: string[];
  userInfoId: string;
  isDelete?: string;
};

export default function TweetCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
  image,
  likes,
  userInfoId,
  isDelete,
}: TweetCardProps) {
  return (
    //article usually used to create card
    <article
      className={`flex w-full flex-col border-b-2 border-b-dark-4 pb-5${
        isComment ? "px-0 xs:px-7" : " p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="user_community_image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>

            <div className="tweet-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1 flex gap-3 items-center">
                {author.name}
                <span className="text-[14px] text-gray-1 text-ellipsis overflow-hidden">
                  @{author.username}
                </span>
                <span className="text-[14px] text-gray-1">
                  {formatDateString(createdAt)}
                </span>
              </h4>
            </Link>

            <Link href={`/tweet/${id}`}>
              <p className="mt-2 text-small-regular text-light-2 mb-2">
                {content}
              </p>
              {image ? (
                <div className="relative h-fit overflow-auto w-full">
                  <Image
                    src={image}
                    alt="tweet_image"
                    width={500}
                    height={500}
                    className=" rounded-md col-span-1"
                  />
                </div>
              ) : (
                ""
              )}
            </Link>

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <div className="flex gap-5 text-slate-400 cursor-pointer text-heading4-medium items-center">
                  <PostButtons
                    post={id}
                    userInfoId={userInfoId}
                    likes={likes}
                  />

                  <Link
                    href={`/tweet/${id}`}
                    className="flex items-center gap-1 hover:text-sky-400 transition-all ease-out duration-200 cursor-pointer"
                  >
                    <TbMessage2 />
                    <p className="text-small-regular">{comments.length}</p>
                  </Link>

                  <TbShare2 className=" hover:text-emerald-400 transition-all ease-out duration-200 cursor-pointer" />
                </div>
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/tweet/${id}`}>
                  <p className="mt-1 text-small-regular text-gray-1">
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
        {isDelete ? (
          ""
        ) : (
          <DeleteTweet
            tweetId={JSON.stringify(id)}
            currentUserId={currentUserId}
            authorId={author.id}
            parentId={parentId}
            isComment={isComment}
          />
        )}
      </div>
      {!isComment && comments.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {comments.slice(0, 2).map((comment, index) => (
            <Image
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}

          <Link href={`/tweet/${id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}
      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {community && `${community.name} Community`}
          </p>

          <Image
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
            className="ml-1 rounded-full object-cover"
          />
        </Link>
      )}
      {/* <TweetButtons author={author1} post={id} /> */}
    </article>
  );
}
