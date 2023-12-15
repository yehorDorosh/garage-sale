const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32);

const envKey = process.env.OWNER_CONTACTS_KEY;
exports.key = Buffer.from(envKey, 'hex');

exports.encrypt = (text, key) => {
  const iv = crypto.randomBytes(16);
  if (!text || !key || !iv) { return null; }
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};

exports.decrypt = (text, key) => {
  if (!text || !key || typeof text.iv !== 'string') { return null; }
  const iv = Buffer.from(text.iv, 'hex');
  const encryptedText = Buffer.from(text.encryptedData, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
