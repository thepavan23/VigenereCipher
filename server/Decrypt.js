function decrypt(cipher, key) {
    const result = [];
    for (let i = 0; i < cipher.length; i++) {
        result.push((cipher[i] - key[i] + 26) % 26);
    }
    return result;
}
module.exports = decrypt;