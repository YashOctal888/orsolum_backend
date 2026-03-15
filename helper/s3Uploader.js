import multer from "multer";
import { s3 } from "./s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const generateRandomName = (length = 16) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `${Date.now()}-${result}`;
};

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
});

export const uploadImageToS3 = async (file) => {
    try {
        const ext = file.originalname.split(".").pop();
        const fileName = `images/${generateRandomName()}.${ext}`;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        await s3.send(new PutObjectCommand(params));

        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw error;
    }
};