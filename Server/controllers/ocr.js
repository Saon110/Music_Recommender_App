const multer = require('multer');
const T = require('tesseract.js');
const path = require('path');


// Set up Multer to store uploaded images in the 'uploads' folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });


//detect text from image

function detectText(imagePath) {
    return new Promise((resolve, reject) => {
        T.recognize(imagePath, 'eng', { logger: m => console.log(m) })
            .then(({ data: { text } }) => {
                resolve(text);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = { upload, detectText };
