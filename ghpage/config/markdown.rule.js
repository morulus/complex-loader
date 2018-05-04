const LOCAL_COMPLEX_LOADER = `complex-loader`;

function getSecondHeadings(ast) {
  const content = ast[1].children;

  const sections = content
    .filter((section) => section.type === `heading` &&
      section.depth === 2 &&
      section.children &&
      section.children[0])
    .map((section) => section.children[0].value);

  return `module.exports = ${JSON.stringify(sections)}`;
}

/* This rule is used to get all required information about markdown, includes
its heading, author, sections and html */
module.exports = {
  test: /\.md$/,
  exclude: /node_modules/,
  use: {
    loader: LOCAL_COMPLEX_LOADER,
    options: {
      metadata: {
        loader: LOCAL_COMPLEX_LOADER,
        options: {
          /* Parse for markdown document heading */
          heading: `markdown-heading-loader`,

          /* Get file commits info */
          commits: {
            loader: `git-commits-loader`
          },

          /* Parse for sections names */
          sections: [
            /* Get markdown heading with depth 2 by custom procedure */
            {
              loader: `skeleton-loader`,
              options: {
                procedure: getSecondHeadings
              }
            },
            `markdown-doc-loader`
          ]
        }
      },
      content: [
        `html-loader`,
        `markdown-loader`,
        /* Cut markdown heading */
        {
          loader: `skeleton-loader`,
          options: {
            procedure(content) {
              return content.split(`==\n`)[1];
            }
          }
        }
      ]
    }
  }
};