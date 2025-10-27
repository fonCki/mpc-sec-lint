const fs = require('fs');
const path = require('path');

async function loadRules(rulesDir, cfg) {
    const builtin = path.join(__dirname, '..', 'rules');
    const dirs = [builtin];
    if (fs.existsSync(rulesDir)) dirs.push(rulesDir);

    const seen = new Map();
    for (const dir of dirs) {
        if (!fs.existsSync(dir)) continue;
        const files = await fs.promises.readdir(dir);
        for (const f of files) {
            if (!f.endsWith('.js')) continue;
            const modPath = path.join(dir, f);
            // eslint-disable-next-line import/no-dynamic-require, global-require
            const rule = require(modPath);
            if (!rule || !rule.id || typeof rule.match !== 'function') continue;
            const override = (cfg.rules && cfg.rules[rule.id]) || {};
            if (override.enabled === false) continue;
            const merged = { ...rule, options: { ...(rule.options||{}), ...(override||{}) } };
            seen.set(rule.id, merged);
        }
    }
    return [...seen.values()];
}

module.exports = { loadRules };
