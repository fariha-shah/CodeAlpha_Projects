import CryptoJS from 'crypto-js';

// Room ID se secret key banate hain
const getKey = (roomId) => {
  return CryptoJS.SHA256(roomId + 'commapp_secret').toString();
};

// Encrypt
export const encrypt = (data, roomId) => {
  try {
    const key = getKey(roomId);
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      key
    ).toString();
    return encrypted;
  } catch (err) {
    console.error('Encryption error:', err);
    return data;
  }
};

// Decrypt
export const decrypt = (encryptedData, roomId) => {
  try {
    const key = getKey(roomId);
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (err) {
    console.error('Decryption error:', err);
    return encryptedData;
  }
};

// Hash password (for display purposes)
export const hashData = (data) => {
  return CryptoJS.SHA256(data).toString();
};
