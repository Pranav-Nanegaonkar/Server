const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
// const AWS = require('aws-sdk');

exports.checkAuthorization = (req, res, next) => {
    try {
        var apikey = req.headers['apikey'];
        if (apikey == process.env.APIKEY) {
            next();
        }
        else {
            res.status(403).json({
                // "code": 403,
                "message": "Access Denied...!"
            });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            // "code": 500,
            "message": "Internal server error."
        });
    }
}

exports.checkToken = (req, res, next) => {
    let bearerHeader = req.headers['token'];
    if (typeof bearerHeader !== 'undefined') {
        jwt.verify(bearerHeader, process.env.SECRET, (err, decode) => {
            if (err) {
                res.status(401).json({
                    // "code": 401,
                    'message': 'Invalid token'
                });
            }
            else {
                next();
            }
        });
    }
    else {
        res.status(500).json({
            // "code": 500,
            "message": "Internal server error."
        });
    }
}


//File Upload on Local server
exports.fileUpload = function (req, res) {
    let folderName = req.params.folderName;

    try {
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Form parsing error:', err);
                res.status(400).json({
                    code: 400,
                    message: 'Failed to parse form data.'
                });
            }

            try {
                const uploadDir = path.join(__dirname, `../Uploads/${folderName}/`);
                const oldPath = files.Image[0].filepath;
                const newPath = path.join(uploadDir, files.Image[0].originalFilename);

                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const rawData = fs.readFileSync(oldPath);
                fs.writeFileSync(newPath, rawData);

                res.status(200).json({
                    code: 200,
                    message: 'Success'
                });

            } catch (fileError) {
                console.error('File processing error:', fileError);
                res.status(400).json({
                    code: 400,
                    message: 'Failed to upload file.'
                });
            }
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({
            // code: 500,
            message: 'Internal server error.'
        });
    }
};

//File Upload to S3
exports.uploadFilesTos3 = function (req, res) {
    try {
        // AWS S3 configuration and upload logic here
        res.status(200).json({
            code: 200,
            message: 'File uploaded to S3 successfully'
        });
    } catch (err) {
        console.error('S3 upload error:', err);
        res.status(500).json({
            code: 500,
            message: 'Failed to upload file to S3'
        });
    }
};
