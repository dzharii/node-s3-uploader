import * as util from 'util';
import * as fs from 'fs';

export const writeFileAsync = util.promisify(fs.writeFile);
export const appendFileAsync = util.promisify(fs.appendFile);
export const statsAsync = util.promisify(fs.stat);