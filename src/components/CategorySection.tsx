
import { Link } from "react-router-dom";

const categories = [
  {
    id: 2,
    name: "BODY CARE",
    image: "/imgs/bodycare.jpg",
    link: "category=Body%20Care",
  },
  {
    id: 1,
    name: "FACIAL CARE",
    image: "/imgs/facialcare.jpg",
    link: "category=Facial%20Care",
  },
  {
    id: 3,
    name: "LIP CARE",
    image: "/imgs/lipcare.jpg",
    link: "category=Lip%20Care",
  },
  {
    id: 4,
    name: "INTIMATE CARE",
    image: "/imgs/intimate.jpeg",
    link: "category=Intimate%20Care",
  },
  {
    id: 5,
    name: "SKINCARE SETS",
    image: "/imgs/skincare.jpg",
    link: "category=Skin%20Care",
  },
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl text-center mb-3 heading-title text-[rgb(51,51,51)] font-semibold">Shop By Categories</h2>
        <p className="text-center mb-12 heading-title-small">Discover your perfect pair with our curated categories</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`shop?${category.link}`}
              className="category-item"
            >
              <div className="relative overflow-hidden rounded-lg h-48">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-auto h-auto hover:shadow-md object-cover transition-transform hover:scale-105"
                />
              </div>
              <h3 className="font-semibold mt-2">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
