const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
//const encrypt = require("./Encrypt");
//const decrypt = require("./Decrypt");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));

const upload = multer({ dest: "uploads/" });

// function textToNumericArray(text) {
//     return text.toLowerCase().split("").map(c => c.charCodeAt(0) - 97);
// }

// function normalizeKey(text, key) {
//     let k = key;
//     if (text.length !== key.length) {
//         let j = 0;
//         k = "";
//         for (let i = 0; i < text.length; i++) {
//             if (j === key.length) j = 0;
//             k += key[j++];
//         }
//     }
//     return k.toLowerCase().split("").map(c => c.charCodeAt(0) - 97);
// }

// function numericToText(arr) {
//     return arr.map(n => String.fromCharCode(n + 97)).join("");
// }


// Utility: clean text (only lowercase a-z)
  function cleanInput(text) {
    return text.toLowerCase().replace(/[^a-z]/g, '');
  }

  // Utility: generate repeating key for given length
  function generateKey(key, length) {
    key = cleanInput(key);
    let fullKey = '';
    for (let i = 0; i < length; i++) {
      fullKey += key[i % key.length];
    }
    return fullKey;
  }

  // Vigenere encrypt
  function vigenereEncrypt(plainText, key) {
    plainText = cleanInput(plainText);
    const fullKey = generateKey(key, plainText.length);
    let encrypted = '';
    for (let i = 0; i < plainText.length; i++) {
      const ptChar = plainText.charCodeAt(i) - 97;
      const keyChar = fullKey.charCodeAt(i) - 97;
      const encryptedChar = (ptChar + keyChar) % 26;
      encrypted += String.fromCharCode(encryptedChar + 97);
    }
    return encrypted;
  }

  // Vigenere decrypt
  function vigenereDecrypt(cipherText, key) {
    cipherText = cleanInput(cipherText);
    const fullKey = generateKey(key, cipherText.length);
    let decrypted = '';
    for (let i = 0; i < cipherText.length; i++) {
      const ctChar = cipherText.charCodeAt(i) - 97;
      const keyChar = fullKey.charCodeAt(i) - 97;
      const decryptedChar = (ctChar - keyChar + 26) % 26;
      decrypted += String.fromCharCode(decryptedChar + 97);
    }
    return decrypted;
  }



app.post("/api/encrypt", (req, res) => {
    const { text, key } = req.body;
    // const textArr = textToNumericArray(text);
    // const keyArr = normalizeKey(text, key);
    // const encrypted = encrypt(textArr, keyArr);
    const result = vigenereEncrypt(text,key);
    res.json({ result });
});

app.post("/api/decrypt", (req, res) => {
    const { text, key } = req.body;
    // const textArr = textToNumericArray(text);
    // const keyArr = normalizeKey(text, key);
    // const decrypted = decrypt(textArr, keyArr);
    const result = vigenereDecrypt(text,key);
    res.json({ result });
});

app.post("/api/file/encrypt", upload.fields([{ name: "textFile" }, { name: "keyFile" }]), (req, res) => {
    const text = fs.readFileSync(req.files["textFile"][0].path, "utf8");
    const key = fs.readFileSync(req.files["keyFile"][0].path, "utf8");
    const textArr = textToNumericArray(text);
    const keyArr = normalizeKey(text, key);
    const encrypted = encrypt(textArr, keyArr);
    const result = numericToText(encrypted);
    res.json({ result });
});

app.post("/api/file/decrypt", upload.fields([{ name: "textFile" }, { name: "keyFile" }]), (req, res) => {
    const text = fs.readFileSync(req.files["textFile"][0].path, "utf8");
    const key = fs.readFileSync(req.files["keyFile"][0].path, "utf8");
    const textArr = textToNumericArray(text);
    const keyArr = normalizeKey(text, key);
    const decrypted = decrypt(textArr, keyArr);
    const result = numericToText(decrypted);
    res.json({ result });
});

const buildPath = path.join(__dirname, "../client/build/index.html");

app.get("/*", (req, res) => {
  res.sendFile(buildPath);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));