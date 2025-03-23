import { NextRequest, NextResponse } from "next/server";

type AsyncFunction = (req: NextRequest) => Promise<NextResponse>;

export const catchAsync = (fn: AsyncFunction) => {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await fn(req);
    } catch (error: any) {
      console.error(error);
      return NextResponse.json(
        { message: "Internal Server Error", error: error.message },
        { status: 500 }
      );
    }
  };
};
