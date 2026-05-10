"use client";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@wac/components/Loading";

interface PropsType {
  params: { lng: string };
}

export default function Settings({ params: { lng } }: PropsType) {
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (pathname === `/${lng}/settings`) router.push(`/${lng}/settings/shop`);
  }, [pathname]);
  return <Loading customHeight="70vh"></Loading>;
}
