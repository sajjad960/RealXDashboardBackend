import { Request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

// const storage = multer.diskStorage({
//   destination: async function (req: any, file, cb) {
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//       const userId: string = String(req.user.id);

//       const destinationPath = path.join(__dirname, "../files/image", userId);

//       try {
//         // Check if the folder already exists
//         await fs.access(destinationPath);
//       } catch (error) {
//         // If the folder doesn't exist, create it
//         try {
//           await fs.mkdir(destinationPath, { recursive: true });
//         } catch (err) {
//           console.error("Error creating folder:", err);
//         }
//       }

//       cb(null, destinationPath);
//     } else {
//       cb(null, path.join(__dirname, "../public/document"));
//     }
//   },
//   filename: function (req, file, cb) {
//     const name = Date.now() + "-" + file.originalname;
//     cb(null, name);
//   },
// });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "images") {
    file.mimetype === "image/jpeg" || file.mimetype === "image/png"
      ? cb(null, true)
      : cb(null, false);
  } else if (file.fieldname === "document") {
    file.mimetype === "application/msword" ||
    file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).fields([
  { name: "document", maxCount: 1 },
  { name: "images", maxCount: 2 },
]);

export = upload;
