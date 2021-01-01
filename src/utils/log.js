/*
 *  Created     -=(o '.
 *       by        '.-.\
 *  Mateus         /|  \\
 *       Krause    '|  ||
 *  2020            _\_):,_
 *
 *
 * This logFile class can create logs files in JSON and add to an existing file.
 * When a new object are created, tell to the constructor the filename and location (default: logs/)
 * Any log have a date, type and message (can be arrays).
 
 * Bugs:
 *  - When the file is blanked, an error will occur
 */

// Modules require
const fs = require("fs");

// Turn to 'true' enable console.log messages
const DEBUG = false;

class LogFile {

    constructor(filename, dir = './logs/') {

        // Create complete path for the file
        this.path = dir + filename + ".json";

        try {

            // first check if directory already exists
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
                if (DEBUG == true) console.log("Directory is created and initialized.");
            } else {
                if (DEBUG == true) console.log("Directory already exists.");
            }

            // Fist check if the file already exists
            if (!fs.existsSync(this.path)) {
                fs.writeFile(this.path, '[]', (err) => {
                    if (err) throw err;
                    if (DEBUG == true) console.log("JSON file created at " + this.path);
                });
            } else {
                if (DEBUG == true) console.log("File already exists");
            }

        } catch (err) {
            console.log(err);
        }

    }

    set path(path) {
        this._path = path;
    }

    get path() {
        return this._path;
    }

    get date() {
        let today = new Date();
        let date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return date + ' ' + time;
    }

    pushLog(data) {

        fs.readFile(this.path, 'utf8', (err, filedata) => {
            // Parse filedata from JSON
            let obj = JSON.parse(filedata); //now it is an object

            // Add date element on the object
            data = Object.assign({ "date": this.date }, data);

            // Add new data on the obj
            obj.push(data);
            // Convert it back to json
            let json = JSON.stringify(obj);
            //Write it back on the file
            fs.writeFile(this.path, json, 'utf8', (err) => {
                if (err) console.log(`Error writing file: ${err}`);
            });

            console.log("Logged: " + JSON.stringify(data));
        });

    }

}

module.exports.LogFile = LogFile;