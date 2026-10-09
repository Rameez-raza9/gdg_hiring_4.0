import { Inter } from "next/font/google";
import { RouteProvider } from "@/providers/route-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata = {
    title: "GDGoC SVEC 4.0 | Recruitment & Leadership Applications",
    description: "Official recruitment platform for Google Developer Groups On Campus SVEC 4.0. Join technical wings, organize developer flagship summits, and build real-world systems.",
    icons: {
        icon: "/assets/gdgoc-svec-mark.svg",
    },
};

export const viewport = {
    colorScheme: "light dark",
    themeColor: "#0284c7",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning className={`${inter.variable} scroll-smooth`}>
            <body className="bg-primary antialiased min-h-screen text-neutral-900 dark:text-neutral-100 selection:bg-sky-500 selection:text-white">
                <RouteProvider>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </RouteProvider>
            </body>
        </html>
    );
}
