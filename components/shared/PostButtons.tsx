"use client";
import { createLike } from "@/lib/actions/like.actions";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { TbHeart, TbHeartFilled } from "react-icons/tb";

type PostButtonsProps = {
  userInfoId: string;
  post: string;
  likes: string[];
};
export default function PostButtons({
  userInfoId,
  post,
  likes,
}: PostButtonsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = useState<boolean>(false);

  async function addLike() {
    setPending(true);
    await createLike({
      userInfoId: userInfoId,
      post: post,
      path: pathname,
    });
    setPending(false);
    router.refresh();
  }
  return (
    <div
      className="flex gap-1 cursor-pointer items-center group"
      onClick={() => addLike()}
    >
      {likes.includes(userInfoId) ? (
        <TbHeartFilled
          className={
            pending ? ` animate-pulse text-pink-700` : ` text-pink-700`
          }
        />
      ) : (
        <TbHeart
          className={
            pending
              ? ` animate-bounce group-hover:text-pink-700 text-gray-400`
              : ` group-hover:text-pink-700 text-gray-400`
          }
        />
      )}
      <span
        className={
          likes.includes(userInfoId)
            ? ` text-small-regular text-pink-700`
            : ` text-small-regular text-gray-400 group-hover:text-pink-700`
        }
      >
        {likes.length > 0 ? likes.length : ""}
      </span>
    </div>
  );
}
