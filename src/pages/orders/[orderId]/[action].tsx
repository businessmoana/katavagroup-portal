import Layout from '@/components/layouts/admin';
import ChefCreateOrUpdateForm from '@/components/chef/chef-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Config } from '@/config';
import { useRouter } from 'next/router';
import { useOrderItemsQuery } from '@/data/chef-orders';
import OrderItems from '@/components/orders/order-item';
import Button from '@/components/ui/button';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { adminOnly } from '@/utils/auth-utils';
import { useOrderQuery } from '@/data/orders';
import Order from '@/components/orders/order';

export default function UpdateOrdersPage() {
  const { query, locale } = useRouter();
  const router = useRouter();
  const { t } = useTranslation();
  const { order, loading, error } = useOrderQuery({
    id: query.orderId as string,
    language:
      query.action!.toString() === 'view' ? locale! : Config.defaultLanguage,
  });

  const { orderItems } = useOrderItemsQuery({
    id: query.orderId as string,
    language:
      query.action!.toString() === 'view' ? locale! : Config.defaultLanguage,
  });
  const categorizedData = orderItems?.reduce((acc: any, item: any) => {
    const category = item.kategorija_naziv;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="flex pb-5 border-b border-dashed border-border-base md:pb-7">
        <h1 className="text-lg font-semibold text-heading">Order review</h1>
      </div>
      <Order order={order} />
      {categorizedData
        ? Object?.keys(categorizedData)?.map((category) => (
            <div key={category}>
              <h2 className="text-base font-semibold text-heading pb-2">
                {category}
              </h2>
              <OrderItems orderItems={categorizedData[category]} />
            </div>
          ))
        : ''}
      <StickyFooterPanel className="z-0">
        <div className="text-end">
          <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>
        </div>
      </StickyFooterPanel>
    </>
  );
}
UpdateOrdersPage.authenticate = {
  permissions: adminOnly,
};
UpdateOrdersPage.Layout = Layout;
export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
