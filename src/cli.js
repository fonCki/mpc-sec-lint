const { run } = require('./index');

(async () => {
    // Minimal arg parsing
    const args = process.argv.slice(2);
    const get = (flag, def) => {
        const i = args.indexOf(flag);
        return i >= 0 ? (args[i + 1] || true) : def;
    };
    const pathArg = get('--path', process.cwd());
    const format = get('--format', 'console');        // 'console' | 'sarif'
    const out = get('--out', null);                   // file path for SARIF
    const severityFail = (get('--fail-on', 'error') || 'error').toLowerCase(); // 'off'|'info'|'warning'|'error'

    const exitCode = await run({ rootDir: pathArg, format, outFile: out, severityFail });
    process.exit(exitCode);
})();
