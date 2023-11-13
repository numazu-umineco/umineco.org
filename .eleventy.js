const htmlmin = require('html-minifier');
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItEleventyImg = require("markdown-it-eleventy-img");
const path = require("path");

function eleventyConfig(config) {
  config.addPassthroughCopy("src/img");
  config.addPassthroughCopy("src/css");

  config.addPlugin(EleventyHtmlBasePlugin);

  var htmlMinify = function (value, outputPath) {
    if (outputPath && outputPath.indexOf('.html') > -1) {
      return htmlmin.minify(value, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true
      });
    }
  }

  config.addTransform("htmlmin", htmlMinify);

  config.addFilter("tags", (tags) => {
    return (tags || []).filter(tag => ["all", "articles"].indexOf(tag) === -1);
  });

  // Customize Markdown library and settings:
  let markdownLibrary = markdownIt({
    html: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: "before",
      class: "anchor-link",
      symbol: "#"
    }),
    level: [1, 2, 3, 4],
  }).use(markdownItEleventyImg, {
    imgOptions: {
      outputDir: "_site/img/optimized/",
      urlPath: "/img/optimized/"
    },
    resolvePath: (filepath, env) => path.join(path.dirname(env.page.inputPath), filepath),
    globalAttributes: {
      class: "img-fluid img-thumbnail",
      decoding: "async"
    },
  });
  config.setLibrary("md", markdownLibrary);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["html", "njk", "md", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};

module.exports = eleventyConfig;
