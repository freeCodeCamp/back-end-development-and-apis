// 
const crypto = require("crypto");
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv("aes-256-cbc", key , iv);
let encrypted = cipher.update("Maylem", "utf8", "hex");
encrypted += cipher.final("hex");
console.log(encrypted);

const decipher = crypto.Decipheriv("aes-256-cbc", key, iv);
let decrypt = decipher.update(encrypted, "hex", "utf8");
decrypt+= decipher.final("utf8");
console.log(decrypt);
const secret = crypto.createSecretKey(crypto.randomBytes(32));
console.log(secret.export().toString('hex'));


