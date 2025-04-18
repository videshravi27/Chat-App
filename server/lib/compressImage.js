const sharp = require("sharp");

const compressImage = async (imageBuffer) => {
  try {
    const compressedBuffer = await sharp(imageBuffer)
      .resize({ width: 800 })
      .jpeg({ quality: 80 }) 
      .toBuffer();

    return compressedBuffer;
  } catch (error) {
    console.error("Image Compression Error:", error);
    throw new Error("Image compression failed");
  }
};

module.exports = { compressImage };
