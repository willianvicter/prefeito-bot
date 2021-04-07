/*  - Base64 UTF-8 encode Utility -
 *  please run with "node encode_64.js" and insert your text to get it encoded;
 * 
 *  Mateus Krause, 04/2021. ISC license.
 */

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

readline.question(`Insert string to enconde: `, string => {
    console.log("\nEncoded string: " + Buffer.from(string).toString('base64'));
    readline.close()
})

// To decode, use: console.log(Buffer.from("encoded string", 'base64').toString());