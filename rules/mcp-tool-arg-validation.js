// Warn if tool handlers appear to use args without schema validation (heuristic).
const TOOL_REGISTER = /(tools?\s*:\s*\[|registerTool\(|addTool\()/i;
const VALIDATION_HINT = /(zod|schema|ajv|yup|parse\(|safeParse\(|validate\(|isValid\()/i;
const ARGS_USE = /\bargs\.[a-zA-Z_][a-zA-Z0-9_]*/;

module.exports = {
    id: 'mcp-tool-arg-validation',
    title: 'Tool argument validation missing',
    severity: 'info',
    docsUrl: 'https://modelcontextprotocol.io/specification/draft/basic/security_best_practices',
    description: 'Validate tool arguments (Zod/JSON Schema) before use.',
    async match({ content }) {
        if (!TOOL_REGISTER.test(content)) return [];
        const usesArgs = ARGS_USE.test(content);
        const hasValidation = VALIDATION_HINT.test(content);
        if (usesArgs && !hasValidation) {
            return [{ message: 'Tool args used without obvious schema/validation.', severity: 'info', startLine: 1, startCol: 1, endLine: 1, endCol: 1 }];
        }
        return [];
    }
};
