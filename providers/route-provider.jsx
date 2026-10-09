"use client";

import { useRouter } from "next/navigation";
import { RouterProvider } from "react-aria-components";

export const RouteProvider = ({ children }) => {
    const router = useRouter();

    return <RouterProvider navigate={(href) => router.push(href)}>{children}</RouterProvider>;
};
