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

const renderList = (list) => {
  if (list.length) {
    $list.innerHTML = list
      .map(tplCreator)
      .join('');
  } else {
    $list.innerHTML = '<p>没有找到相关的物品</p>';
  }
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

let t;
$keyword.addEventListener('input', (event) => {
  event.preventDefault();
  if (t) {
    clearTimeout(t);
  }

  if ($keyword.value.trim().length > 2) {
    t = setTimeout(() => {
      search();
    }, 500);
  }
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
            `<p>sell: ${moneyFormat(price.sell.min)}</p>` +
            `<p>buy: ${moneyFormat(price.buy.max)}</p>`;
        } else {
          target.innerText = '[重新获取]';
        }
      });
  }
});