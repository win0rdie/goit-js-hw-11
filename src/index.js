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

btnLoadMoreEl.disabled = true;

function createForm(e) {
  e.preventDefault();
  const query = e.target.elements.searchQuery.value.trim();

  if (query === '') {
    return;
  }

  PhotosAPI.getAllPhotos(query).then(data => {
    PhotosAPI.totalHits = data.totalHits;

    if (data.totalHits > 40) {
      btnLoadMoreEl.disabled = false;
    } else {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }

    if (data.totalHits > 0) {
      Notify.success(`"Hooray! We found ${data.totalHits} images."`);
      galleryEl.innerHTML = '';
      renderMarkup(data.hits);
      lightbox.refresh();
    }

    if (data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      galleryEl.innerHTML = '';
    }
  });
}

function handleBtnLoadMore() {
  PhotosAPI.getAllPhotos().then(data => {
    renderMarkup(data.hits);
    lightbox.refresh();
    handleScroll();
    if (data.hits.length < 40 || data.hits.length === 0) {
      btnLoadMoreEl.disabled = true;
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

formEl.addEventListener('submit', createForm);
btnLoadMoreEl.addEventListener('click', handleBtnLoadMore);
