export type Hotel = {
  id: string;
  name: string;
  rating: number;
  location: string;
  distance: string;
  price: number;
  currency: string;
  amenities: string[];
  description: string;
  image: string;
  photos?: string[];
  address?: string;
  checkInTime?: string;
  checkOutTime?: string;
  rooms?: number;
  website?: string;
  phone?: string;
};

export type HotelSearchParams = {
  location: string;
  checkIn: string;
  checkOut: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  amenities?: string[];
};

export type HotelBooking = {
  id: string;
  userId: string;
  hotelId: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};

class HotelService {
  private readonly BOOKINGS_KEY = "hotel_bookings";

  private mockHotels: Hotel[] = [
    {
      id: "olive-boutique",
      name: "Olive Boutique Hotel",
      rating: 4.6,
      location: "Старе місто",
      distance: "0.5 км від центру",
      price: 2100,
      currency: "UAH",
      amenities: ["Wi-Fi", "Сніданок", "Паркування", "Кондиціонер"],
      description:
        "Затишний готель у центрі старого міста з чудовим видом на площу Ринок. Ідеальне розташування для прогулянок історичним центром.",
      image: "/placeholder-hotel.jpg",
      photos: ["/placeholder-hotel.jpg", "/placeholder-hotel-2.jpg"],
      address: "вул. Ринок, 12",
      checkInTime: "14:00",
      checkOutTime: "12:00",
      rooms: 15,
    },
    {
      id: "amber-yard",
      name: "Amber Yard",
      rating: 4.4,
      location: "Поруч із вокзалом",
      distance: "1.2 км від центру",
      price: 1650,
      currency: "UAH",
      amenities: ["Сніданок", "Wi-Fi", "Цілодобова рецепція"],
      description:
        "Зручне розташування біля вокзалу для мандрівників. Сучасні номери з усіма зручностями.",
      image: "/placeholder-hotel.jpg",
      address: "вул. Городоцька, 45",
      checkInTime: "15:00",
      checkOutTime: "11:00",
      rooms: 20,
    },
    {
      id: "green-patio",
      name: "Green Patio Apartments",
      rating: 4.8,
      location: "Тихий район",
      distance: "2 км від центру",
      price: 2450,
      currency: "UAH",
      amenities: ["Кухня", "Пральня", "Тераса", "Wi-Fi", "Паркування"],
      description:
        "Просторі апартаменти з повним обладнанням для комфортного проживання. Ідеально для сімейного відпочинку.",
      image: "/placeholder-hotel.jpg",
      address: "вул. Зелена, 8",
      checkInTime: "16:00",
      checkOutTime: "12:00",
      rooms: 10,
    },
    {
      id: "royal-palace",
      name: "Royal Palace Hotel",
      rating: 4.9,
      location: "Центр міста",
      distance: "0.2 км від центру",
      price: 3200,
      currency: "UAH",
      amenities: ["Wi-Fi", "Сніданок", "Ресторан", "Спа", "Паркування", "Басейн"],
      description:
        "Розкішний готель преміум-класу в самому серці міста. Вишуканий сервіс та елегантні інтер'єри.",
      image: "/placeholder-hotel.jpg",
      address: "пл. Ринок, 1",
      checkInTime: "14:00",
      checkOutTime: "12:00",
      rooms: 30,
    },
    {
      id: "budget-inn",
      name: "Budget Inn",
      rating: 4.0,
      location: "Околиці",
      distance: "3.5 км від центру",
      price: 950,
      currency: "UAH",
      amenities: ["Wi-Fi", "Паркування"],
      description:
        "Економний варіант для бюджетних мандрівників. Чисті номери з базовими зручностями.",
      image: "/placeholder-hotel.jpg",
      address: "вул. Шевченка, 120",
      checkInTime: "15:00",
      checkOutTime: "11:00",
      rooms: 25,
    },
  ];

  async searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let results = [...this.mockHotels];

    // Filter by location (simple string match)
    if (params.location) {
      const searchTerm = params.location.toLowerCase();
      results = results.filter(
        (h) =>
          h.location.toLowerCase().includes(searchTerm) ||
          h.name.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by price range
    if (params.minPrice !== undefined) {
      results = results.filter((h) => h.price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      results = results.filter((h) => h.price <= params.maxPrice!);
    }

    // Filter by rating
    if (params.minRating !== undefined) {
      results = results.filter((h) => h.rating >= params.minRating!);
    }

    // Filter by amenities
    if (params.amenities && params.amenities.length > 0) {
      results = results.filter((h) =>
        params.amenities!.every((amenity) => h.amenities.includes(amenity))
      );
    }

    return results;
  }

  async getHotelById(hotelId: string): Promise<Hotel | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.mockHotels.find((h) => h.id === hotelId) || null;
  }

  async bookHotel(
    userId: string,
    hotelId: string,
    checkIn: string,
    checkOut: string,
    guests: number
  ): Promise<HotelBooking> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const hotel = await this.getHotelById(hotelId);
    if (!hotel) {
      throw new Error("Hotel not found");
    }

    // Calculate number of nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const booking: HotelBooking = {
      id: crypto.randomUUID(),
      userId,
      hotelId,
      hotelName: hotel.name,
      checkIn,
      checkOut,
      guests,
      totalPrice: hotel.price * nights,
      currency: hotel.currency,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    // Save booking
    const bookings = this.getBookings();
    bookings.push(booking);
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));

    return booking;
  }

  async getUserBookings(userId: string): Promise<HotelBooking[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const bookings = this.getBookings();
    return bookings.filter((b) => b.userId === userId);
  }

  async cancelBooking(bookingId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    
    if (index !== -1) {
      bookings[index].status = "cancelled";
      localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
    }
  }

  private getBookings(): HotelBooking[] {
    const data = localStorage.getItem(this.BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  }

  getAllAmenities(): string[] {
    return [
      "Wi-Fi",
      "Сніданок",
      "Паркування",
      "Кондиціонер",
      "Басейн",
      "Спа",
      "Ресторан",
      "Кухня",
      "Пральня",
      "Тераса",
      "Цілодобова рецепція",
    ];
  }
}

export const hotelService = new HotelService();

