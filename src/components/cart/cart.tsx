import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import CartCheckBagIcon from '@/components/icons/cart-check-bag';
import EmptyCartIcon from '@/components/icons/empty-cart';
import { CloseIcon } from '@/components/icons/close-icon';
import CartItem from '@/components/cart/item';
import { fadeInOut } from '@/utils/motion/fade-in-out';
import { formatString } from '@/utils/format-string';
import { useTranslation } from 'next-i18next';
import { useUI } from '@/contexts/ui.context';
import { Routes } from '@/config/routes';
import usePrice from '@/utils/use-price';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { orderClient } from '@/data/client/order';
// import { useAtom } from 'jotai';

const Cart = () => {
  const { t } = useTranslation('common');
  const { items, totalUniqueItems, total, resetCart } = useCart();
  const { closeCartSidebar } = useUI();

  // const [_, closeSidebar] = useAtom(drawerAtom);
  const router = useRouter();

  const handleCheckout = async () => {
    let data = {
      locationId:localStorage.getItem('locationId'),
      items: items,
      totalPrice: total,
    };
    const result = await orderClient.create(data);
    if (result) resetCart();
  };

  return (
    <section className="relative flex h-full flex-col bg-white">
      <header className="fixed top-0 z-10 flex h-16 w-full max-w-md items-center justify-between border-b border-border-200 border-opacity-75 bg-light px-6">
        <div className="flex font-semibold text-accent">
          <CartCheckBagIcon className="flex-shrink-0" width={24} height={22} />
          <span className="flex ms-2">
            {formatString(totalUniqueItems, t('text-item'))}
          </span>
        </div>
        <button
          onClick={closeCartSidebar}
          className="-me-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-muted transition-all duration-200 ms-3 hover:bg-accent hover:text-light focus:bg-accent focus:text-light focus:outline-none"
        >
          <span className="sr-only">{t('text-close')}</span>
          <CloseIcon className="h-3 w-3" />
        </button>
      </header>
      <motion.div layout className="flex-grow pb-20">
        {items.length > 0 ? (
          items?.map((item) => <CartItem item={item} key={item.id} />)
        ) : (
          <motion.div
            layout
            initial="from"
            animate="to"
            exit="from"
            variants={fadeInOut(0.25)}
            className="flex h-full flex-col items-center justify-center"
          >
            <EmptyCartIcon width={140} height={176} />
            <h4 className="mt-6 text-base font-semibold">
              No products added to cart
            </h4>
          </motion.div>
        )}
      </motion.div>
      {/* End of cart items */}

      <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light px-6 py-5">
        <button
          className={`shadow-700 flex h-12 w-full justify-between rounded-full  p-1 text-sm font-bold ${items.length > 0 ? "transition-colors bg-accent hover:bg-accent-hover focus:bg-accent-hover focus:outline-none" :"grey bg-gray-600"}   md:h-14`}
          onClick={handleCheckout}
          disabled={items.length > 0?false:true}
        >
          <span className="flex h-full flex-1 items-center px-5 text-light">
            Place the order
          </span>
          <span className="flex h-full flex-shrink-0 items-center rounded-full bg-light px-5 text-accent">
            ${total}
          </span>
        </button>
      </footer>
    </section>
  );
};

export default Cart;
