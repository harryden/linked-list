import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const handlers = [
  http.get('https://nominatim.openstreetmap.org/search', () => {
    return HttpResponse.json([
      { place_id: 1, display_name: 'Gothenburg, Sweden', lat: '57.7089', lon: '11.9746' },
      { place_id: 2, display_name: 'Stockholm, Sweden', lat: '59.3293', lon: '18.0686' },
    ]);
  }),
];

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
