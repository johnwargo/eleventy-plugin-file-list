# Eleventy Plugin File List

An Eleventy Plugin that creates a collection containing metadata from a list of all files in a specified folder.

This repository contains a demo Eleventy site that demonstrations the plugin's capabilities. To run the demo, clone this repository to your local development system, then execute the following steps:

1. create a folder called `files`
2. Copy some files into the newly created files folder
3. open terminal window
4. execute `npm install`
5. execute `npm start`


![Sample App Page](images/image-01.png)

```typescript
const configDefaults: ModuleOptions = {
  targetFolder: 'files',
  debugMode: false,
  doRecurse: false,
};
```




```js
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
```

*** 

If this code helps you, please consider buying me a coffee.

<a href="https://www.buymeacoffee.com/johnwargo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
