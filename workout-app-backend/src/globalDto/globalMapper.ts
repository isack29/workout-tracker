import { GlobalSuccessResponse } from './GlobalSuccessResponse';

export const mapToGlobalSuccessResponse = (
  code: number,
  message: string,
  data?: any,
) => {
  const globalSuccessResponse: GlobalSuccessResponse = {
    success: true,
    message: message,
    statusCode: code,
    data: data,
  };

  return globalSuccessResponse;
};
