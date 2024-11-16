const multer = require('multer');
const path = require('path')
const { S3Client } = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')

let storage;

// Checking if the storage in env is disk or S3 then using the access keys
if(process.env.STORAGE_ENGINE === "S3"){
    const s3 = new S3Client({
        region: process.env.MY_AWS_REGION,
        credentials: {
            accessKeyId: process.env.MY_AWS_ACCESS_KEY,
            secretAccessKey: process.env.MY_AWS_SECRET_KEY
        }
    });

    // Inserting into s3 storage

    storage = multerS3({
        s3: s3,
        bucket: process.env.MY_AWS_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function(req, file, cb){
            cb(null, {fieldName: file.fieldName})
        },
        key: function(req, file, cb){
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
} else{

    // Inserting into disk storage

    storage = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, 'public/uploads')
        },
        filename: function(req, file, cb){
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
}

// Making sure the files fit the correct file type and exist

const fileFilter = (req, file, cb) => {
    if(!file){
        console.log("hi");
        return cb(null, false);
    }
    else if(!file.originalname.match(/\.(jpg|jpeg|png|svg|gif)$/)){
        console.log("hi2");

        return cb(new Error('image must be valid file type'), false)
    }
    else{
        console.log("works");

        return cb(null, true)
    }
}



module.exports = multer({
    fileFilter,
    storage
})