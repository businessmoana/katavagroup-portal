import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const ordersClient = {

  get({ id, language }: { id: string; language: string }) {
    return HttpClient.get<any>(`${API_ENDPOINTS.ORDERS}/${id}`, {
      language,
    });
  },
  paginated: ({ ...params }: Partial<any>) => {
    return HttpClient.get<any>(API_ENDPOINTS.ORDERS, {
      ...params,
    });
  },
};
