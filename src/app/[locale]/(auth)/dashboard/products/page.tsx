import { getTranslations } from 'next-intl/server';

import { getProducts } from './actions';
import ProductsClient from './ProductsClient';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: `المنتجات | ${t('meta_title')}`,
  };
}

export default async function ProductsPage() {
  let products: any[] = [];
  try {
    products = await getProducts();
  } catch (error) {
    console.error('Products page error:', error);
  }
  return <ProductsClient initialProducts={products} />;
}
