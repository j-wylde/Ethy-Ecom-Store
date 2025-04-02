
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Heart, Gift, User, Settings } from "lucide-react";

// Mock data
const orderHistory = [
  { id: 1, date: "2023-05-15", status: "Delivered", total: 16500 },
  { id: 2, date: "2023-04-20", status: "Delivered", total: 25000 },
  { id: 3, date: "2023-03-10", status: "Delivered", total: 8800 },
];

const recommendations = [
  {
    id: 1,
    name: "HYDRATING LIP MASK",
    price: 8250.00,
    image: "/lovable-uploads/b5b998d4-ffa6-43ba-8a55-a3f6cc69e5c6.png",
  },
  {
    id: 2,
    name: "SONIC JADE ROLLER",
    price: 18800.00,
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
  },
  {
    id: 3,
    name: "COMPRESSED FACIAL SPONGE",
    price: 12400.00,
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
  },
];

const exclusiveOffers = [
  {
    id: 1,
    title: "Summer Sale",
    discount: "20% OFF",
    code: "SUMMER20",
    expiryDate: "2023-08-31",
  },
  {
    id: 2,
    title: "Birthday Special",
    discount: "15% OFF",
    code: "BIRTHDAY15",
    expiryDate: "Your birthday month",
  },
];

const Account = () => {
  const [userInfo, setUserInfo] = useState({
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+234 807 834 7384",
    address: "123 Main St, Abuja, Nigeria",
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6">My Account</h1>

      <Tabs defaultValue="orders">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package size={16} />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Heart size={16} />
            <span className="hidden sm:inline">For You</span>
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center gap-2">
            <Gift size={16} />
            <span className="hidden sm:inline">Offers</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View all your previous orders and their status.</CardDescription>
            </CardHeader>
            <CardContent>
              {orderHistory.length > 0 ? (
                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="border rounded-md p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                        <p className="text-sm">Status: <span className="text-green-600">{order.status}</span></p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₦{order.total.toLocaleString()}</p>
                        <Link to={`/orders/${order.id}`} className="text-coral text-sm underline">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-10">You don't have any orders yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Recommended For You</CardTitle>
              <CardDescription>Products selected based on your browsing history and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((product) => (
                  <Link to={`/products/${product.id}`} key={product.id} className="group">
                    <div className="border rounded-md overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3 text-center">
                        <h3 className="font-medium">{product.name}</h3>
                        <p>₦{product.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle>Exclusive Offers</CardTitle>
              <CardDescription>Special discounts just for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exclusiveOffers.map((offer) => (
                  <div key={offer.id} className="border border-coral rounded-md p-4 bg-coral/5">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{offer.title}</h3>
                      <p className="font-bold text-coral">{offer.discount}</p>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-sm">Use code: <span className="font-mono bg-white px-2 py-1 rounded">{offer.code}</span></p>
                      <p className="text-sm text-gray-500">Expires: {offer.expiryDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                    <input 
                      id="name"
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <input 
                      id="email"
                      type="email"
                      className="w-full p-2 border rounded-md"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                    <input 
                      id="phone"
                      type="tel"
                      className="w-full p-2 border rounded-md"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">Address</label>
                    <input 
                      id="address"
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={userInfo.address}
                      onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" className="coral-button">
                    Update Profile
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;
