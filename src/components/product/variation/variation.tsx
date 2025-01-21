import { useRouter } from 'next/router';
import { productPlaceholder } from '@/utils/placeholders';

const ProductVariation = ({ item }: { item:any}) => {
  const { locale } = useRouter();

  return (
    <img
      src={
        item.item_image
          ? `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/media/product-images/${item.id}_${item.item_image}`
          : productPlaceholder
      }
      alt={item.item_name}
      className="product-image h-auto w-[50vw]"
    />
  );
};

export default ProductVariation;
