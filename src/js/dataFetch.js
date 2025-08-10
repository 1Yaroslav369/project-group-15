import axios from 'axios';

export async function getDataFromAPI(endPoint, page, limit) {
  const baseURL = 'https://furniture-store.b.goit.study/api/';
  const searchParams = new URLSearchParams({
    page: page,
    limit: limit,
  });

  const url = `${baseURL}${endPoint}?${searchParams.toString()}`;
  const response = await axios(url);
  return response.data;
}
