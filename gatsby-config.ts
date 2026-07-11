import type {GatsbyConfig} from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `GrabArte`,
    siteUrl: `https://www.grabarte.mx`
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: ["gatsby-plugin-postcss", "gatsby-plugin-image", "gatsby-plugin-sitemap", {
    resolve: 'gatsby-plugin-manifest',
    options: {
      "icon": "src/images/icon.png"
    }
  }, "gatsby-plugin-mdx", "gatsby-plugin-sharp", "gatsby-transformer-sharp", {
    resolve: 'gatsby-source-filesystem',
    options: {
      "name": "images",
      "path": "./src/images/"
    },
    __key: "images"
  }, {
    resolve: 'gatsby-source-filesystem',
    options: {
      "name": "pages",
      "path": "./src/pages/"
    },
    __key: "pages"
  },
    {
      resolve: `gatsby-source-sqlite`,
      options: {
        fileName: './data/mydb.sqlite',
        queries: [
          {
            statement: 'SELECT id, name FROM CatCategories where status = 1',
            idFieldName: 'id',
            name: 'CatCategories'
          },
          {
            statement: 'SELECT id, name FROM CatDesignsType where status = 1',
            idFieldName: 'id',
            name: 'CatDesignsType'
          },
          {
            statement: 'SELECT id, name FROM CatFileExtension where status = 1',
            idFieldName: 'id',
            name: 'CatFileExtension'
          },
          {
            statement: 'SELECT id, name FROM CatFileType where status = 1',
            idFieldName: 'id',
            name: 'CatFileType'
          },
          {
            statement: 'SELECT id, name FROM CatMaterials where status = 1',
            idFieldName: 'id',
            name: 'CatMaterials',
            // parentName: 'Designs',
            // foreignKey: 'materialId',
            // cardinality: 'OneToMany'
          },
          {
            statement: 'SELECT id, name, description, author FROM Designs where status = 1',
            idFieldName: 'id',
            name: 'Designs'
          },
          {
            statement: 'SELECT id FROM Files where status = 1',
            idFieldName: 'id',
            name: 'Files'
          },
          {
            statement: 'SELECT id FROM RelDesignsCategories',
            idFieldName: 'id',
            name: 'RelDesignsCategories'
          },
          {
            statement: 'SELECT id FROM RelDesignsFiles',
            idFieldName: 'id',
            name: 'RelDesignsFiles'
          },
          {
            statement: 'SELECT id FROM RelDesignsTypes',
            idFieldName: 'id',
            name: 'RelDesignsTypes'
          }
        ]
      }
    }


  ]
};

export default config;
