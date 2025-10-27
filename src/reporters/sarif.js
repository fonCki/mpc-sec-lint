const path = require('path');

function toSarif(findings) {
    const rulesIndex = {};
    const rules = [];
    let ruleIdx = 0;

    const results = findings.map(f => {
        if (!(f.ruleId in rulesIndex)) {
            rulesIndex[f.ruleId] = ruleIdx++;
            rules.push({
                id: f.ruleId,
                name: f.title || f.ruleId,
                shortDescription: { text: f.message.slice(0, 120) || f.title || f.ruleId },
                helpUri: f.docsUrl || undefined,
                defaultConfiguration: { level: toLevel(f.severity) }
            });
        }
        return {
            ruleId: f.ruleId,
            level: toLevel(f.severity),
            message: { text: f.message },
            locations: [{
                physicalLocation: {
                    artifactLocation: { uri: fileUri(f.filePath) },
                    region: {
                        startLine: f.startLine || 1,
                        startColumn: f.startCol || 1,
                        endLine: f.endLine || f.startLine || 1,
                        endColumn: f.endCol || f.startCol || 1
                    }
                }
            }]
        };
    });

    return {
        $schema: "https://json.schemastore.org/sarif-2.1.0.json",
        version: "2.1.0",
        runs: [{
            tool: { driver: { name: "mcp-sec-lint", rules } },
            results
        }]
    };
}

function toLevel(sev) {
    const s = (sev || '').toLowerCase();
    if (s === 'error') return 'error';
    if (s === 'warning') return 'warning';
    return 'note';
}
function fileUri(p) {
    return p.replace(/\\/g, '/');
}

module.exports = { toSarif };
