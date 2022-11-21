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

let lightbox = new SimpleLightbox('.photo-card a', {
  captionDelay: 250,
  captionsData: 'alt',
  captions: true,
});

btnLoadMoreEl.disabled = true;
// searchBtnEl.addEventListener('submit', handleSearch);

formEl.addEventListener('submit', e => {
  e.preventDefault();
  const query = e.target.elements.searchQuery.value;

  PhotosAPI.getAllPhotos(query).then(data => {
    console.log('ourrr data', data);

    PhotosAPI.totalHits = data.totalHits;

    // якшо не ввести нічого все одно приходить масив об'єктів
    if (query === '' || data.totalHits === []) {
      console.log(
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        )
      );
    }

    if (data.totalHits > 0) {
      Notify.success(`"Hooray! We found ${data.totalHits} images."`);
      lightbox.refresh();
    }

    galleryEl.innerHTML = '';
    renderMarkup(data.hits);

    if (data.totalHits > 40) {
      btnLoadMoreEl.disabled = false;
    } else {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
});

btnLoadMoreEl.addEventListener('click', () => {
  PhotosAPI.getAllPhotos().then(data => {
    renderMarkup(data.hits);
    lightbox.refresh();
    handleScroll();
    if (data.hits.length < 40 || data.hits.length === 0) {
      btnLoadMoreEl.disabled = true;
      console.log("We're sorry, but you've reached the end of search results.");
    }
  });
});
