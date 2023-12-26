# Eleventy Plugin File List

An Eleventy Plugin that creates a collection containing metadata from a list of all files in a specified folder.

## Usage



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


## Demonstration

This repository contains a demo Eleventy site that demonstrations the plugin's capabilities. To run the demo, clone this repository to your local development system, then execute the following steps:

1. Create a folder in the cloned project folder called `files`.
2. Copy some files into the newly created folder
3. Open terminal window and navigate to the project folder
4. execute `npm install`
5. execute `npm start`

At this point, Eleventy will build the project and display a link you can click to view the sample page (http://localhost:8080 as shown in the text below):

```shell
D:\dev\11ty\eleventy-plugin-file-list>npm start

> eleventy-plugin-file-list@0.0.0 start
> tsc && eleventy --serve

[Eleventy-Plugin-File-List] Building file list from the projects's "files" folder
[Eleventy-Plugin-File-List] Duration: 0.516ms
[Eleventy-Plugin-File-List] Completed building file list, found 4 files
[11ty] Writing _site/index.html from ./src/index.liquid
[11ty] Copied 7 files / Wrote 1 file in 0.24 seconds (v2.0.1)
[11ty] Watching…
[11ty] Server at http://localhost:8080/
```

![Sample App Page](images/image-01.png)


*** 

If this code helps you, please consider buying me a coffee.

<a href="https://www.buymeacoffee.com/johnwargo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
