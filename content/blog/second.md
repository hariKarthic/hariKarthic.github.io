---
title: Gatsby and Dynamic pages
date: "2019-09-18T13:51:54.016Z"
path: "/second"
description: Starter to editing and deploying
tags: ['tech']
---


## Gatsby and dynamic pages

Setting up a simple website with Gatsby is the easiest thing ever, you just dump your pages in `src/pages` and you are done. 

But if you are adventourus, ad-vent-tur-ous , is that right? you will say let me go for JSON or MD files for data and have a proper CMS.

i did it, if i can do it anyone can. But there are **some minor  issues while setting up Gatsby pages dynamically** which prop up and it is not clearly explained where we had gone wrong.

My issue was the blog sub pages not opening up properly, i.e i would get the list of items on my home (`\`) page. But if i, say for example, go to `localhost:8000/first` if would redirect me  to a 404.

This was happening despite my GraphQL query returning proper results.

So lets dive in and hopefully thsi page will go into the massive knowledge bank of Gatsby initial setups and hiccups which is already present online.


If you are still here and are already  feeling *"urgh! just show me the code already"* , i hear you .

#### Making these assumptions

* you know React
* you have setup Gatsby and have seen your initial page in your local dev environment

Go through these links first , and if is doesn't help do come back here.

* Gatsby Home [tutorials](https://www.gatsbyjs.org/tutorial/) , reading **step1 - step 7** of this will set you up nicely.

* Deploying to [gh-pages] (https://www.gatsbyjs.org/docs/how-gatsby-works-with-github-pages/) . Github pages is an opinionated deployment solution, i am recomending it as i am using it for now. Will update if anything changes.

...

....

*Back? you really do want the code don't you?*

Allright, assuming you have setup Gatsby and are stuck somewhere .

This method is relatively straight forward. If you are using Markdown files as the source of your data, please confirm if you are using the **gatsby-transformer-remark** plugin. 

First let us look at your `gatsby-node.js` , in that file you should be having your `createPages` method , which is one of the [gatsby node APIs](https://www.gatsbyjs.org/docs/node-apis/#createPages) .




    exports.createPages = ({ actions, graphql }) => {
      const { createPage } = actions
      const blogPost = path.resolve(`./src/templates/blog-post.js`)
      return graphql(`
      {
        allMarkdownRemark(
         sort: { fields: [frontmatter___date], order: DESC }
        ) 
       {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              
              title
              
            }
          }
        }
      }
    }`).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }
    // get all posts
    const posts = result.data.allMarkdownRemark.edges;

    // Create post detail pages
    posts.forEach((post, index) => {
      createPage({
        path: post.node.frontmatter.path,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
        },
      })
    })
    })
    }

Cutting to the meat of the matter, you can see the the `createPage` method runs our graphQL query and fetches all the data. But what happens after that ? We create individual pages with `createPage`method with a specified template , mine are located at `src/templates/...` .

This should set you up , just type some localhost:8000/psfsf (an error page basically) and it should show the rest of your *"available"* pages in bottom.

If you still have the issue, check these.

* check your frontmatter in your md files, sometimes a simple duplication of the frontmatter data, such as unique paths, will cause annoying issues.
* check if you have set up your transform plugins to point to the correct folder.
*If you are using slugs (i.e translating the file name into navigable paths) make sure you have set up custom nodeFileds properly using `onCreateNode` API.


Now go out there and be somebody !!



