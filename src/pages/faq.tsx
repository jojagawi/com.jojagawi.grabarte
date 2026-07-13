import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/Layout";
import { SEO } from "../components/seo"

let ldJsonData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "url": "https://www.grabarte.mx",
  "name": "Grab Arte",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "ventas@grabarte.mx",
    "contactType": "Sales"
  }
};

const IndexPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <p>Aquí va el F.A.Q. del sitio</p>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <SEO><script type="application/ld+json">{JSON.stringify(ldJsonData)}</script></SEO>
