import axios from '@/lib/axios';
import type { ApiResponse } from '@/types/response';
import type { Icon } from '@/types/api/icon.types';

export const getAll = async ({
  type,
}: {
  type: 'account' | 'category';
}): Promise<ApiResponse<Icon[]>> => {
  const response = await axios.get('/icons', { params: { type } });
  return response.data;
};
