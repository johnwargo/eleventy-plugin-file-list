//@ts-ignore
import logger from 'cli-logger';
import fs from 'fs-extra';
import path from 'path';

// TODO: save file list as data file, let user add description
// TODO: file stats (size, date, etc.)

type FileObject = {
  name: string;
  path: string;
  extension: string;
  fileSize?: number;
  created?: Date;
  modified?: Date;
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
      result = _getAllFiles(config.targetFolder, config.doRecurse!, config.debugMode!);
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

function _getAllFiles(dirPath: string, recurse: boolean, debugMode: boolean): FileObject[] {
  var stats: fs.Stats;
  var result: FileObject[] = [];
  var files = fs.readdirSync(dirPath)
  files.forEach(function (file: string) {
    var newPath = path.join(dirPath, file);
    if (fs.statSync(newPath).isDirectory()) {
      if (recurse) result = _getAllFiles(newPath, recurse, debugMode).concat(result);
    } else {
      stats = fs.statSync(newPath);
      if (debugMode) console.dir(stats);
      var theFile: FileObject = {
        name: fixPath(path.basename(newPath)),
        path: prependDelimiter(fixPath(newPath)),
        extension: path.extname(newPath),
        fileSize: stats.size,
        created: stats.ctime,
        modified: stats.mtime
      }
      result.push(theFile);
    }
  });
  return result
}