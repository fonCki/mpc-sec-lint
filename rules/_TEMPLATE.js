module.exports = {
    id: 'your-rule-id',
    title: 'Human title',
    severity: 'warning', // 'info'|'warning'|'error'
    docsUrl: 'https://...',
    description: 'What this rule checks and why.',
    // options: { /* default options, can be overridden from config */ },
    async match({ filePath, content, rootDir, config, rule }) {
        // Return an array of findings:
        // { message, severity?, startLine?, startCol?, endLine?, endCol? }
        return [];
    }
};
