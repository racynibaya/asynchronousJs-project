'use strict';

// Dom Elements
const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
console.log(btn);

// Convert the population
const formatPopulation = n => {
  const pop = n.toString().length >= 7 && n.toString().length <= 10 ? 'M' : 'B';

  return `${(+n / 1000000).toFixed(1)}${pop}`;
};

// render country and add it to the countries container
const renderCountry = function (country, className = '') {
  console.log(country);
  const [currency] = Object.entries(country.currencies);
  const [language] = Object.entries(country.languages);
  console.log(language);
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${
        country.flags.svg ? country.flags.svg : country.flags.png
      }" />
      <div class="country__data">
        <h3 class="country__name">${country.name.common}</h3>
        <h4 class="country__region">${country.region}</h4>
        <p class="country__row"><span>👫</span>${formatPopulation(
          country.population
        )} people</p>
        <p class="country__row"><span>🗣️</span>${language[1]}</p>
        <p class="country__row"><span>💰</span>${currency[0]}</p>
      </div>
    </article>
    `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 100;
};

// Fetching data base using countryName
const getData = function (countryName) {
  const url = `https://restcountries.com/v3.1/name/${countryName}`;

  // Fetching the data
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const [country] = data;

      console.log(country);
      renderCountry(country);

      // Fetching the neighbour country using the borders property
      fetch(
        `https://restcountries.com/v3.1/alpha?codes=${country.borders?.[0]}`
      )
        .then(res => res.json())
        .then(data => {
          const [neighbour] = data;
          renderCountry(neighbour, 'neighbour');
        })
        .catch(err => {
          const messageEl = document.createElement('p');
          messageEl.insertAdjacentText('beforeend', 'This is an Island');
          console.log(messageEl);

          messageEl.classList.add('message');

          countriesContainer.appendChild(messageEl);
        });
    });
};

// Starting point

btn.addEventListener('click', () => {
  btn.disabled = true;
  return getData('canada');
});
