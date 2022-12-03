import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputArea: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const createCountryList = ({ name: { official }, flags: { svg } }) => {
  return `<li>
      <div class="card-header">
          <img
          class="card-flags-img"
          src="${svg}"
          alt="Flags"
          />
          <h1 class="card-title">${official}</h1>
      </div>
  </li>`;
};

const createMarkupCardCountry = ({
  name: { official },
  capital,
  population,
  flags: { svg },
  languages,
}) => {
  return `<div class="card">
       <div class="card-header">
          <img
          class="card-flags-img"
          src="${svg}"
          alt="Flags"
          />
          <h1 class="card-title">${official}</h1>
      </div>
      <p class="card-subtitle"><span>Capital: </span>${capital}</p>
      <p class="card-subtitle"><span>Population: </span>${population}</p>
      <p class="card-subtitle"><span>Languages: </span>${Object.values(
        languages
      ).join(', ')}</p>
      </div>`;
};

refs.inputArea.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);

function onInputChange(e) {
  const { value } = e.target;

  if (value.trim() === '') {
    clearMarcup();
  } else {
    fetchCountries(value.trim())
      .then(renderCardCountry)
      .catch(error => {
        console.log('error is', error);
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}

function renderCardCountry(country) {
  if (country.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }

  if (country.length >= 2 && country.length <= 10) {
    const markup = country.map(createCountryList);
    clearMarcup();
    refs.countryList.insertAdjacentHTML('beforeend', markup.join(''));
  }

  if (country.length === 1) {
    const markup = createMarkupCardCountry(country[0]);
    clearMarcup();
    refs.countryInfo.innerHTML = markup;
  }
}

function clearMarcup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
