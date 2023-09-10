"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { deleteTweet } from "@/lib/actions/tweet.actions";

interface Props {
  tweetId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

export default function DeleteTweet({
  tweetId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  if (currentUserId !== authorId || pathname === "/") return null;

  return (
    <Image
      src="/assets/delete.svg"
      alt="delete"
      width={18}
      height={18}
      className="cursor-pointer object-contain"
      onClick={async () => {
        await deleteTweet(JSON.parse(tweetId), pathname);
        if (!parentId || !isComment) {
          router.push("/");
          // PR: user profile
        }
      }}
    />
  );
}
