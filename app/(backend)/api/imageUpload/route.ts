import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary"
import multer from "multer"
import { writeFile } from "fs/promises";
import path from "path";
import { catchAsync } from "@/utils/catchAsync";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer({dest: "/Flick/public/temp"})

export const POST = catchAsync(async (req: NextRequest) => {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "No valid file uploaded" }, { status: 400 });
    }

    // convert file into buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // save the file temporarily
    const tempFilePath = path.join("/Flick/public/temp", file.name);
    await writeFile(tempFilePath, buffer);

    // upload to cloudinary
    const result = await cloudinary.v2.uploader.upload(tempFilePath, {
        folder: "Flick_Post_images" // here we need to look for the folder name is correct or not
    })

    return NextResponse.json({url : result.secure_url}, {status: 200})
})