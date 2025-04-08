const axios = require('axios');

class GoogleMapsClient {
  constructor(apiKey) {
    this.client = axios.create({
      baseURL: 'https://maps.googleapis.com/maps/api/directions',
      params: { key: apiKey }
    });
  }

  async getDirections(params) {
    try {
      const response = await this.client.get('/json', { params });
      return response.data.routes[0];
    } catch (error) {
      throw new Error(`Google API Error: ${error.message}`);
    }
  }
}

module.exports = GoogleMapsClient;