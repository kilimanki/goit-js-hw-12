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
let totalImages = 0;
let pages = 2;
mainBtn.addEventListener('click', e => {
  totalImages = 0;
});
const getFetch = async e => {
  e.preventDefault();
  try {
    pages = 1;
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
    localStorage.setItem('savedValue', JSON.stringify(inputField.value));
    console.log(pages);
    totalImages += response.data.hits.length;
    console.log('firstreq', totalImages);
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
    if (response.data.total <= 40) {
      hidenBtn.hidden = true;
    } else {
      hidenBtn.hidden = false;
    }
    galleryItems.innerHTML = createMarkup(response.data.hits);
    Notiflix.Notify.success(`Hooray! We found ${response.data.total} images.`);
    hidenBtn.hidden = false;
  } catch (error) {
    console.log(error => console.log(error));
  }
};

async function Loadmore() {
  try {
    pages += 1;
    const mainValue = JSON.parse(localStorage.getItem('savedValue'));
    console.log(mainValue);
    const moreData = await axios.get(
      `https://pixabay.com/api/?key=32990578-f3b3113eefa07098cb0f1ea38&q=${mainValue}&image_type=photo&page=${pages}`,
      {
        params: {
          key: `32990578-f3b3113eefa07098cb0f1ea38`,
          q: mainValue,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: 40,
        },
      }
    );

    console.log(pages);
    totalImages += moreData.data.hits.length;
    console.log('moreReq', totalImages);
    if (totalImages === moreData.data.total) {
      galleryItems.insertAdjacentHTML(
        'beforeend',
        createMarkup(moreData.data.hits)
      );
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      hidenBtn.hidden = true;
    } else {
      galleryItems.insertAdjacentHTML(
        'beforeend',
        createMarkup(moreData.data.hits)
      );
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

// const gallerySettings = {
//   animationSpeed: 250,
// };

// // let gallery = new SimpleLightbox('.gallery a');
// // gallery.on('show.simplelightbox', gallerySettings);
// // //12
