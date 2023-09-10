import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { FaTwitter } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { dark } from "@clerk/themes";
import Image from "next/image";

export default function Topbar() {
  return (
    <nav className="topbar ">
      <Link href={"/"} className="flex items-end justify-end gap-3">
        <Image
          src={"/logo.png"}
          alt="twitter-logo"
          width={35}
          height={35}
        ></Image>{" "}
        <p className=" text-light-1 text-heading4-medium">Twitter</p>
      </Link>
      <div className=" flex items-center gap-1">
        <div className=" block md:hidden"></div>
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div>
    </nav>
  );
}
