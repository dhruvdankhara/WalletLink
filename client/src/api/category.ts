import axios from '@/lib/axios';
import type { ApiResponse } from '@/types/response';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/api/category.type';

export const getAll = async (): Promise<ApiResponse<Category[]>> => {
  const response = await axios.get('/categories');
  return response.data;
};

export const create = async (
  data: CreateCategoryRequest
): Promise<ApiResponse<Category>> => {
  const response = await axios.post('/categories', data);
  return response.data;
};

export const deleteCategory = async (
  id: string
): Promise<ApiResponse<void>> => {
  const response = await axios.delete(`/categories/${id}`);
  return response.data;
};

export const update = async (
  id: string,
  data: UpdateCategoryRequest
): Promise<ApiResponse<Category>> => {
  const response = await axios.post(`/categories/${id}`, data);
  return response.data;
};
