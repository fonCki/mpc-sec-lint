const fs = require('fs');
const path = require('path');
const { findFiles } = require('./walker');
const { loadRules } = require('./loadRules');
const { toSarif } = require('./reporters/sarif');
const { loadConfig } = require('./config');

const SEV_RANK = { info: 1, warning: 2, error: 3 };

async function run({ rootDir, format, outFile, severityFail }) {
    const cfg = await loadConfig(rootDir);
    const files = await findFiles(rootDir, cfg);
    const rules = await loadRules(path.join(rootDir, 'rules'), cfg);

    const findings = [];
    for (const f of files) {
        const content = await fs.promises.readFile(f, 'utf8');
        for (const rule of rules) {
            try {
                const hits = await rule.match({ filePath: f, content, rootDir, config: cfg, rule });
                hits?.forEach(h => {
                    findings.push({
                        ruleId: rule.id,
                        title: rule.title,
                        severity: (h.severity || rule.severity || 'warning').toLowerCase(),
                        message: h.message || rule.description || '',
                        filePath: f,
                        startLine: h.startLine || 1,
                        startCol: h.startCol || 1,
                        endLine: h.endLine || h.startLine || 1,
                        endCol: h.endCol || h.startCol || 1,
                        docsUrl: rule.docsUrl || null
                    });
                });
            } catch (e) {
                findings.push({
                    ruleId: rule.id,
                    title: rule.title,
                    severity: 'info',
                    message: `Rule error: ${e.message}`,
                    filePath: f, startLine: 1, startCol: 1, endLine: 1, endCol: 1, docsUrl: rule.docsUrl || null
                });
            }
        }
    }

    if (format === 'sarif') {
        const sarif = toSarif(findings);
        const json = JSON.stringify(sarif, null, 2);
        if (outFile) {
            await fs.promises.writeFile(outFile, json, 'utf8');
            console.log(`SARIF written to ${outFile}`);
        } else {
            console.log(json);
        }
    } else {
        // Console report
        console.log('\nMCP Security Findings:');
        if (findings.length === 0) console.log('✔ No findings');
        for (const f of findings) {
            const loc = `${path.relative(rootDir, f.filePath)}:${f.startLine}:${f.startCol}`;
            const sev = f.severity.toUpperCase().padEnd(7);
            console.log(`- [${sev}] ${f.ruleId} @ ${loc}\n  ${f.message}${f.docsUrl ? `\n  docs: ${f.docsUrl}` : ''}`);
        }
    }

    const worst = findings.reduce((acc, f) => Math.max(acc, SEV_RANK[f.severity] || 0), 0);
    const failThresh = SEV_RANK[severityFail] || 0;
    return worst >= failThresh ? 1 : 0;
}

module.exports = { run };
