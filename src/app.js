/**
 * Created by johnnycage on 2017/5/11.
 */

// const CountUp = require('countup.js/dist/countUp.min');
const api = require('./eve-api');
const $ = require('./lib/domQuery');
const tplCreator = require('./tplCreator');
const moneyFormat = require('./lib/moneyFormat');
const goods = require('../goods.json');

const $list = $('#list');
const $region = $('#region');
const $keyword = $('#keyword');
const $form = $('#form');

const renderList = (list) => {
  $list.innerHTML = list
    .map(tplCreator)
    .join('');
};

const reset = () => {
  $list.innerHTML = '';
};

const search = () => {
  reset();

  const val = $keyword.value.trim().toLowerCase();

  if (!val) {
    return;
  }

  const result = goods
    .filter(p => p.n.indexOf(val) > -1)
    .sort((a, b) => a.n.length - b.n.length);
  renderList(result);
};

const loadPrice = (typeId) => {
  return api.query({
    typeId,
    regionId: $region.value,
  });
};

const regionId = localStorage.getItem('region');
if (regionId) {
  $region.value = regionId;
}

$region.addEventListener('change', () => {
  localStorage.setItem('region', $region.value);
  search();
});

$form.addEventListener('submit', (event) => {
  event.preventDefault();
  search();
});

$list.addEventListener('click', (event) => {
  const target = event.target;
  const dataId = target.attributes['data-id'];
  if (dataId && dataId.value) {
    target.innerText = '[获取中...]';

    loadPrice(dataId.value)
      .then((result) => {
        const price = result[0];
        if (price) {
          console.log(price);
          target.hide();
          target.parentNode.parentNode.innerHTML +=
            `<p>sell: ${moneyFormat(price.sell.max)}</p>` +
            `<p>buy: ${moneyFormat(price.buy.min)}</p>`;
        } else {
          target.innerText = '[重新获取]';
        }
      });
  }
});