/*
 * @Date: 2024-07-16 09:54:48
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\utils\cryptoUtil.js
 * @Description: Do not edit
 */
// DES 加密 crypto-js
import CryptJS from 'crypto-js'

// 加密所需的key,个人设置，不能泄密
const KEY = 'efsdfe124587jshqcgszmghstcw54735'

// DES加密
export function encryptDes(message) {
    var keyHex = CryptJS.enc.Utf8.parse(KEY)
    var option = { mode: CryptJS.mode.ECB, padding: CryptJS.pad.Pkcs7 }
    var encrypted = CryptJS.DES.encrypt(message, keyHex, option)
    return encrypted.ciphertext.toString()
}

// DES解密
export function decryptDes(message) {
    var keyHex = CryptJS.enc.Utf8.parse(KEY)
    var decrypted = CryptJS.DES.decrypt({
        ciphertext: CryptJS.enc.Hex.parse(message)
    },
    keyHex, {
        mode: CryptJS.mode.ECB,
        padding: CryptJS.pad.Pkcs7
    }
    )
    return decrypted.toString(CryptJS.enc.Utf8)
}

/**
 * AES 加密
 * @param _content 待加密内容
 * @param _key aesKey
 * @param _iv 初始化向量
 * @return 返回经 BASE64 处理之后的密文
 */
export function encryptAes(_content, _key, _iv) {
    if (typeof (_content) !== 'string') {
        _content = JSON.stringify(_content)
    }
    // 先以 UTF-8 编码解码参数 返回 any 类型
    const content = CryptJS.enc.Utf8.parse(_content);
    const aesKey = CryptJS.enc.Utf8.parse(_key);
    const iv = CryptJS.enc.Utf8.parse(_iv);

    // 加密
    const encrypted = CryptJS.AES.encrypt(content, aesKey, {
        iv: iv,
        mode: CryptJS.mode.CBC,
        padding: CryptJS.pad.Pkcs7
    })
    // console.log(encrypted)
    return CryptJS.enc.Base64.stringify(encrypted.ciphertext);
}

/**
 * AES 解密
 * @param：_content 待解密的内容[Base64处理过的]
 * @param：解密用的 AES key
 * @param: 初始化向量
 * @return 返回以 UTF-8 处理之后的明文
 */
export function decryptAes(_content, _key, _iv) {
    // let content = CryptJS.enc.Base64.parse(_content);
    // content = CryptJS.enc.Base64.stringify(content);
    const aesKey = CryptJS.enc.Utf8.parse(_key);
    const iv = CryptJS.enc.Utf8.parse(_iv);

    // 解密
    const decrypted = CryptJS.AES.decrypt(_content, aesKey, {
        iv: iv,
        mode: CryptJS.mode.CBC,
        padding: CryptJS.pad.Pkcs7
    })
    // console.log(decrypted)
    const doDecrypt = decrypted.toString(CryptJS.enc.Utf8);
    return JSON.parse(doDecrypt)
}
