import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { Chef, ChefOrdersPaginator, ChefOrdersQueryOptions, ChefPaginator } from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { useQuery } from 'react-query';
import { chefOrdersClient } from './client/chef-orders';
import { ordersClient } from './client/orders';

export const useOrdersQuery = (options: Partial<any>) => {
  const { data, error, isLoading } = useQuery<any, Error>(
    [API_ENDPOINTS.ORDERS, options],
    ({ queryKey, pageParam }) =>
      ordersClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    orders: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useOrderQuery = ({
  id,
  language,
}: {
  id: string;
  language: string;
}) => {
  const { data, error, isLoading } = useQuery<any, Error>(
    [API_ENDPOINTS.ORDERS, { id, language }],
    () => ordersClient.get({ id, language }),
  );

  return {
    order: data,
    error,
    loading: isLoading,
  };
};
