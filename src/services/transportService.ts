export type TransportType = "train" | "bus" | "plane";

export type Transport = {
  id: string;
  type: TransportType;
  name: string;
  route: string;
  departure: string;
  arrival: string;
  duration: string;
  transfers: number;
  amenities: string[];
  price: number;
  currency: string;
  carrier?: string;
  class?: string;
};

export type TransportSearchParams = {
  from: string;
  to: string;
  date: string;
  passengers?: number;
  type?: TransportType;
};

export type TransportBooking = {
  id: string;
  userId: string;
  transportId: string;
  transportName: string;
  type: TransportType;
  route: string;
  date: string;
  passengers: number;
  totalPrice: number;
  currency: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};

class TransportService {
  private readonly BOOKINGS_KEY = "transport_bookings";

  private mockTransports: Transport[] = [
    // Trains
    {
      id: "ic-712",
      type: "train",
      name: "IC 712",
      route: "Львів → Краків",
      departure: "08:45",
      arrival: "11:10",
      duration: "2 год 25 хв",
      transfers: 0,
      amenities: ["Без пересадок", "Wi-Fi", "Розетки"],
      price: 980,
      currency: "UAH",
      carrier: "Укрзалізниця",
      class: "2 клас",
    },
    {
      id: "ic-740",
      type: "train",
      name: "IC 740",
      route: "Львів → Краків",
      departure: "10:10",
      arrival: "12:45",
      duration: "2 год 35 хв",
      transfers: 0,
      amenities: ["Wi-Fi", "Ресторан"],
      price: 1050,
      currency: "UAH",
      carrier: "Укрзалізниця",
      class: "2 клас",
    },
    {
      id: "regio-1",
      type: "train",
      name: "REGIO",
      route: "Львів → Перемишль",
      departure: "07:30",
      arrival: "08:45",
      duration: "1 год 15 хв",
      transfers: 1,
      amenities: ["Економ"],
      price: 410,
      currency: "UAH",
      carrier: "Укрзалізниця",
      class: "3 клас",
    },
    {
      id: "ic-750",
      type: "train",
      name: "IC 750",
      route: "Львів → Варшава",
      departure: "14:20",
      arrival: "20:15",
      duration: "5 год 55 хв",
      transfers: 0,
      amenities: ["Без пересадок", "Wi-Fi", "Ресторан", "Розетки"],
      price: 1450,
      currency: "UAH",
      carrier: "Укрзалізниця",
      class: "1 клас",
    },
    // Buses
    {
      id: "bus-101",
      type: "bus",
      name: "FlixBus 101",
      route: "Львів → Краків",
      departure: "09:00",
      arrival: "13:30",
      duration: "4 год 30 хв",
      transfers: 0,
      amenities: ["Wi-Fi", "Кондиціонер", "USB"],
      price: 650,
      currency: "UAH",
      carrier: "FlixBus",
    },
    {
      id: "bus-205",
      type: "bus",
      name: "Ecolines 205",
      route: "Львів → Варшава",
      departure: "22:00",
      arrival: "06:30",
      duration: "8 год 30 хв",
      transfers: 0,
      amenities: ["Wi-Fi", "Туалет", "Кондиціонер"],
      price: 850,
      currency: "UAH",
      carrier: "Ecolines",
    },
    {
      id: "bus-303",
      type: "bus",
      name: "Autolux 303",
      route: "Львів → Будапешт",
      departure: "08:00",
      arrival: "18:45",
      duration: "10 год 45 хв",
      transfers: 1,
      amenities: ["Wi-Fi", "Кондиціонер"],
      price: 1100,
      currency: "UAH",
      carrier: "Autolux",
    },
    // Planes
    {
      id: "flight-ua101",
      type: "plane",
      name: "UA 101",
      route: "Львів → Варшава",
      departure: "06:30",
      arrival: "07:45",
      duration: "1 год 15 хв",
      transfers: 0,
      amenities: ["Багаж 20кг", "Харчування"],
      price: 2500,
      currency: "UAH",
      carrier: "Ukraine International",
      class: "Економ",
    },
    {
      id: "flight-lo202",
      type: "plane",
      name: "LO 202",
      route: "Львів → Краків",
      departure: "11:20",
      arrival: "12:10",
      duration: "50 хв",
      transfers: 0,
      amenities: ["Багаж 23кг", "Харчування", "Wi-Fi"],
      price: 1800,
      currency: "UAH",
      carrier: "LOT Polish Airlines",
      class: "Економ",
    },
    {
      id: "flight-w6303",
      type: "plane",
      name: "W6 303",
      route: "Львів → Будапешт",
      departure: "15:40",
      arrival: "16:55",
      duration: "1 год 15 хв",
      transfers: 0,
      amenities: ["Ручна поклажа"],
      price: 1200,
      currency: "UAH",
      carrier: "Wizz Air",
      class: "Базовий",
    },
  ];

  async searchTransport(params: TransportSearchParams): Promise<Transport[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let results = [...this.mockTransports];

    // Filter by route
    if (params.from || params.to) {
      const from = params.from?.toLowerCase() || "";
      const to = params.to?.toLowerCase() || "";
      
      results = results.filter((t) => {
        const route = t.route.toLowerCase();
        const matchesFrom = !from || route.includes(from);
        const matchesTo = !to || route.includes(to);
        return matchesFrom && matchesTo;
      });
    }

    // Filter by type
    if (params.type) {
      results = results.filter((t) => t.type === params.type);
    }

    return results;
  }

  async getTransportById(transportId: string): Promise<Transport | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.mockTransports.find((t) => t.id === transportId) || null;
  }

  async bookTransport(
    userId: string,
    transportId: string,
    date: string,
    passengers: number
  ): Promise<TransportBooking> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const transport = await this.getTransportById(transportId);
    if (!transport) {
      throw new Error("Transport not found");
    }

    const booking: TransportBooking = {
      id: crypto.randomUUID(),
      userId,
      transportId,
      transportName: transport.name,
      type: transport.type,
      route: transport.route,
      date,
      passengers,
      totalPrice: transport.price * passengers,
      currency: transport.currency,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    // Save booking
    const bookings = this.getBookings();
    bookings.push(booking);
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));

    return booking;
  }

  async getUserBookings(userId: string): Promise<TransportBooking[]> {
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

  private getBookings(): TransportBooking[] {
    const data = localStorage.getItem(this.BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  }

  getTransportTypes(): TransportType[] {
    return ["train", "bus", "plane"];
  }

  getTransportTypeLabel(type: TransportType): string {
    const labels: Record<TransportType, string> = {
      train: "Потяг",
      bus: "Автобус",
      plane: "Літак",
    };
    return labels[type];
  }
}

export const transportService = new TransportService();


