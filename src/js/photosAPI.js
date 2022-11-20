const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31415914-2ac89ac673c071c72663449a1';

export class PhotosAPI {
  static totalHits = 1;
  static currentPage = 1;
  static query = '';

  static getAllPhotos(query) {
    if (query !== undefined) {
      PhotosAPI.query = query;
      PhotosAPI.currentPage = 1;
    } else {
      PhotosAPI.currentPage += 1;
    }

    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: PhotosAPI.query,
      per_page: 100,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: PhotosAPI.currentPage,
    });

    return fetch(`${BASE_URL}?${searchParams}`).then(response =>
      response.json()
    );
  }
}
