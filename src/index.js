import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { PhotosAPI } from './js/photosAPI';
import { handleScroll } from './js/scrolling';
import { renderMarkup } from './js/renderPhotos';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export const { formEl, galleryEl, btnLoadMoreEl } = {
  formEl: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  btnLoadMoreEl: document.querySelector('.load-more'),
};

let lightbox = new SimpleLightbox('.gallery .photo-card a', {
  captionDelay: 250,
  captionsData: 'alt',
  captions: true,
});

btnLoadMoreEl.style.visibility = 'hidden';

async function createForm(e) {
  e.preventDefault();
  const query = e.target.elements.searchQuery.value.trim();

  if (query === '') {
    return;
  }

  const response = await PhotosAPI.getAllPhotos(query);
  PhotosAPI.totalHits = response.totalHits;
  try {
    if (response.totalHits > 40) {
      btnLoadMoreEl.style.visibility = 'visible';
    }

    if (response.totalHits > 0) {
      Notify.success(`"Hooray! We found ${response.totalHits} images."`);
      galleryEl.innerHTML = '';
      renderMarkup(response.hits);
      lightbox.refresh();
    }

    if (response.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      galleryEl.innerHTML = '';
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function handleBtnLoadMore() {
  const response = await PhotosAPI.getAllPhotos();
  renderMarkup(response.hits);
  lightbox.refresh();
  handleScroll();
  if (response.hits.length < 40 || response.hits.length === 0) {
    btnLoadMoreEl.style.visibility = 'hidden';
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

formEl.addEventListener('submit', createForm);
btnLoadMoreEl.addEventListener('click', handleBtnLoadMore);
