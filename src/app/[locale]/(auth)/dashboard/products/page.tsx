import { getTranslations } from 'next-intl/server';
import ProductsClient from './ProductsClient';
import { getProducts } from './actions';

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
  const products = await getProducts();
  return <ProductsClient initialProducts={products} />;
}
