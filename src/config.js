const fs = require('fs');
const path = require('path');

async function loadConfig(rootDir) {
    const defaults = {
        include: ['**/*.js', '**/*.ts'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**', '**/coverage/**', '**/.next/**', '**/out/**'],
        rules: { } // { 'rule-id': { enabled: true, ...customOpts } }
    };
    const candidates = ['.mcp-sec-lint.json', '.mcp-sec-lintrc', '.mcp-sec-lint.config.json'];
    for (const f of candidates) {
        const p = path.join(rootDir, f);
        if (fs.existsSync(p)) {
            try {
                const cfg = JSON.parse(await fs.promises.readFile(p, 'utf8'));
                return { ...defaults, ...cfg };
            } catch { /* ignore */ }
        }
    }
    return defaults;
}

module.exports = { loadConfig };
