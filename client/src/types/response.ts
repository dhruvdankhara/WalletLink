// success response
export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

// error response
export type ApiErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: string | Record<string, any>;
};
