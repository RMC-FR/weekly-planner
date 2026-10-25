// Weekly Planner — Google Drive storage.
// Deploy as a web app (Execute as: Me, Who has access: Anyone).
// The planner page talks to it with the secret key below; keep the deployed copy private.
// This repo copy has a placeholder; the real key only lives in the deployed script.

const SYNC_KEY = 'REPLACE_WITH_SECRET_KEY';
const FILE_NAME = 'weekly-planner-data.json';

function getFile_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('FILE_ID');
  if (id) {
    try { return DriveApp.getFileById(id); } catch (e) { /* deleted: create a new one */ }
  }
  const f = DriveApp.createFile(FILE_NAME, JSON.stringify({ version: 1, cards: [], updatedAt: 0 }), MimeType.PLAIN_TEXT);
  props.setProperty('FILE_ID', f.getId());
  return f;
}

function read_() {
  try { return JSON.parse(getFile_().getBlob().getDataAsString() || '{}'); }
  catch (e) { return { version: 1, cards: [], updatedAt: 0 }; }
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (!e || !e.parameter || e.parameter.key !== SYNC_KEY) return out_({ ok: false, error: 'unauthorized' });
  return out_({ ok: true, data: read_() });
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: 'bad request' }); }
  if (!body || body.key !== SYNC_KEY) return out_({ ok: false, error: 'unauthorized' });
  const data = body.data;
  if (!data || !Array.isArray(data.cards)) return out_({ ok: false, error: 'bad data' });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const cur = read_();
    // never let an older copy overwrite a newer one
    if ((cur.updatedAt || 0) > (data.updatedAt || 0)) return out_({ ok: true, stale: true, data: cur });
    getFile_().setContent(JSON.stringify(data));
    return out_({ ok: true, updatedAt: data.updatedAt || 0 });
  } finally {
    lock.releaseLock();
  }
}

// Run once from the editor to grant Drive access and create the data file.
function setup() {
  Logger.log('Data file: ' + getFile_().getUrl());
}
