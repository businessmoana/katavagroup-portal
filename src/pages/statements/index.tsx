import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import Search from '@/components/common/search';
import { adminOnly } from '@/utils/auth-utils';
import { SortOrder } from '@/types';
import PageHeading from '@/components/common/page-heading';
import { useRouter } from 'next/router';
import { useSettingsQuery } from '@/data/settings';
import StatementList from '@/components/statement/list';
import { useStatementsQuery } from '@/data/statements';
import Select from '@/components/ui/select/select';

const limitOptions = [
  {
    value: 10,
  },
  {
    value: 25,
  },
  {
    value: 50,
  },
  {
    value: 100,
  },
];

export default function AllStatementPage() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState<any>(limitOptions[0]);
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { statemensts, paginatorInfo, loading, error } = useStatementsQuery({
    search: searchTerm,
    limit: limit.value,
    page,
    orderBy,
    sortedBy,
  });

  const { settings, loading: loadingSettings } = useSettingsQuery({
    language: locale!,
  });
  if (loading || loadingSettings)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  function handleLimit(current: any) {
    setLimit(current);
  }
  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4 flex justify-center items-center gap-5">
          <PageHeading title={'Statements'} />
          <Select
            options={limitOptions}
            getOptionLabel={(option: any) => option.value}
            getOptionValue={(option: any) => option.value}
            onChange={handleLimit}
            value={limit}
          ></Select>
        </div>
        <div className="flex w-full flex-col items-center ms-auto md:w-1/2 md:flex-row">
          {/* <Search
            onSearch={handleSearch}
            placeholderText={t('form:input-placeholder-search-name')}
          /> */}
        </div>
      </Card>
      <StatementList
        statements={statemensts}
        isAdmin={statemensts.isAdmin}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
        isMultiCommissionRate={Boolean(
          settings?.options?.isMultiCommissionRate,
        )}
      />
    </>
  );
}
AllStatementPage.authenticate = {
  permissions: adminOnly,
};
AllStatementPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
