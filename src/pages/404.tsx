import * as React from "react"
import { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout";
import {SEO} from "../components/seo";


const NotFoundPage: React.FC<PageProps> = () => {
  const env = process.env.GATSBY_ENV;
  return (
    <Layout>
      <p>Página no encontrada</p>
    </Layout>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <SEO title={"Página no encontrada"}/>
