import Image from 'next/image';
import usePrice from '@/utils/use-price';
import { productPlaceholder } from '@/utils/placeholders';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { AddToCart } from '@/components/cart/add-to-cart/add-to-cart';
import { useTranslation } from 'next-i18next';
import { PlusIcon } from '@/components/icons/plus-icon';
import { Product, ProductType } from '@/types';

interface Props {
  item: any;
}

const ProductCard = ({ item }: Props) => {
  const { t } = useTranslation();
  const { id, item_name,item_brand, item_image, productItem } = item ?? {};

  const { openModal } = useModalAction();

  function handleVariableProduct() {
    return openModal('SELECT_PRODUCT_VARIATION', id);
  }

  return (
    <div className="cart-type-neon h-full overflow-hidden rounded border border-border-200 bg-light shadow-sm transition-all duration-200 hover:shadow-md">
      <div
        className="relative flex h-48 w-auto cursor-pointer items-center justify-center sm:h-64"
        onClick={handleVariableProduct}
      >
        <img
          src={
            item_image
              ? `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/media/product-images/${id}_${item_image}`
              : productPlaceholder
          }
          alt={item_name}
          className="product-image h-full"
        />
      </div>

      <header className="p-3 md:p-6">
        <h3 className="mb-4 truncate text-lg font-bold">
          {item_name}
        </h3>
        <div className="mb-4">
          Brand: {item_brand}
        </div>
        <div className="mb-4">
          Packing size: {productItem.package}
        </div>
        <div className="mb-2 flex items-center">
          <span className="text-sm font-semibold md:text-lg text-[green]">
            ${productItem.price}
          </span>
        </div>
        <AddToCart variant="neon" data={item} />
      </header>
    </div>
  );
};

export default ProductCard;
