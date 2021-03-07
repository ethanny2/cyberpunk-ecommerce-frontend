const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");
const covers = path.join(__dirname, "src/static/images/covers");
const designs = path.join(__dirname, "src/static/images/designs");
const posts = path.join(__dirname, "src/static/images/posts");
const moveToCovers = path.join(__dirname, "src/static/images/resizedCovers");
const moveToDesigns = path.join(__dirname, "src/static/images/resizedDesigns");
const moveToPosts = path.join(__dirname, "src/static/images/resizedPosts");
async function resize(imageType, imageUrl, fileName) {
  let width;
  let height;
  switch (imageType) {
    case "covers":
      (width = 300), (height = Jimp.AUTO);
      break;
    case "designs":
      (width = 300), (height = Jimp.AUTO);
      break;
    case "posts":
      (width = 300), (height = Jimp.AUTO);
      break;
    default:
      break;
  }
  const image = await Jimp.read(imageUrl);
  const outputPath = path.join(moveToCovers, fileName);
  await image.resize(width, height);
  await image.writeAsync(outputPath);
}

// resize("cover", path.join(__dirname, "src/static/images/covers/2door.jpg"), "2door");

// Make an async function that gets executed immediately
async function resizeDirectory(folderPath, imageType) {
  // Our starting point
  try {
    // Get the files as an array
    const files = await fs.promises.readdir(folderPath);
    // Loop them all with the new for...of
    for (const file of files) {
      // Get the full paths
      const fromPath = path.join(folderPath, file);
      const toPath = path.join(moveToCovers, file);
      // Stat the file to see if we have a file or dir
      const stat = await fs.promises.stat(fromPath);

      if (stat.isFile()) {
        await resize(imageType, fromPath, file);
        console.log("'%s' done resizing.", fromPath);
      } else if (stat.isDirectory()) {
        console.log("'%s' is a directory.", fromPath);
      }

      // Now move async
      // await fs.promises.rename(fromPath, toPath);

      // Log because we're crazy
      // console.log("Moved '%s'->'%s'", fromPath, toPath);
    } // End for...of
  } catch (e) {
    // Catch anything bad that happens
    console.error("We've thrown! Whoops!", e);
  }
}

resizeDirectory(covers, "covers");
