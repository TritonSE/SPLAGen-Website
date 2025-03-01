import { SideNavbar } from "../components";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="layout-container">
          <SideNavbar />
          <section className="viewPort">
            <main>{children}</main>
          </section>
        </div>
      </body>
    </html>
  );
}
