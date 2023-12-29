export interface GameInterface {
  id: number,
  slug: string,
  released: string,
  description: string,
  name: string;
  background_image: string;
  rating: number;
  metacritic: number;
  platforms: [{
    'platform': {
      'id': number,
      'slug': string,
      'name': string,
    },
    requeriments: {
      'minimum': string,
      'recommended': string,
  }}
];
}