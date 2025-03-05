const path = require("path");

const htmlmin = require('html-minifier');
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

const { DateTime } = require("luxon");

const Image = require("@11ty/eleventy-img");

const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItEleventyImg = require("markdown-it-eleventy-img");

function eleventyConfig(config) {
  const distDir = '_site';
  const srcDir = 'src';

  config.addPassthroughCopy("src/img");
  config.addPassthroughCopy("src/events/**/*.png");
  config.addPassthroughCopy("src/events/**/*.jpg");
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

  config.addFilter('dateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'Asia/Tokyo' }).toFormat('yyyy年M月d日');
  });

  config.addNunjucksAsyncShortcode('eyecatchImageUrl', async function (src, baseUrl) {
    const { url, outputPath } = this.page;
    const itemDir = baseUrl ? path.dirname(baseUrl) : path.dirname(url);
    const outputDir = baseUrl ? path.join(distDir, path.dirname(baseUrl)) : path.dirname(outputPath);
    console.log(outputDir);
    const imageSrc = path.join(srcDir, itemDir, src);
    const metadata = await Image(imageSrc, {
      widths: [600],
      formats: ["jpeg"],
      urlPath: itemDir,
      outputDir: outputDir,
    });

    const data = metadata.jpeg[0];
    return data.url;
  });

  // Customize Markdown library and settings:
  let markdownLibrary = markdownIt({
    html: true,
    linkify: true
  }).use(markdownItAnchor, {
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
      input: srcDir,
      output: distDir,
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["html", "njk", "md", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};

module.exports = eleventyConfig;
