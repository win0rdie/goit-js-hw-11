import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { PhotosAPI } from './js/photosAPI';

const formEl = document.querySelector('.search-form');
const searchBtnEl = document.querySelector('.js-button-search');
const galleryEl = document.querySelector('.gallery');
const btnLoadMoreEl = document.querySelector('.load-more');

btnLoadMoreEl.disabled = true;
// searchBtnEl.addEventListener('submit', handleSearch);

formEl.addEventListener('submit', e => {
  e.preventDefault();
  const query = e.target.elements.searchQuery.value;

  PhotosAPI.getAllPhotos(query).then(data => {
    PhotosAPI.totalHits = data.totalHits;
    galleryEl.innerHTML = '';
    renderMarkup(data.hits);
    if (data.totalHits > 1) {
      btnLoadMoreEl.disabled = false;
    }
  });
});

function renderMarkup(hits) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
          <div class="photo-card">
          <a href="${largeImageURL}" >
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item">
              <b>${likes}</b>
            </p>
            <p class="info-item">
              <b>${views}</b>
            </p>
            <p class="info-item">
              <b>${comments}</b>
            </p>
            <p class="info-item">
              <b>${downloads}</b>
            </p>
          </div>
          </div>
          `;
      }
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

btnLoadMoreEl.addEventListener('click', () => {
  PhotosAPI.getAllPhotos().then(data => {
    renderMarkup(data.hits);

    console.log(data);
    if (data.hits.length < 40 && data.hits.length === 0) {
      btnLoadMoreEl.disabled = true;
      console.log("We're sorry, but you've reached the end of search results.");
    }
  });
});
