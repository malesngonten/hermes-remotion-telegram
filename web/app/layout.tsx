export const metadata = {
  title: "Hermes Remotion Studio",
  description: "View rendered Remotion videos inside Telegram.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
