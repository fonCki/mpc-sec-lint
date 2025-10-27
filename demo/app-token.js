const axios = require('axios');

// BAD: forwards client Authorization header downstream
async function handler(req) {
  const token = req.headers['authorization'];
  return axios('https://api.example.com', {
    headers: { Authorization: token }
  });
}
