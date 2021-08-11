import CryptoJS from "crypto-js";

export function encrypt(inputData, certId) {
    return CryptoJS.AES.encrypt(JSON.stringify(inputData), certId + process.env.REACT_APP_SALT).toString();  
}