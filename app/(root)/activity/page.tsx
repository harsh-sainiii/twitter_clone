import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import Link from "next/link";
import Image from "next/image";

export default async function Activity() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboard) redirect("/onboarding");

  const result = await getActivity(userInfo._id);
  return (
    <>
      <h1 className="head-text">Notifications</h1>

      <section className="mt-10 flex flex-col gap-5">
        {result.length > 0 ? (
          <>
            {result.map((v) => (
              <Link key={v._id} href={`/tweet/${v.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={v.author.image}
                    alt="user_logo"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-blue">{v.author.name}</span>
                    replied to your tweet "{v.text}"
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">
            No Notifications yet
          </p>
        )}
      </section>
    </>
  );
}
