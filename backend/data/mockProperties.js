const mockProperties = [
  {
    _id: "1",
    title: "Misty Mountain Resort",
    description: "A beautiful resort overlooking the Mahabaleshwar valley with premium amenities. Perfect for couples and families looking for a relaxing getaway.",
    price: 4500,
    rating: 4.8,
    reviews: 124,
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    amenities: ["Free WiFi", "Pool", "Spa", "Breakfast Included"],
    type: "Resort",
    location: "Venna Lake Road, Mahabaleshwar",
    rooms: [
      { name: "Standard Room", price: 4500, quantity: 10, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=400&q=80" },
      { name: "Deluxe Room", price: 6500, quantity: 5, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80" },
      { name: "Suite", price: 9500, quantity: 2, image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=400&q=80" }
    ]
  },
  {
    _id: "2",
    title: "Grand Royal Hotel",
    description: "Experience royal luxury with breathtaking views of the Sahyadri mountains. Classic architecture with modern comforts.",
    price: 6500,
    rating: 4.9,
    reviews: 210,
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    amenities: ["Free WiFi", "Pool", "Restaurant", "Gym"],
    type: "Hotel",
    location: "Old Mahabaleshwar",
    rooms: [
      { name: "Single Room", price: 4500, quantity: 5, image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=400&q=80" },
      { name: "Double Room", price: 6500, quantity: 15, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80" },
      { name: "Superior / Deluxe Room", price: 8500, quantity: 8, image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=400&q=80" }
    ]
  },
  {
    _id: "3",
    title: "Sunset Point Villa",
    description: "Private villa with the best sunset view in Mahabaleshwar. Includes a private chef and premium services.",
    price: 12000,
    rating: 4.7,
    reviews: 42,
    images: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
    amenities: ["Private Pool", "Chef", "Free WiFi", "AC"],
    type: "Villa",
    location: "Bombay Point"
  }
];

module.exports = mockProperties;
