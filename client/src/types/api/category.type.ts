import type { User } from './auth.types';
import type { Color } from './color.types';
import type { Icon } from './icon.types';

export interface Category {
  _id: string;
  userId: string;
  familyId: string;
  shared: boolean;
  name: string;
  iconId: string;
  colorId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  icon: Icon;
  color: Color;
}

export interface CreateCategoryRequest {
  name: string;
  iconId: string;
  colorId: string;
  shared?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  iconId?: string;
  colorId?: string;
  shared?: boolean;
}
