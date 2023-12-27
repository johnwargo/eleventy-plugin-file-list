const fileList = require('./eleventy-plugin-file-list.js');

module.exports = eleventyConfig => {

  const debugMode = false;
  const doRecurse = false;
  eleventyConfig.addPlugin(fileList, { targetFolder: 'files', debugMode, doRecurse });

  eleventyConfig.addPassthroughCopy('src/assets/');
  eleventyConfig.addPassthroughCopy('files/');

  eleventyConfig.addFilter("commaize", function (num, locale = "en-us") {
		return num.toLocaleString(locale);
	});
  
	eleventyConfig.addFilter("dateOnly", function (dateVal, locale = "en-us") {
		var theDate = new Date(dateVal);
		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		return theDate.toLocaleDateString(locale, options);
	});

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