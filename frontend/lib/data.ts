export interface Property {
  id: number;
  image: string;
  isFavorite: boolean;
  title: string;
  distance: string;
  dateRange: string;
  price: string;
  rating: number;
  category: string;
}

export let mockProperties: Property[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542314831-c6a4d27ce66b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFavorite: true,
    title: "Luxury Villa in Panchgani",
    distance: "12 kilometers away",
    dateRange: "15-20 Apr",
    price: "₹12,500",
    rating: 4.96,
    category: "Villas"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFavorite: false,
    title: "Heritage Bungalow near Venna",
    distance: "2 kilometers away",
    dateRange: "18-22 Apr",
    price: "₹8,400",
    rating: 4.85,
    category: "Heritage"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFavorite: true,
    title: "Forest Eco-Retreat",
    distance: "8 kilometers away",
    dateRange: "20-25 Apr",
    price: "₹5,200",
    rating: 4.98,
    category: "Forest Stays"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFavorite: false,
    title: "Valley View Chalet",
    distance: "4 kilometers away",
    dateRange: "22-26 Apr",
    price: "₹18,000",
    rating: 5.0,
    category: "Valley View"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFavorite: true,
    title: "Strawberry Farm Stay",
    distance: "6 kilometers away",
    dateRange: "25-30 Apr",
    price: "₹6,800",
    rating: 4.88,
    category: "Villas"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1528909514045-2f44621b1c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFavorite: false,
    title: "Boutique Hotel Arthur Seat",
    distance: "9 kilometers away",
    dateRange: "01-05 May",
    price: "₹14,500",
    rating: 4.79,
    category: "Heritage"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1533104816-c0c4a45749f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFavorite: true,
    title: "Cozy Cottage near Mapro",
    distance: "15 kilometers away",
    dateRange: "05-10 May",
    price: "₹4,500",
    rating: 4.92,
    category: "Near Venna Lake"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFavorite: false,
    title: "Private Pool Mansion",
    distance: "3 kilometers away",
    dateRange: "10-15 May",
    price: "₹35,000",
    rating: 5.0,
    category: "Pools"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFavorite: true,
    title: "Rustic Cabin in the Woods",
    distance: "14 kilometers away",
    dateRange: "12-18 May",
    price: "₹3,200",
    rating: 4.75,
    category: "Forest Stays"
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFavorite: true,
    title: "Lakeview Modern Villa",
    distance: "1 kilometer away",
    dateRange: "18-24 May",
    price: "₹22,500",
    rating: 4.95,
    category: "Near Venna Lake"
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFavorite: false,
    title: "Mountain Edge Retreat",
    distance: "7 kilometers away",
    dateRange: "20-25 May",
    price: "₹16,000",
    rating: 4.89,
    category: "Valley View"
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isFavorite: true,
    title: "Colonial Heritage Estate",
    distance: "4 kilometers away",
    dateRange: "01-05 Jun",
    price: "₹11,000",
    rating: 4.98,
    category: "Heritage"
  }
];

export function getProperties(category?: string) {
  if (category && category !== 'All') {
    return mockProperties.filter(p => p.category === category);
  }
  return mockProperties;
}

export function getPropertyById(id: number) {
  return mockProperties.find(p => p.id === id);
}
