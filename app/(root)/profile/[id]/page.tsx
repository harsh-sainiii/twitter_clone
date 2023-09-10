import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { profileTabs } from "@/constants";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchUser } from "@/lib/actions/user.actions";
import TweetsTab from "@/components/shared/TweetsTab";
import { getUserLikes } from "@/lib/actions/like.actions";
import LikesTab from "@/components/shared/LikesTab";
import { TbHeart, TbMessage2, TbPhoto } from "react-icons/tb";
import { cache } from "react";
import { Metadata } from "next";

type UserProfileParams = {
  params: { id: string };
};

const getUser = cache(async (id: string) => {
  const result = await fetchUser(id);
  if (!result) return null;
  return result;
});

export async function generateMetadata({
  params,
}: UserProfileParams): Promise<Metadata> {
  const user = await getUser(params.id);
  return {
    title: `${user.name} (@${user.username}) | Twitter by Goldie Tiara"`,
  };
}

export default async function UserProfile({ params }: UserProfileParams) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await getUser(params.id);
  if (!userInfo?.onboard) redirect("/onboarding");

  const LikePosts = await getUserLikes(userInfo._id);

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />
      <div>
        <Tabs defaultValue="tweets" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <p className=" text-heading3-bold">
                  {tab.value === "tweets" ? (
                    <TbMessage2 />
                  ) : tab.value === "media" ? (
                    <TbPhoto />
                  ) : (
                    <TbHeart />
                  )}
                </p>
                <p className="max-sm:hidden pl-3">{tab.label}</p>
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="tweets" className="w-full text-light-1">
            <TweetsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              userInfoId={userInfo._id}
              accountType="User"
            />
          </TabsContent>
          <TabsContent value="media" className="w-full text-light-1">
            <TweetsTab
              currentUserId={user.id}
              accountId={userInfo.id}
              userInfoId={userInfo._id}
              accountType="Media"
            />
          </TabsContent>
          <TabsContent value="likes" className="w-full text-light-1">
            <LikesTab
              userInfoId={LikePosts._id}
              accountId={LikePosts.likes}
              isDelete={userInfo._id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
