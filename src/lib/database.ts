import fs from 'fs';
import path from 'path';

const filePath = path.resolve('doc/data.json');
const contents = fs.readFileSync(filePath, { encoding: 'utf8' });

/**
 * Database simulation class
 */
export default class Database {
  /**
   * Fetch companies from database
   */
  static fetch(): string[] {
    return JSON.parse(contents);
  }

  /**
   * Update company record
   * @param {string} id
   * @param {object} payload
   */
  static insert(data: any) {}
}
