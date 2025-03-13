import { connect } from "@/app/lib/dbConn";
import User from '@/app/models/userModel'
import { NextResponse } from "next/server";
import { catchAsync } from '@/app/utils/catchAsync'

connect();

export const POST = catchAsync(async (req) => {
    const reqBody = await req.json();
    const {username, email} = reqBody;

    console.log(reqBody)

    // check if user already exists or not
    // const user = await User.findOne({email});
    // if(user){
    //     return NextResponse.json({error: "User already exists"}, {status: 400})
    // }

    const newUser = new User({
        username,
        email
    })

    const savedUser = await newUser.save();

    return NextResponse.json({
        message: "User created successfully",
        success: true,
        savedUser
    })
})