const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const s3 = new aws.S3({
  accessKeyId: 'AKIA3FH427AVDCOGIFB2',
  secretAccessKey: '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',
  region: 'ap-southeast-1'
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'sajjad-test-bucket',
    acl: 'public-read', // or 'private' if you want the files to be private
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    }
  })
}).fields([
  { name: "usdzFile", maxCount: 1 },
  { name: "glbFile", maxCount: 1 },
  { name: "poster", maxCount: 1 },
]);;

export = upload;
