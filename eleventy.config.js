const fileList = require('./eleventy-plugin-file-list.js');

module.exports = eleventyConfig => {

  const debugMode = false;
  // eleventyConfig.addPlugin(fileList, { debugMode });
  eleventyConfig.addPlugin(fileList, { targetFolder: 'files', debugMode });
  // eleventyConfig.addPlugin(fileList, {targetFolder: 'files', doRecurse: false, debugMode});
  // eleventyConfig.addPlugin(fileList, {targetFolder: 'files', doRecurse: true, debugMode});

  eleventyConfig.addPassthroughCopy('src/assets/');

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