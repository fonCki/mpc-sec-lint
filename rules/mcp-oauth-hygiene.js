// Flags missing 'state' verification or strict redirect_uri allow-list (heuristic).
const OAUTH_FLOW = /(authorize|oauth|callback)/i;
const HAS_STATE = /(state\s*[:=]|verifyState|checkState)/i;
const REDIRECT_ALLOWLIST = /(redirect_uri_allowlist|allowedRedirects|ALLOWED_REDIRECT_URIS)/i;

module.exports = {
    id: 'mcp-oauth-hygiene',
    title: 'OAuth hygiene (state + redirect allow-list)',
    severity: 'warning',
    docsUrl: 'https://modelcontextprotocol.io/specification/draft/basic/security_best_practices',
    description: 'Use random state and strict redirect_uri allow-lists; verify both.',
    async match({ content }) {
        if (!OAUTH_FLOW.test(content)) return [];
        const missingState = !HAS_STATE.test(content);
        const missingRedirectList = !REDIRECT_ALLOWLIST.test(content);
        const findings = [];
        if (missingState) findings.push({ message: 'No obvious OAuth state generation/verification found.', severity: 'warning', startLine: 1, startCol: 1, endLine: 1, endCol: 1 });
        if (missingRedirectList) findings.push({ message: 'No obvious redirect_uri allow-list present.', severity: 'warning', startLine: 1, startCol: 1, endLine: 1, endCol: 1 });
        return findings;
    }
};
