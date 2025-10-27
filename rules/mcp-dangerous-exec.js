// Detects risky shell execution patterns likely relevant to "Local MCP server compromise"
const DANGEROUS = /(rm\s+-rf\b|sudo\b|curl\s+-d\s+@|wget\b|powershell\b|Invoke-WebRequest\b|npx\b)/i;

function* scanLines(content) {
    const lines = content.split(/\r?\n/);
    let idx = 0;
    for (let i = 0; i < lines.length; i++) {
        yield { i, text: lines[i], offset: idx };
        idx += lines[i].length + 1;
    }
}

module.exports = {
    id: 'mcp-dangerous-exec',
    title: 'Dangerous command execution',
    severity: 'error',
    docsUrl: 'https://modelcontextprotocol.io/specification/draft/basic/security_best_practices',
    description: 'Use of exec/spawn with dangerous commands. Require explicit approval/sandbox.',
    async match({ filePath, content }) {
        const findings = [];
        for (const { i, text } of scanLines(content)) {
            if (!/child_process\.(exec|execSync|spawn)\s*\(/.test(text)) continue;
            const match = text.match(DANGEROUS);
            if (match) {
                const col = match.index + 1;
                const endCol = col + match[0].length;
                findings.push({
                    message: 'Potentially dangerous shell execution (rm -rf, sudo, curl -d @, wget, npx, powershell).',
                    severity: 'error',
                    startLine: i + 1, startCol: col, endLine: i + 1, endCol
                });
            }
        }
        return findings;
    }
};
