import type { WizardState } from "../contexts/WizardContext";

export type SavedRoute = {
  id: string;
  userId: string;
  title: string;
  destination: string;
  dateRange: string;
  budget: number;
  points: WizardState["points"];
  transport: WizardState["transport"];
  accommodation: WizardState["accommodation"];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  shared: boolean;
  shareToken?: string;
};

class RouteService {
  private readonly STORAGE_KEY = "saved_routes";

  private getRoutes(): SavedRoute[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveRoutes(routes: SavedRoute[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(routes));
  }

  async saveRoute(userId: string, wizardState: WizardState, title?: string): Promise<SavedRoute> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const routes = this.getRoutes();
    const newRoute: SavedRoute = {
      id: crypto.randomUUID(),
      userId,
      title: title || `Маршрут до ${wizardState.destination}`,
      destination: wizardState.destination,
      dateRange: wizardState.dateRange,
      budget: wizardState.budget,
      points: wizardState.points,
      transport: wizardState.transport,
      accommodation: wizardState.accommodation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shared: false,
    };

    routes.push(newRoute);
    this.saveRoutes(routes);
    return newRoute;
  }

  async getUserRoutes(userId: string): Promise<SavedRoute[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const routes = this.getRoutes();
    return routes.filter((r) => r.userId === userId);
  }

  async getRouteById(routeId: string): Promise<SavedRoute | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const routes = this.getRoutes();
    return routes.find((r) => r.id === routeId) || null;
  }

  async updateRoute(routeId: string, updates: Partial<SavedRoute>): Promise<SavedRoute> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const routes = this.getRoutes();
    const index = routes.findIndex((r) => r.id === routeId);
    
    if (index === -1) {
      throw new Error("Route not found");
    }

    routes[index] = {
      ...routes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveRoutes(routes);
    return routes[index];
  }

  async deleteRoute(routeId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    const routes = this.getRoutes();
    const filtered = routes.filter((r) => r.id !== routeId);
    this.saveRoutes(filtered);
  }

  async shareRoute(routeId: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const routes = this.getRoutes();
    const index = routes.findIndex((r) => r.id === routeId);
    
    if (index === -1) {
      throw new Error("Route not found");
    }

    const shareToken = crypto.randomUUID();
    routes[index].shared = true;
    routes[index].shareToken = shareToken;
    routes[index].updatedAt = new Date().toISOString();

    this.saveRoutes(routes);
    
    return `${window.location.origin}/shared/${shareToken}`;
  }

  async getSharedRoute(shareToken: string): Promise<SavedRoute | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    const routes = this.getRoutes();
    return routes.find((r) => r.shareToken === shareToken && r.shared) || null;
  }

  async exportRouteToPDF(routeId: string): Promise<Blob> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const route = await this.getRouteById(routeId);
    if (!route) {
      throw new Error("Route not found");
    }

    // Mock PDF generation
    const pdfContent = this.generatePDFContent(route);
    return new Blob([pdfContent], { type: "application/pdf" });
  }

  private generatePDFContent(route: SavedRoute): string {
    // This is a mock implementation
    // In a real app, you would use a library like jsPDF or pdfmake
    return `
      Маршрут: ${route.title}
      Напрям: ${route.destination}
      Дати: ${route.dateRange}
      Бюджет: ${route.budget}%
      
      Точки маршруту:
      ${route.points.map((p, i) => `${i + 1}. ${p.name} (${p.date}, ${p.timeStart}-${p.timeEnd})`).join("\n")}
      
      Транспорт: ${route.transport?.name || "Не обрано"}
      Проживання: ${route.accommodation?.hotelName || "Не обрано"}
    `;
  }
}

export const routeService = new RouteService();


