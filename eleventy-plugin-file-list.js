"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_logger_1 = __importDefault(require("cli-logger"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
module.exports = function (eleventyConfig, options = {}) {
    eleventyConfig.addCollection('fileList', async (collectionApi) => {
        const configDefaults = {
            targetFolder: 'files',
            debugMode: false,
            doRecurse: false,
        };
        const APP_NAME = 'Eleventy-Plugin-File-List';
        const durationStr = `[${APP_NAME}] Duration`;
        var conf = { console: true, level: cli_logger_1.default.INFO };
        conf.prefix = function (record) {
            return `[${APP_NAME}]`;
        };
        var log = (0, cli_logger_1.default)(conf);
        const config = Object.assign({}, configDefaults, options);
        const debugMode = options.debugMode || false;
        log.level(debugMode ? log.DEBUG : log.INFO);
        log.debug('Debug mode enabled\n');
        if (debugMode)
            console.dir(config);
        if (!config.targetFolder) {
            log.error('Missing target folder configuration option');
            process.exit(1);
        }
        var targetFolder = path_1.default.join('./', config.targetFolder);
        targetFolder = path_1.default.normalize(targetFolder);
        if (!fs_extra_1.default.existsSync(targetFolder)) {
            log.error(`Target folder ${targetFolder} does not exist`);
            process.exit(1);
        }
        var result = [];
        log.info(`Building file list from the projects's "${config.targetFolder}" folder`);
        console.time(durationStr);
        try {
            result = _getAllFiles(config.targetFolder, config.doRecurse, config.debugMode);
        }
        catch (err) {
            log.error(`Error building file list: ${err}`);
            process.exit(1);
        }
        console.timeEnd(durationStr);
        log.info(`Completed building file list, found ${result.length} files`);
        if (debugMode)
            console.dir(result);
        return result;
    });
};
function fixPath(thePath) {
    return thePath.replace(/\\/g, '/');
}
function prependDelimiter(thePath) {
    if (thePath.startsWith('/'))
        return thePath;
    return '/' + thePath;
}
function _getAllFiles(dirPath, recurse, debugMode) {
    var stats;
    var result = [];
    var files = fs_extra_1.default.readdirSync(dirPath);
    files.forEach(function (file) {
        var newPath = path_1.default.join(dirPath, file);
        if (fs_extra_1.default.statSync(newPath).isDirectory()) {
            if (recurse)
                result = _getAllFiles(newPath, recurse, debugMode).concat(result);
        }
        else {
            stats = fs_extra_1.default.statSync(newPath);
            if (debugMode)
                console.dir(stats);
            var theFile = {
                name: fixPath(path_1.default.basename(newPath)),
                path: prependDelimiter(fixPath(newPath)),
                extension: path_1.default.extname(newPath),
                fileSize: stats.size,
                created: stats.ctime,
                modified: stats.mtime
            };
            result.push(theFile);
        }
    });
    return result;
}
