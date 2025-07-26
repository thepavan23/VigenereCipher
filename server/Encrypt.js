function encrypt(string, key) {
    const result = [];
    for (let i = 0; i < string.length; i++) {
        result.push((string[i] + key[i]) % 26);
    }
    return result;
}
module.exports = encrypt;