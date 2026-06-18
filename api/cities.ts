export const config = { runtime: 'edge' };

const URL = 'https://api.sputnik8.com/v1/cities?api_key=873fa71c061b0c36d9ad7e47ec3635d9&username=frontend@sputnik8.com';

export default async function handler() {
  const response = await fetch(URL);
  const data = await response.json();
  return Response.json(data);
}
