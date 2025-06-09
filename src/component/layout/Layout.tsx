import { Nav } from "@/component/layout/Nav";
import React from "react";
import { Footer } from "../Footer";
import { StyledLayout } from "./style";
interface LayoutProps {
  children: React.ReactNode;
  visibleNav?: boolean;
  visibleFooter?: boolean;
}

export const Layout = ({
  children,
  visibleNav,
  visibleFooter,
}: LayoutProps) => {
  const getMainHeight = () => {
    let excludeHeight = 0;
    if (visibleNav) excludeHeight += 50;
    if (visibleFooter) excludeHeight += 48;
    return `calc(100% - ${excludeHeight}px)`;
  };
  return (
    <StyledLayout>
      {visibleNav && <Nav />}
      <main style={{ height: getMainHeight() }}>{children}</main>
      {visibleFooter && <Footer />}
    </StyledLayout>
  );
};

export default Layout;
