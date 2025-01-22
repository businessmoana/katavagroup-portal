import Cart from '@/components/cart/cart';
import CartCounterButton from '@/components/cart/cart-counter-button';
import Card from '@/components/common/card';
import Search from '@/components/common/search';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import Layout from '@/components/layouts/admin';
import ProductCard from '@/components/product/card';
import CategoryTypeFilter from '@/components/filters/category-type-filter';
import Drawer from '@/components/ui/drawer';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import NotFound from '@/components/ui/not-found';
import Pagination from '@/components/ui/pagination';
import { useUI } from '@/contexts/ui.context';
import { useProductsQuery, useLocationsQuery } from '@/data/product';
import { Category, Product, ProductStatus, Type } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PageHeading from '@/components/common/page-heading';
import { useMeQuery } from '@/data/user';
import Select from '@/components/ui/select/select';
import { useCart } from '@/contexts/quick-cart/cart.context';

export default function ProductsPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const { data: userInfo } = useMeQuery();
  const { locations } = useLocationsQuery();
  const [visible, setVisible] = useState(false);
  const { displayCartSidebar, closeCartSidebar } = useUI();
  const [location, setLocation] = useState<any>(null);
  const { items } = useCart();
  useEffect(() => {
    if (location) localStorage.setItem('locationId', location.id);
  }, [location]);

  useEffect(() => {
    if (locations) setLocation(locations[0]);
  }, [locations]);

  const toggleVisible = () => {
    setVisible((v) => !v);
  };
  const { data, loading, paginatorInfo, error } = useProductsQuery({
    limit: 18,
    language: locale,
    search: searchTerm,
    page,
    categories: category,
    sifraId: userInfo?.role == 1 ? location?.sif_price_group_id : null,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  function handleChangeLocation(current: any) {
    setLocation(current);
  }
  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4 flex gap-5 justify-start items-center">
            <PageHeading title={t('form:input-label-create-order')} />
            {userInfo.role == 1 && (
              <Select
                options={locations}
                getOptionLabel={(option: any) => option.location_name}
                getOptionValue={(option: any) => option}
                onChange={handleChangeLocation}
                value={location}
                className="w-[200px]"
                isDisabled={items.length > 0 ? true : false}
              ></Select>
            )}
          </div>

          <div className="flex w-full flex-col items-center ms-auto md:w-2/4">
            <Search
              onSearch={handleSearch}
              placeholderText={t('form:input-placeholder-search-name')}
            />
          </div>
        </div>
        <div
          className={cn('flex w-full transition', {
            'visible h-auto': true,
            // 'invisible h-0': !visible,
          })}
        >
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
            <CategoryTypeFilter
              type={type}
              onCategoryFilter={(category: Category) => {
                setCategory(category?.id);
                setPage(1);
              }}
              className="w-full"
              enableCategory
            />
          </div>
        </div>
      </Card>
      <div className="flex space-x-5">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-6">
          {data?.map((product: Product) => (
            <ProductCard key={product.id} item={product} />
          ))}
        </div>
      </div>
      {!data?.length ? (
        <NotFound text="text-not-found" className="mx-auto w-7/12" />
      ) : null}
      <div className="mt-8 flex w-full justify-center">
        {!!paginatorInfo?.total && (
          <div className="flex items-center justify-end">
            <Pagination
              total={paginatorInfo.total}
              current={paginatorInfo.currentPage}
              pageSize={paginatorInfo.perPage}
              onChange={handlePagination}
              showLessItems
            />
          </div>
        )}
      </div>
      <CartCounterButton />
      <Drawer
        open={displayCartSidebar}
        onClose={closeCartSidebar}
        variant="right"
      >
        <DrawerWrapper hideTopBar={true}>
          <Cart />
        </DrawerWrapper>
      </Drawer>
    </>
  );
}
ProductsPage.authenticate = {
  permissions: adminOnly,
};
ProductsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
