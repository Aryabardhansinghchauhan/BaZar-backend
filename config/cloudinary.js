import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (filePath) => {

    console.log("CLOUDINARY_NAME:", process.env.CLOUDINARY_NAME);
    console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
    console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        if (!filePath) return null;

        const uploadResult = await cloudinary.uploader.upload(filePath);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return uploadResult.secure_url;

    } catch (error) {

        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        console.log("Cloudinary Error:", error);
        return null;
    }
}

export default uploadOnCloudinary;