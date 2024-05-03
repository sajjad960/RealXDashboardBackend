import { NextFunction, Request, Response } from "express";
import factory from "./handleFactory";
import catchAsync from "../utils/catchAsync";
import Post from "../models/productModel";
import path from "path";
import fs from "fs/promises";
import { load } from "@tensorflow-models/coco-ssd";
import { node } from "@tensorflow/tfjs-node";
import Jimp from "jimp";

// const createUser = factory.createOne(Users);
// const getUsers = factory.getAll(Users);

interface imageObj {}

// Function to run object detection on the image
async function detectObjects(imageBuffer) {
  try {
    const model = await load();
    const image = node.decodeImage(imageBuffer);
    const predictions = await model.detect(image);
    console.log(predictions);

    return predictions;
  } catch (error) {
    console.log("getting prediction error", error);
  }
}

async function precessImages(images, postId) {
  try {
    await Promise.all(
      images?.map(async (image) => {
        const predictions = await detectObjects(image.buffer);
        const isPredictionCat = predictions?.find((prediction) => {
          return prediction?.class === "cat";
        });

        // update created post
        if (isPredictionCat) {
          const restrictedPost = await Post.update(
            {
              restricted: 1,
            },
            {
              where: {
                id: postId,
              },
            }
          );
        }
      })
    );
  } catch (error) {
    console.log("image Process Fail", error);
  }
}

const createPost = catchAsync(async (req: any, res: Response) => {
  const { text } = req.body;
  const images = req?.files?.images;
  const imagesNames = [];
  const userId = req?.user?.id;

  // create files into directory
  if (images?.length > 0) {
    await Promise.all(
      images?.map(async (image: any, i: number) => {
        const destinationPath = path.join(
          __dirname,
          "../files/image",
          String(userId)
        );

        try {
          // Check if the folder already exists
          await fs.access(destinationPath);
        } catch (error) {
          // If the folder doesn't exist, create it
          try {
            await fs.mkdir(destinationPath, { recursive: true });
          } catch (err) {
            console.error("Error creating folder:", err);
          }
        }
        // const newbuffer = await Jimp.read(e.buffer)
        //   .then((image) => {
        //     // Resize the image
        //     return image.resize(320, 192);
        //   })
        //   .then((resizedImage) => {
        //     // Get the resized image as a buffer
        //     return resizedImage.getBufferAsync("image/jpeg");
        //   })
        //   .then((buffer) => {
        //     return buffer;
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     res.status(500).send("Error resizing image.");
        //   });

        // const predictions = await detectObjects(e.buffer);

        const newFileName = Date.now() + "-" + image.originalname;
        const filePath = path.join(destinationPath, newFileName);
        await fs.writeFile(filePath, image.buffer);

        imagesNames.push(newFileName);
      })
    );
  }
  // Create the post
  const post = await Post.create({
    text,
    images: JSON.stringify(imagesNames),
    user_id: userId,
  });

  res
    .status(201)
    .json({ success: true, message: "Post created successfully", post });

  // Run Image Processing And Check If There Any Cat Available
  images?.length > 0 && precessImages(images, post.id);
});

const getUploadImages = catchAsync(async (req: any, res: Response) => {
  const userid = req.params.id;
  const imagename = req.params.imagename;
  const filePath = path.join(
    __dirname,
    "../files/image",
    String(userid),
    imagename
  );

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("File not found");
    }
  });
});
// const getAllPosts = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // get associate data
//     req.query.include=[{ model: Counter, as: "postReactions" }]
//     req.query.limit = "9"

//     factory.getAll(Post)(req, res, next);
//   }
// );;
// Export
const postController = { createPost, getUploadImages };
export = postController;
