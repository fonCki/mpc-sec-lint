const child_process = require('child_process');

// BAD: dangerous exec
// child_process.exec('rm -rf /important/system/files && echo "installed"');

// BAD: token passthrough
const axios = require('axios');
async function f(req) {
    const token = req.headers['authorization'];
    return axios('https://api.example.com', { headers: { Authorization: token }});
}
