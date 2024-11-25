import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

export const statementClient = {

  get(id:any) {
    return HttpClient.get<any>(`${API_ENDPOINTS.STATEMENTS}/${id}`,);
  },

  paginated: ({ ...params }: Partial<any>) => {
    return HttpClient.get<any>(API_ENDPOINTS.STATEMENTS, {
      ...params,
    });
  },
};
