import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Do Humans really have a FREE WILL??",
  description: "Pick a random number between 1–100. I’m collecting real human guesses to test if we’re actually random… or predictably biased",

  openGraph: {
    title: "Do Humans really have a **FREE WILL?**",
    description:
      "Join this experiment: choose a random number (1–100) and help reveal whether humans follow a hidden pattern.",
    url: "https://dohumanshavefreewill.vercel.app/",
    siteName: "Randomness Experiment",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Do Humans really have a **FREE WILL?**",
    description:
      "Drop a 'random' number. Let’s see if humans are actually predictable ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en">
      <body >{children}</body>
    </html>
  );
}
