import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

const submitForm = document.querySelector('.search-form');
const inputField = document.querySelector('[name=searchQuery]');
const galleryItems = document.querySelector('.gallery');
const hidenBtn = document.querySelector('.load-more');
const mainBtn = document.querySelector('.main-btn');
const IMG_URL = 'https://pixabay.com/api/';

galleryItems.setAttribute('style', 'display:flex; flex-wrap: wrap;');
hidenBtn.hidden = true;
const getFetch = async e => {
  e.preventDefault();
  try {
    const response = await axios.get(`${IMG_URL}`, {
      params: {
        key: `32990578-f3b3113eefa07098cb0f1ea38`,
        q: inputField.value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
      },
    });
    if (inputField.value.trim() === '') {
      Notiflix.Notify.info(
        'Sorry, you need to type something. Please try again.'
      );
      return;
    }
    if (response.data.total === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    galleryItems.innerHTML = createMarkup(response.data.hits);
    gallery.refresh();
    Notiflix.Notify.success(`Hooray! We found ${response.data.total} images.`);
    hidenBtn.hidden = false;
  } catch (error) {
    console.log(error => console.log(error));
  }
};
const options = {
  key: `32990578-f3b3113eefa07098cb0f1ea38`,
  q: inputField.value,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 2,
  per_page: 40,
};
async function Loadmore() {
  try {
    const moreData = await axios.get(
      `https://pixabay.com/api/?key=32990578-f3b3113eefa07098cb0f1ea38&q=${inputField.value}&image_type=photo&page=${options.page}`,
      {
        params: {
          key: `32990578-f3b3113eefa07098cb0f1ea38`,
          q: inputField.value,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: 40,
        },
      }
    );
    if (moreData.data.hits.length === 0) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      galleryItems.insertAdjacentHTML(
        'beforeend',
        createMarkup(moreData.data.hits)
      );

      options.page += 1;
    }
  } catch (error) {
    console.log(error);
  }
}
submitForm.addEventListener('submit', getFetch);
hidenBtn.addEventListener('click', Loadmore);
function createMarkup(images) {
  return images.map(
    item => `<div class="photo-card">
 <a href="" onclick="return false;"> <img src="${item.webformatURL}" alt="${item.tags}"  data-source="${item.largeImageURL}" loading="lazy" width="300px"; height="250px"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes:${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views:${item.views}</b>
    </p>
    <p class="info-item">
      <b>Comments:${item.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads:${item.downloads}</b>
    </p>
  </div>
</div>`
  );
}

const gallerySettings = {
  animationSpeed: 250,
};

let gallery = new SimpleLightbox('.gallery a');
gallery.on('show.simplelightbox', gallerySettings);
