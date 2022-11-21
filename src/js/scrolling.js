export function handleScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2 - cardHeight / 2,
    behavior: 'smooth',
  });
}
