"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Bottombar() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((v) => {
          const isActive =
            (pathname.includes(v.route) && v.route.length > 1) ||
            pathname === v.route;
          return (
            <Link
              href={v.route}
              key={v.label}
              className={`bottombar_link ${isActive && ` bg-blue`}`}
            >
              <Image src={v.imgURL} alt={v.label} width={24} height={24} />
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {v.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
