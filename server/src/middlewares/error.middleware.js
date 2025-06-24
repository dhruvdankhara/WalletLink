import ApiError from "../utils/ApiError.js";
import { removeMulterImageFilesOnError } from "../utils/helper.js";

const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    error = new ApiError(
      err.statusCode || 500,
      error.message,
      error?.errors || [],
      error.stack
    );
  }

  removeMulterImageFilesOnError(req);

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

export default errorHandler;
