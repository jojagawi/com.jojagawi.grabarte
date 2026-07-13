import React, {ReactNode} from "react";
import Header from "./structure/Header";
import Footer from "./structure/Footer";
import { Helmet } from "react-helmet";


interface Props {
  children?: ReactNode
}

const Layout = ({ children } : Props) => {
  return (
    <>
      <Helmet>
        <html lang="es" />
      </Helmet>
      <div className="layout-container">
        <Header />
        <main className="content">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};



export default Layout;
