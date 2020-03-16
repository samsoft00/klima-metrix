/* eslint-disable arrow-parens */
import { parse } from 'csv';
import fs from 'fs';

/**
 * Parse with csv.js.org into array of arrays
 * @param file
 */

const parseCsvStream = (file: string): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const output: string[][] = [];

    const parser = parse({
      columns: true,
      skip_lines_with_error: true,
      delimiter: ','
    });

    fs.createReadStream(file)
      .pipe(parser)
      .on('data', chuck => output.push(chuck))
      .on('error', error => reject(new Error(error.message || String(error))))
      .on('end', () => resolve(output));
  });
};

export default parseCsvStream;
