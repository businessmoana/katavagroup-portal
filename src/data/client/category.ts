import {
  Category,
  CategoryPaginator,
  CategoryQueryOptions,
  CreateCategoryInput,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const categoryClient = {
  ...crudFactory<Category, QueryOptions, CreateCategoryInput>(
    API_ENDPOINTS.CATEGORIES
  ),
  get() {
    return HttpClient.get<any>(`${API_ENDPOINTS.CATEGORIES}`);
  },

  paginated: ({ type, name, self, ...params }: Partial<CategoryQueryOptions>) => {
    return HttpClient.get<CategoryPaginator>(API_ENDPOINTS.CATEGORIES, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({ type, name }),
    });
  },
};
