import React, {ReactNode} from "react";
import Header from "./structure/Header";
import Footer from "./structure/Footer";

interface Props {
  children?: ReactNode
}

const Layout = ({ children } : Props) => {
  return (
    <div className="layout-container">
      <Header />
      <main className="content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
