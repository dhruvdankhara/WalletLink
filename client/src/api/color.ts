import axios from '@/lib/axios';
import type { ApiResponse } from '@/types/response';
import type { Color } from '@/types/api/color.types';

export const getAll = async (): Promise<ApiResponse<Color[]>> => {
  const response = await axios.get('/colors');
  return response.data;
};
