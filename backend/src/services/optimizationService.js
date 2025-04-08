class OptimizationService {
    constructor() {
      this.optimizedRoutes = new Map();
    }
  
    async calculateOptimalRoute(poubelles) {
      // Implémentation temporaire - à remplacer par Google Directions API
      return poubelles.sort((a, b) => b.fillLevel - a.fillLevel);
    }
  
    cacheRoute(routeId, data) {
      this.optimizedRoutes.set(routeId, data);
    }
  }
  
  module.exports = new OptimizationService();