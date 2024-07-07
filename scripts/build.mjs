import { readFile, writeFile, readdir, stat } from 'node:fs/promises';

const data = {};

const extract = {
  fileExtension: (path) => {
    const filePathRegex = /.*\./gim;
    const match = path.match(filePathRegex);

    return !match ? path : path.replace(match[0], '');
  },

  folderName: (path, level = 1) => {
    const levels = path.split(/[\/\\]/).filter((dir) => dir !== '');

    return level == 1 ? levels[levels.length - 1] : levels.slice(levels.length - level);
  },
};

const space = (level) => ' '.repeat(Math.max(0, level) * 2);

const genMDLink = (name, url, level) => `[**${name}**](<${url}>)`;

const genContent = (path, curData, dir, level) => {
  if (!curData || !Object.keys(curData).length) return genMDLink(dir, path, level);

  const isRoot = level === -1;

  return Object.keys(curData)
    .map((key) => {
      return `${!isRoot ? space(level) + '-' : '\n###'} ${Object.keys(curData[key]).length ? key + '\n' : ''}${
        isRoot ? '\n' : ''
      }${genContent(path + '/' + key, curData[key], key, level + 1)}`;
    })
    .join('\n');
};

const goToLeaf = async (path, level) => {
  if ('js,html,md,css'.split(',').includes(extract.fileExtension(path))) return data;
  if ('js,assets,scss,css,img'.split(',').includes(extract.folderName(path))) return data;

  const folderSlugs = extract.folderName(path, level);

  (function add(data, level) {
    if (level == folderSlugs.length) return;
    if (!data.hasOwnProperty(folderSlugs[level])) data[folderSlugs[level]] = {};

    add(data[folderSlugs[level]], level + 1);
  })(data, 2);

  const stats = await stat(path);
  if (stats.isFile()) return data;

  const subDirs = await readdir(path);
  await Promise.all(
    subDirs.map(
      (subDir) =>
        new Promise(async (resolve) => {
          resolve(goToLeaf(`${path}/${subDir}`, level + 1, data));
        })
    )
  );

  return data;
};

(async function getData() {
  try {
    const header = await readFile('./md/header.md', 'utf8');
    const upcoming = await readFile('./md/upcoming.md', 'utf8');
    const refs = await readFile('./md/refs.md', 'utf8');

    const topDirs = await readdir('./src');
    await Promise.all(topDirs.map((dir) => goToLeaf(`./src/${dir}/`, 3)));

    const content = genContent(`./src`, data, '', -1);

    await writeFile('./README.md', `${header}${content}\n\n${upcoming}\n${refs}`, { flag: 'w' });
  } catch (error) {
    console.log(error);
  }
})();
