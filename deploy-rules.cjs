// Script to deploy Firestore security rules using service account credentials
require('dotenv').config();
const https = require('https');
const crypto = require('crypto');

const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
const projectId = sa.project_id;

// Build a signed JWT for the service account
function makeJwt() {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: sa.client_email,
    sub: sa.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat,
    exp,
    scope: 'https://www.googleapis.com/auth/firebase https://www.googleapis.com/auth/cloud-platform',
  })).toString('base64url');
  const pk = crypto.createPrivateKey(sa.private_key);
  const sig = crypto.sign('sha256', Buffer.from(`${header}.${payload}`), pk).toString('base64url');
  return `${header}.${payload}.${sig}`;
}

function post(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const buf = Buffer.from(body);
    const req = https.request({ hostname, path, method: 'POST', headers: { ...headers, 'Content-Length': buf.length } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', reject);
    req.write(buf);
    req.end();
  });
}

function put(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const buf = Buffer.from(body);
    const req = https.request({ hostname, path, method: 'PUT', headers: { ...headers, 'Content-Length': buf.length } }, res => {
      let d = '';
      console.log('PUT status:', res.statusCode, path);
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', reject);
    req.write(buf);
    req.end();
  });
}

function patch(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const buf = Buffer.from(body);
    const req = https.request({ hostname, path, method: 'PATCH', headers: { ...headers, 'Content-Length': buf.length } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', reject);
    req.write(buf);
    req.end();
  });
}

const rules = require('fs').readFileSync('firestore.rules', 'utf8');

async function deploy() {
  // 1. Get access token
  const jwt = makeJwt();
  const tokenBody = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
  const tokenRes = JSON.parse(await post('oauth2.googleapis.com', '/token', { 'Content-Type': 'application/x-www-form-urlencoded' }, tokenBody));
  if (!tokenRes.access_token) throw new Error('Failed to get access token: ' + JSON.stringify(tokenRes));
  const token = tokenRes.access_token;
  console.log('✓ Got access token');

  // 2. List existing releases to find correct release name
  const listRes = await new Promise((resolve, reject) => {
    const req = https.request({ hostname: 'firebaserules.googleapis.com', path: `/v1/projects/${projectId}/releases`, method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d));
    });
    req.on('error', reject);
    req.end();
  });
  const releases = JSON.parse(listRes);
  console.log('Existing releases:', JSON.stringify(releases?.releases?.map(r => r.name)));

  // 3. Create a new ruleset
  const rulesetBody = JSON.stringify({
    source: { files: [{ name: 'firestore.rules', content: rules }] },
  });
  const rulesetRes = JSON.parse(await post('firebaserules.googleapis.com', `/v1/projects/${projectId}/rulesets`, { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, rulesetBody));
  if (!rulesetRes.name) throw new Error('Failed to create ruleset: ' + JSON.stringify(rulesetRes));
  console.log('✓ Created ruleset:', rulesetRes.name);

  // 4. Update all cloud.firestore releases
  const firestoreReleases = (releases?.releases ?? []).filter(r => r.name.includes('cloud.firestore'));
  if (firestoreReleases.length === 0) {
    console.log('No existing Firestore release found, creating one...');
    firestoreReleases.push({ name: `projects/${projectId}/releases/cloud.firestore` });
  }

  // DEBUG: GET the existing release to inspect field names
  const getRelRes = await new Promise((resolve, reject) => {
    const req = https.request({ hostname: 'firebaserules.googleapis.com', path: `/v1/projects/${projectId}/releases/cloud.firestore`, method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d));
    });
    req.on('error', reject);
    req.end();
  });
  console.log('Existing cloud.firestore release:', getRelRes);

  for (const rel of firestoreReleases) {
    // DELETE the existing release, then re-CREATE it pointing at the new ruleset
    await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'firebaserules.googleapis.com',
        path: `/v1/${rel.name}`,
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d)); });
      req.on('error', reject);
      req.end();
    });
    console.log('✓ Deleted old release:', rel.name);

    const createBody = JSON.stringify({ name: rel.name, rulesetName: rulesetRes.name });
    const rawCreate = await post(
      'firebaserules.googleapis.com',
      `/v1/projects/${projectId}/releases`,
      { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      createBody
    );
    const createRes = JSON.parse(rawCreate);
    if (createRes.error) throw new Error('Failed to create release: ' + JSON.stringify(createRes.error));
    console.log('✓ Created release:', createRes.name, '→', createRes.rulesetName);
  }

  console.log('\n✅ Firestore rules deployed — listings collection is now publicly readable.');
}

deploy().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
