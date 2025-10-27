// Flags forwarding of client Authorization header to downstream fetch/axios.
// Guidance: issue server-audience tokens; do not proxy client tokens.
const AUTH_READ = /\b(req|request)\s*\.\s*headers\s*\[\s*['"]authorization['"]\s*\]/i;
const AUTH_FWD_AXIOS = /axios\s*\([\s\S]*headers\s*:\s*\{[\s\S]*Authorization\s*:\s*(req|request)\s*\.\s*headers\s*\[\s*['"]authorization['"]\s*\]/i;
const AUTH_FWD_FETCH = /fetch\s*\([\s\S]*\{\s*headers\s*:\s*\{[\s\S]*Authorization\s*:\s*(req|request)\s*\.\s*headers\s*\[\s*['"]authorization['"]\s*\]/i;

module.exports = {
    id: 'mcp-token-passthrough',
    title: 'Token passthrough (anti-pattern)',
    severity: 'warning',
    docsUrl: 'https://modelcontextprotocol.io/specification/draft/basic/security_best_practices',
    description: 'Forwarding client Authorization downstream breaks audience control; issue server tokens instead.',
    async match({ content }) {
        const findings = [];
        if (AUTH_READ.test(content) && (AUTH_FWD_AXIOS.test(content) || AUTH_FWD_FETCH.test(content))) {
            findings.push({
                message: 'Client Authorization header appears forwarded downstream (axios/fetch).',
                severity: 'warning',
                startLine: 1, startCol: 1, endLine: 1, endCol: 1
            });
        }
        return findings;
    }
};
