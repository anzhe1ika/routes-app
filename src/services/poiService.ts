export type POI = {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  rating: number;
  photos: string[];
  openingHours?: string;
  ticketPrice?: number;
  currency?: string;
  duration?: string;
  website?: string;
  phone?: string;
  address?: string;
};

export type POICategory =
  | "museum"
  | "monument"
  | "park"
  | "restaurant"
  | "cafe"
  | "church"
  | "castle"
  | "viewpoint"
  | "shopping"
  | "entertainment";

class POIService {
  private mockPOIs: POI[] = [
    {
      id: "poi-1",
      name: "Площа Ринок",
      description:
        "Центральна площа Львова, оточена історичними будівлями. Серце старого міста з ратушею та численними кав'ярнями.",
      category: "monument",
      location: "Львів",
      rating: 4.8,
      photos: ["/placeholder-poi.jpg"],
      openingHours: "Цілодобово",
      ticketPrice: 0,
      currency: "UAH",
      duration: "1-2 години",
      address: "пл. Ринок, Львів",
    },
    {
      id: "poi-2",
      name: "Львівський оперний театр",
      description:
        "Один з найкрасивіших оперних театрів Європи. Архітектурна перлина у стилі віденського ренесансу.",
      category: "entertainment",
      location: "Львів",
      rating: 4.9,
      photos: ["/placeholder-poi.jpg"],
      openingHours: "Вт-Нд 10:00-19:00",
      ticketPrice: 150,
      currency: "UAH",
      duration: "1 година (екскурсія)",
      address: "пр. Свободи, 28, Львів",
      website: "opera.lviv.ua",
      phone: "+380322355869",
    },
    {
      id: "poi-3",
      name: "Високий замок",
      description:
        "Оглядовий майданчик з панорамним видом на Львів. Ідеальне місце для фотографій та романтичних прогулянок.",
      category: "viewpoint",
      location: "Львів",
      rating: 4.7,
      photos: ["/placeholder-poi.jpg"],
      openingHours: "Цілодобово",
      ticketPrice: 0,
      currency: "UAH",
      duration: "1-2 години",
      address: "Високий замок, Львів",
    },
    {
      id: "poi-4",
      name: "Вавельський замок",
      description:
        "Королівський замок на пагорбі Вавель у Кракові. Один з найважливіших історичних пам'яток Польщі.",
      category: "castle",
      location: "Краків",
      rating: 4.8,
      photos: ["/placeholder-poi.jpg"],
      openingHours: "Вт-Нд 09:00-17:00",
      ticketPrice: 120,
      currency: "PLN",
      duration: "2-3 години",
      address: "Wawel 5, Kraków",
      website: "wawel.krakow.pl",
    },
    {
      id: "poi-5",
      name: "Головна площа Кракова",
      description:
        "Одна з найбільших середньовічних площ Європи. Серце історичного центру Кракова.",
      category: "monument",
      location: "Краків",
      rating: 4.9,
      photos: ["/placeholder-poi.jpg"],
      openingHours: "Цілодобово",
      ticketPrice: 0,
      currency: "PLN",
      duration: "1-2 години",
      address: "Rynek Główny, Kraków",
    },
    {
      id: "poi-6",
      name: "Казимеж",
      description:
        "Історичний єврейський квартал Кракова. Атмосферне місце з галереями, кав'ярнями та синагогами.",
      category: "monument",
      location: "Краків",
      rating: 4.7,
      photos: ["/placeholder-poi.jpg"],
      openingHours: "Цілодобово",
      ticketPrice: 0,
      currency: "PLN",
      duration: "2-3 години",
      address: "Kazimierz, Kraków",
    },
    {
      id: "poi-7",
      name: "Собор Святого Юра",
      description:
        "Кафедральний собор Української греко-католицької церкви. Чудовий приклад бароко.",
      category: "church",
      location: "Львів",
      rating: 4.6,
      photos: ["/placeholder-poi.jpg"],
      openingHours: "Щодня 08:00-18:00",
      ticketPrice: 0,
      currency: "UAH",
      duration: "30-60 хвилин",
      address: "пл. Святого Юра, 5, Львів",
    },
    {
      id: "poi-8",
      name: "Стрийський парк",
      description:
        "Найстаріший парк Львова з дендрарієм та ставками. Ідеальне місце для відпочинку.",
      category: "park",
      location: "Львів",
      rating: 4.5,
      photos: ["/placeholder-poi.jpg"],
      openingHours: "Цілодобово",
      ticketPrice: 0,
      currency: "UAH",
      duration: "1-2 години",
      address: "вул. Стрийська, Львів",
    },
    {
      id: "poi-9",
      name: "Кав'ярня Svit Kavy",
      description:
        "Затишна кав'ярня з авторською кавою та десертами. Чудова атмосфера для відпочинку.",
      category: "cafe",
      location: "Львів",
      rating: 4.7,
      photos: ["/placeholder-poi.jpg"],
      openingHours: "Пн-Нд 08:00-22:00",
      ticketPrice: 80,
      currency: "UAH",
      duration: "30-60 хвилин",
      address: "вул. Катедральна, 6, Львів",
      phone: "+380322975555",
    },
    {
      id: "poi-10",
      name: "Замок Барбакан",
      description:
        "Середньовічна фортеця у Кракові. Один з небагатьох збережених елементів міських укріплень.",
      category: "castle",
      location: "Краків",
      rating: 4.5,
      photos: ["/placeholder-poi.jpg"],
      openingHours: "Вт-Нд 10:00-18:00",
      ticketPrice: 40,
      currency: "PLN",
      duration: "45 хвилин",
      address: "ul. Baszta, Kraków",
    },
  ];

  async searchPOIs(location: string, category?: POICategory): Promise<POI[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let results = [...this.mockPOIs];

    // Filter by location
    if (location) {
      const searchTerm = location.toLowerCase();
      results = results.filter((poi) =>
        poi.location.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by category
    if (category) {
      results = results.filter((poi) => poi.category === category);
    }

    return results;
  }

  async getPOIById(poiId: string): Promise<POI | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return this.mockPOIs.find((poi) => poi.id === poiId) || null;
  }

  async getRecommendations(destination: string): Promise<POI[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Get POIs for the destination, sorted by rating
    const pois = await this.searchPOIs(destination);
    return pois.sort((a, b) => b.rating - a.rating).slice(0, 6);
  }

  getCategories(): { value: POICategory; label: string }[] {
    return [
      { value: "museum", label: "Музеї" },
      { value: "monument", label: "Пам'ятки" },
      { value: "park", label: "Парки" },
      { value: "restaurant", label: "Ресторани" },
      { value: "cafe", label: "Кав'ярні" },
      { value: "church", label: "Храми" },
      { value: "castle", label: "Замки" },
      { value: "viewpoint", label: "Оглядові майданчики" },
      { value: "shopping", label: "Шопінг" },
      { value: "entertainment", label: "Розваги" },
    ];
  }

  getCategoryLabel(category: string): string {
    const categories = this.getCategories();
    const found = categories.find((c) => c.value === category);
    return found ? found.label : category;
  }
}

export const poiService = new POIService();


