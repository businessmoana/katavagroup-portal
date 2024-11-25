import isEmpty from 'lodash/isEmpty';
interface Item {
  id: string | number;
  item_name: string;
  item_brand: string,
  item_image: string,
  productItem: any
  [key: string]: unknown;
}
interface Variation {
  id: string | number;
  title: string;
  price: number;
  sale_price?: number;
  quantity: number;
  [key: string]: unknown;
}
export function generateCartItem(item: Item, variation: Variation) {
  const {
    id,
    item_name,
    item_brand,
    item_image,
    productItem,
  } = item;
  if (!isEmpty(variation)) {
    return {
      id: `${id}.${variation.id}`,
      productId: id,
      item_name: `${item_name} - ${variation.title}`,
      item_brand,
      item_image,
      productItem,
      stock: variation.quantity,
      price: variation.sale_price ? variation.sale_price : variation.price,
      variationId: variation.id,
    };
  }
  return {
    id,
    item_name,
    item_brand,
    item_image,
    productItem,
    stock: 0,
    price: productItem.price,
  };
}
