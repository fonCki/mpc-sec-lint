const test = require('node:test');
const assert = require('node:assert/strict');
const rule = require('../rules/mcp-dangerous-exec');

async function runRule(content) {
    return rule.match({ filePath: 'example.js', content });
}

test('flags rm -rf usage via child_process.exec', async () => {
    const source = [
        "const cp = require('child_process');",
        "child_process.exec('rm -rf /tmp/sensitive');"
    ].join('\n');

    const findings = await runRule(source);
    assert.equal(findings.length, 1);

    const hit = findings[0];
    const execLine = source.split('\n')[1];
    const expectedStart = execLine.indexOf('rm -rf') + 1;

    assert.equal(hit.severity, 'error');
    assert.equal(hit.startLine, 2);
    assert.equal(hit.startCol, expectedStart);
    assert.equal(hit.endCol, expectedStart + 'rm -rf'.length);
    assert.match(hit.message, /dangerous shell execution/i);
});

test('flags sudo usage via child_process.execSync', async () => {
    const source = [
        "const cp = require('child_process');",
        "child_process.execSync('sudo apt-get install');"
    ].join('\n');

    const findings = await runRule(source);
    assert.equal(findings.length, 1);

    const hit = findings[0];
    const execLine = source.split('\n')[1];
    const expectedStart = execLine.indexOf('sudo') + 1;

    assert.equal(hit.startLine, 2);
    assert.equal(hit.startCol, expectedStart);
    assert.equal(hit.endCol, expectedStart + 'sudo'.length);
});

test('does not flag benign executions', async () => {
    const source = [
        "const cp = require('child_process');",
        "child_process.spawn('ls', ['-la']);"
    ].join('\n');

    const findings = await runRule(source);
    assert.equal(findings.length, 0);
});
