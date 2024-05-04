const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: process.env.REGION
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKETNAME,
    acl: 'public-read', // or 'private' if you want the files to be private
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      // Check file type and assign folder path accordingly
      if (file.fieldname === "poster") {
        cb(null, "public/posters/" + Date.now().toString() + '-' + file.originalname);
      } else {
        cb(null, "public/models/" + Date.now().toString() + '-' + file.originalname);
      }
    }
  })
}).fields([
  { name: "usdzFile", maxCount: 1 },
  { name: "glbFile", maxCount: 1 },
  { name: "poster", maxCount: 1 },
]);;

export = upload;
