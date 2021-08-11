import CryptoJS from "crypto-js";


export function decrypt(encryptedData, certId) {
    let bytes = CryptoJS.AES.decrypt(encryptedData, certId + process.env.REACT_APP_SALT);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}