const fg = require('fast-glob');
const path = require('path');

async function findFiles(rootDir, cfg) {
    const entries = await fg(cfg.include, { cwd: rootDir, ignore: cfg.exclude, dot: false, absolute: true });
    return entries.map(e => path.resolve(e));
}

module.exports = { findFiles };
