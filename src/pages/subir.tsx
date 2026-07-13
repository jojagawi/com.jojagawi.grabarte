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
      {process.env.GATSBY_ENV === "development" &&
        <p>Estamos trabajando para que funcione el formulario...</p>
      }
      {process.env.GATSBY_ENV !== "development" &&
        <p>Está página no esta disponible por el momento...</p>
      }
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <SEO><script type="application/ld+json">{JSON.stringify(ldJsonData)}</script></SEO>
