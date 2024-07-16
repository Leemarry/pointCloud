const CryptJS = require('crypto-js')

// 加密
export function doEncrypt(msgString, publicKey) {
    let msg = msgString;
    if (typeof(msgString) !== 'string') {
        msg = JSON.stringify(msgString);
    }
    const sm2 = require('sm-crypto').sm2;
    // 1 - C1C3C2；	0 - C1C2C3；	默认为1
    const cipherMode = 1
    const publicKey2 = publicKey
        // 加密结果
    const encryptData = sm2.doEncrypt(msg, publicKey2, cipherMode);
    // 加密后的密文前需要添加04，后端才能正常解密
    const encrypt = '04' + encryptData;
    return encrypt;
};

// 解密
export function doDecryptStr(enStr, privateKey) {
    let msg = enStr
    if (typeof(enStr) !== 'string') {
        msg = JSON.stringify(enStr);
    }
    const sm2 = require('sm-crypto').sm2;
    // 1 - C1C3C2；	0 - C1C2C3；	默认为1
    const cipherMode = 1
    const privateKey1 = privateKey
        // 加密后的密文，需要前去掉04。因为doDecrypt中自行添加了04，后端加密代码也自行添加了04
        // let en = enStr.data
    if (msg.substr(0, 2) === '04') {
        msg = msg.substr(2)
    }
    // 解密结果
    const doDecrypt = sm2.doDecrypt(msg, privateKey1, cipherMode);
    // 解密后类型转换
    const objData = JSON.parse(doDecrypt)
    return objData;
};


// base编码
export function Base64Encode(data) {
    var wordArray = CryptJS.enc.Utf8.parse(data);
    var base64 = CryptJS.enc.Base64.stringify(wordArray);
    return base64;
};
// base解码
export function Base64Decode(data) {
    var parsedWordArray = CryptJS.enc.Base64.parse(data);
    var parsedStr = parsedWordArray.toString(CryptJS.enc.Utf8);
    return parsedStr;
};