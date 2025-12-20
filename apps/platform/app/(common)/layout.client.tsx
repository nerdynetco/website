"use client"

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "~/auth/client";

export function LayoutClient() {
    const {data,isPending} = authClient.useSession()
    const router = useRouter();
    const pathname = usePathname()

    useEffect(()=>{
        if(isPending) return;
        if(data?.user?.id){
            if(pathname === "/sorting") return;
            if (!(data?.user?.house && data?.user?.hasCompletedSorting)) {
                router.push("/sorting")
            }
        }
    },[isPending,data,pathname])

    return null;
}