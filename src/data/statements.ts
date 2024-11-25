import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { Chef, ChefOrdersPaginator, ChefOrdersQueryOptions, ChefPaginator } from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { useQuery } from 'react-query';
import { chefOrdersClient } from './client/chef-orders';
import { statementClient } from './client/statements';

export const useStatementsQuery = (options: Partial<any>) => {
  const { data, error, isLoading } = useQuery<any, Error>(
    [API_ENDPOINTS.ORDERS, options],
    ({ queryKey, pageParam }) =>
      statementClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    statemensts: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useChefOrderQuery = ({
  id,
  language,
}: {
  id: string;
  language: string;
}) => {
  const { data, error, isLoading } = useQuery<any, Error>(
    [API_ENDPOINTS.CHEFORDERS, { id, language }],
    () => chefOrdersClient.get({ id, language }),
  );

  return {
    chefOrder: data,
    error,
    loading: isLoading,
  };
};
