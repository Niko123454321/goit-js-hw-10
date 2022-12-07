console.log('faina_super_dog');

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

// import cardTp1 from './templates/countries-card.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputBox: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
};

refs.inputBox.addEventListener('input', debounce(onSubmit, DEBOUNCE_DELAY));

let items = '';

function onSubmit(params) {
  let box = refs.inputBox.value.trim();
  console.log(box);

  if (box === '') {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    return;
  }

  const BASE_URL = 'https://restcountries.com/v3.1';
  fetch(
    `${BASE_URL}/name/${box}?fields=name,capital,population,flags,languages`
  )
    .then(response => {
      return response.json();
    })
    .then(countrie => {
      items = countrie;

      if (items.length >= 10) {
        console.log('больше десяти совпадений');
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (items.length > 2) {
        console.log('больше двух совпадений');
        refs.countryList.innerHTML = '';
        return items.forEach(element => {
          refs.countryList.insertAdjacentHTML(
            'beforeend',
            `<li class="country-list__item">
    <img class="country-list__image" src="${element.flags.png}" alt="${element.name.official}" width='25' >
    <p class="country-list_name">${element.name.official}</p>
</li>`
          );
        });
      } else if ((items.length = 1)) {
        console.log('нашлось одно совпадене');

        refs.countryList.innerHTML = '';

        return items.forEach(element => {
          refs.countryList.insertAdjacentHTML(
            'beforeend',
            `<li>
    <img class="country-list__image" src="${element.flags.png}" alt="${
              element.name.official
            }" heigth='20' width='35' >
    <p class="name_official">${element.name.official}</p>
    <p ><span class="name_text">Capital:
  </span> ${element.capital}</p>
    <p ><span class="name_text">Population: 
  </span>${element.population}</p>
    <p ><span class="name_text">Languages: 
  </span>${Object.values(element.languages)}</p>
  </li>`
          );
        });
      }
    })

    .catch(error => {
      console.log(error);
      return Notify.failure('Oops, there is no country with that name');
    });
}

//   name.official - повна назва країни
// capital - столиця
// population - населення
// flags.svg - посилання на зображення прапора
// languages - масив мов
