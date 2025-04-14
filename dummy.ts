import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { catchAsync } from "@/utils/catchAsync";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const POST = catchAsync(async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No valid file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "Flick_Post_images",
        resource_type: "auto", // handles image/video/etc
      },
      (error, result) => {
        if (error || !result) reject(error);
        else resolve(result);
      }
    );

    stream.end(buffer);
  });

  return NextResponse.json({ url: result.secure_url }, { status: 200 });
});
