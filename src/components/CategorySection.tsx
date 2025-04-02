
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "ENYSKIN EXTRA",
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
    link: "/categories/enyskin-extra",
  },
  {
    id: 2,
    name: "GIFT ITEMS",
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
    link: "/categories/gift-items",
  },
  {
    id: 3,
    name: "LIP CARE",
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
    link: "/categories/lip-care",
  },
  {
    id: 4,
    name: "SETS",
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
    link: "/categories/sets",
  },
  {
    id: 5,
    name: "SKINCARE DEVICES",
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
    link: "/categories/skincare-devices",
  },
  {
    id: 6,
    name: "TREATMENT & CARE",
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
    link: "/categories/treatment-care",
  },
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-medium text-center mb-3">Shop By Categories</h2>
        <p className="text-center text-gray-600 mb-12">Discover your perfect pair with our curated categories</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={category.link}
              className="category-item"
            >
              <div className="relative overflow-hidden rounded-lg h-48">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <h3 className="font-medium mt-2">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
