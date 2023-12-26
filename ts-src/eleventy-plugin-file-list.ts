//@ts-ignore
import logger from 'cli-logger';
import fs from 'fs-extra';
import path from 'path';

// TODO: save file list as data file, let user add description
// TODO: test recurse option

type FileObject = {
  name: string;
  path: string;
  size?: number;
  extension: string;
  isSymbolicLink?: boolean;
}

type ModuleOptions = {
  targetFolder?: string;
  debugMode?: boolean;
  doRecurse?: boolean;
}

module.exports = function (eleventyConfig: any, options: ModuleOptions = {}) {

  eleventyConfig.addCollection('fileList', async (collectionApi: any) => {

    const configDefaults: ModuleOptions = {
      targetFolder: 'files',
      debugMode: false,
      doRecurse: false,
    };

    const APP_NAME = 'Eleventy-Plugin-File-List';
    const durationStr = `[${APP_NAME}] Duration`;

    // configure the logger
    var conf: any = { console: true, level: logger.INFO };
    conf.prefix = function (record: any) {
      return `[${APP_NAME}]`;
    }
    var log = logger(conf);

    // merge the defaults (first) with the provided options (second)
    const config: ModuleOptions = Object.assign({}, configDefaults, options);

    // set the logger log level
    const debugMode = options.debugMode || false;
    log.level(debugMode ? log.DEBUG : log.INFO);
    log.debug('Debug mode enabled\n');
    if (debugMode) console.dir(config);

    // validate the configuration  
    if (!config.targetFolder) {
      log.error('Missing target folder configuration option');
      process.exit(1);
    }

    var targetFolder = path.join('./', config.targetFolder);
    targetFolder = path.normalize(targetFolder);
    if (!fs.existsSync(targetFolder)) {
      log.error(`Target folder ${targetFolder} does not exist`);
      process.exit(1);
    }

    var result: FileObject[] = [];
    log.info(`Building file list from the projects's "${config.targetFolder}" folder`);
    console.time(durationStr);
    try {
      result = _getAllFiles(config.targetFolder, config.doRecurse!);
    } catch (err) {
      log.error(`Error building file list: ${err}`);
      process.exit(1);
    }

    console.timeEnd(durationStr);
    log.info(`Completed building file list, found ${result.length} files`);
    if (debugMode) console.dir(result);
    return result;
  });
}

function fixPath(thePath: string): string {
  return thePath.replace(/\\/g, '/');
}

function prependDelimiter(thePath: string): string {
  if (thePath.startsWith('/')) return thePath;
  return '/' + thePath;
}

function _getAllFiles(dirPath: string, recurse: boolean): FileObject[] {
  // a place to store all the files
  var result: FileObject[] = [];
  // get all the files in the target folder
  var files = fs.readdirSync(dirPath)
  // now process the file list
  files.forEach(function (file: string) {
    var newPath = path.join(dirPath, file);
    if (fs.statSync(newPath).isDirectory()) {
      if (recurse) result = _getAllFiles(newPath, recurse).concat(result);
    } else {
      var theFile: FileObject = {
        name: fixPath(path.basename(newPath)),
        path: prependDelimiter(fixPath(newPath)),
        extension: path.extname(newPath),
      }
      result.push(theFile);
    }
  });
  return result
}