// Heuristic: Express/Fastify routes without any auth/verify/jwt middleware.
const SERVER_NEW = /(express\(\)|fastify\(|http\.createServer|Deno\.serve)/;
const ROUTE = /\.(get|post|put|delete|patch|use)\s*\(/i;
const AUTH_HINT = /(auth|verify|jwt|bearer)/i;

module.exports = {
    id: 'mcp-no-auth-http',
    title: 'HTTP route without authentication',
    severity: 'warning',
    docsUrl: 'https://modelcontextprotocol.io/specification/draft/basic/security_best_practices',
    description: 'Non-stdio transports should require auth. Add middleware/token checks.',
    async match({ content }) {
        const findings = [];
        if (!SERVER_NEW.test(content)) return findings;
        const lines = content.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
            const t = lines[i];
            if (ROUTE.test(t) && !AUTH_HINT.test(t)) {
                findings.push({
                    message: 'Route declared without obvious auth middleware (heuristic).',
                    severity: 'warning',
                    startLine: i + 1, startCol: 1, endLine: i + 1, endCol: 80
                });
            }
        }
        return findings;
    }
};
