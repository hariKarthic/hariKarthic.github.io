const path = require("path")
const _ = require("lodash");
const { createFilePath } = require(`gatsby-source-filesystem`);

// onCreateNode is called whenever a new node is created or updated.
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    console.log("**NODE TYPE***", node.internal.type);
    const fileNode = getNode(node.parent)
    console.log(`\n`, fileNode.relativePath)
    const slugVal = createFilePath({ node, getNode, basePath: `content/blog/` })
    createNodeField({
      node,
      name: `slug`,
      value: slugVal,
    })
  }
};

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
 //const tagTemplate = path.resolve(`./src/templates/tags.js`);


  return graphql(`
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
        edges {
         
          node {
            fields {
              slug
            }
            frontmatter {
              path
              title
              tags
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }


    // get all posts
    const posts = result.data.allMarkdownRemark.edges;

    console.log("POSTS HERE");

    console.log(JSON.stringify(posts, null, 4))

    // Create post detail pages
    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node
      createPage({
        path: post.node.frontmatter.path,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    // // Tag pages:
    // let tags = []
    // // Iterate through each post, putting all found tags into `tags`
    // _.each(posts, edge => {
    //   if (_.get(edge, "node.frontmatter.tags")) {
    //     tags = tags.concat(edge.node.frontmatter.tags)
    //   }
    // })
    // // Eliminate duplicate tags
    // tags = _.uniq(tags)

    // // Make tag pages
    // tags.forEach(tag => {
    //   createPage({
    //     path: `/tags/${_.kebabCase(tag)}/`,
    //     component: tagTemplate,
    //     context: {
    //       tag,
    //     },
    //   })
    // });


  })
}
