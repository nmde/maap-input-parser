import fs from 'node:fs/promises';
import path from 'path';

/**
 * Helper function for reading test data files.
 *
 * @param filename - The name of the file to read (no path or extension).
 * @param {boolean} [json] - If the file is JSON.
 * @returns {Promise<object>} The data JSON object.
 */
export async function readTestData(filename: string) {
  return (
    await fs.readFile(path.join('tests', 'test-data', filename))
  ).toString();
}
