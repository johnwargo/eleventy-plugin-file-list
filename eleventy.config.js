const fileList = require('./eleventy-plugin-file-list.js');

module.exports = eleventyConfig => {

  const debugMode = false;
  const doRecurse = false;
  eleventyConfig.addPlugin(fileList, { targetFolder: 'files', debugMode, doRecurse });

  eleventyConfig.addPassthroughCopy('src/assets/');
  eleventyConfig.addPassthroughCopy('files/');

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data'
    }
  }
};