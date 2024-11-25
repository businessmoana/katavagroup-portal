import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const invoicesClient = {

  get(id:any) {
    return HttpClient.get<any>(`${API_ENDPOINTS.INVOICES}/${id}`,);
  },

  paginated: ({ ...params }: Partial<any>) => {
    return HttpClient.get<any>(API_ENDPOINTS.INVOICES, {
      ...params,
    });
  },
};
