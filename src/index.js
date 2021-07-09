import './sass/main.scss';
import fetchCountries from './js/fetchCountries';
import countryTemplate from './templates/countryCard.hbs';
import listOfCountries from './templates/listOfCoutries.hbs';
const debounce = require('lodash.debounce');
const { error } = require('@pnotify/core');
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import '@pnotify/countdown/dist/PNotifyCountdown.css';

const inputSelector = document.querySelector('.js-input');
const cardContainer = document.querySelector('.js-cardContainer');

inputSelector.addEventListener('input', debounce(onInput, 500));
cardContainer.addEventListener('click', clickOnCountry);
//////////////////////////////////////////////
function onInput() {
  if (inputSelector.value.trim()) {
    fetchCountries(inputSelector.value)
      .then(data => {
        if (data.length === 1) {
          renderCard(data);
        }
        return data;
      })
      .then(data => {
        if (data.length > 1 && data.length < 10) {
          renderList(data);
          error({ text: 'На смотри список' });
        }
        return data;
      })
      .then(data => {
        if (data.length >= 10) {
          error({ text: 'To many matches found. Please enter a more specific query!' });
        }
        return data;
      })
      .then(data => {
        if (data.status === 404) {
          error({ text: 'No matches found' });
        }
        return;
      });
  } else {
    cardContainer.innerHTML = '';
  }
}

function renderCard(countryData) {
  let markUp = countryTemplate(countryData);
  cardContainer.innerHTML = markUp;
}
function renderList(array) {
  let markUpList = listOfCountries(array);
  cardContainer.innerHTML = markUpList;
}

function clickOnCountry(e) {
  if (e.target.classList.contains('js-countries-list_el')) {
    inputSelector.value = e.target.textContent;
    cardContainer.innerHTML = '';
    onInput();
  }
}
