import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import ProductSection from '../components/ProductSection';

const Index = () => {
  return (
    <>
      <Hero />
      <CategorySection />
      <ProductSection title="Latest Products" />
    </>
  );
};

export default Index;
