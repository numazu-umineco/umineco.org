const htmlmin = require('html-minifier');

function eleventyConfig(config) {
  config.addPassthroughCopy("src/img");
  config.addPassthroughCopy("src/css");

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

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "includes",
      data: "data",
    },
    templateFormats: ["html", "njk", "md", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};

module.exports = eleventyConfig;
