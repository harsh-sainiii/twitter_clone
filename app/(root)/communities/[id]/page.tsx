import { currentUser } from "@clerk/nextjs";

import { communityTabs } from "@/constants";

import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import TweetsTab from "@/components/shared/TweetsTab";
import { TbMessage2, TbPhoto, TbUsers } from "react-icons/tb";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";

const getCommunity = cache(async (id: string) => {
  const result = await fetchCommunityDetails(id);
  if (!result) return null;
  return result;
});

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const community = await getCommunity(params.id);
  return {
    title: `${community.name} | Twitter by Goldie Tiara"`,
  };
}

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboard) redirect("/onboarding");

  const communityDetails = await getCommunity(params.id);

  return (
    <section>
      <ProfileHeader
        accountId={communityDetails.createdBy.id}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        type="Community"
      />

      <div>
        <Tabs defaultValue="tweets" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <p className=" text-heading3-bold">
                  {tab.value === "tweets" ? (
                    <TbMessage2 />
                  ) : tab.value === "media" ? (
                    <TbPhoto />
                  ) : (
                    <TbUsers />
                  )}
                </p>
                <p className="max-sm:hidden pl-3">{tab.label}</p>

                {tab.label === "Tweets" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {communityDetails.tweets.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="tweets" className="w-full text-light-1">
            {/* @ts-ignore */}
            <TweetsTab
              currentUserId={user.id}
              accountId={communityDetails._id}
              userInfoId={userInfo._id}
              accountType="Community"
            />
          </TabsContent>

          <TabsContent value="media" className="w-full text-light-1">
            {/* @ts-ignore */}
            <TweetsTab
              currentUserId={user.id}
              accountId={communityDetails._id}
              userInfoId={userInfo._id}
              accountType="Media"
            />
          </TabsContent>

          <TabsContent value="members" className="mt-9 w-full text-light-1">
            <section className="mt-9 flex flex-col gap-10">
              {communityDetails.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  imgUrl={member.image}
                  personType="User"
                />
              ))}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
