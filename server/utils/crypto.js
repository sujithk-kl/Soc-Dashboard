// server/utils/crypto.js

const crypto = require('crypto');

// Load a 32-byte key from env (base64 or hex). Fallback to in-memory random for dev.
function loadKey() {
    const envKey = process.env.AES_KEY;
    if (envKey) {
        try {
            // Try base64 first
            let key = Buffer.from(envKey, 'base64');
            if (key.length !== 32) {
                // Try hex
                key = Buffer.from(envKey, 'hex');
            }
            if (key.length !== 32) {
                throw new Error('AES_KEY must be 32 bytes in base64 or hex');
            }
            return key;
        } catch (e) {
            throw new Error('Invalid AES_KEY. Provide a 32-byte key in base64 or hex');
        }
    }
    // Dev fallback: ephemeral key (will break decryption across restarts)
    const key = crypto.randomBytes(32);
    console.warn('[crypto] AES_KEY not set. Using ephemeral key (development only).');
    return key;
}

const KEY = loadKey();
let warnedDecryptFail = false;

// AES-256-GCM encrypt a UTF-8 string
function encryptString(plainText) {
    if (plainText === undefined || plainText === null) return null;
    const iv = crypto.randomBytes(12); // 96-bit nonce for GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
    const ciphertext = Buffer.concat([cipher.update(String(plainText), 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
        iv: iv.toString('base64'),
        tag: authTag.toString('base64'),
        data: ciphertext.toString('base64'),
        kid: 'k0', // placeholder for future key rotation
    };
}

// AES-256-GCM decrypt to UTF-8 string (tolerant)
function decryptToString(enc) {
    if (!enc || !enc.iv || !enc.tag || !enc.data) return null;
    try {
        const iv = Buffer.from(enc.iv, 'base64');
        const tag = Buffer.from(enc.tag, 'base64');
        const data = Buffer.from(enc.data, 'base64');
        const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
        decipher.setAuthTag(tag);
        const plain = Buffer.concat([decipher.update(data), decipher.final()]);
        return plain.toString('utf8');
    } catch (e) {
        // Likely encrypted with a different key; avoid crashing API responses
        if (!warnedDecryptFail) {
            console.warn('[crypto] Warning: Failed to decrypt a value (key mismatch or corrupted data). Returning null.');
            warnedDecryptFail = true;
        }
        return null;
    }
}

module.exports = { encryptString, decryptToString };


