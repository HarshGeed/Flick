export const catchAsync = (fn) => {
  return async (req) => {
    try {
      return await fn(req);
    } catch (error) {
      console.error(error);
      return Response.json(
        { message: "Internal Server Error", error: error.message },
        { status: 500 }
      );
    }
  };
};
