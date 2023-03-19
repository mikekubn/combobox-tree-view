import "../styles/globals.css";

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  return (
    <html lang="en">
      <body className="h-screen">{children}</body>
    </html>
  );
};

export default RootLayout;
