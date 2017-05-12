/**
 * Created by johnnycage on 2017/5/11.
 */

const CountUp = require('countup.js/dist/countUp.min');
const api = require('./api');
const $ = require('./lib/domQuery');
const textAnalyzer = require('./lib/textAnalyzer');
const clipWatcher = require('./lib/clipWatcher');
const tplCreator = require('./tplCreator');

const $list = $('#list');
const $title = $('#title');
const $region = $('#region');
const $keyword = $('#keyword');
const $form = $('#form');
const $loading = $('#loading');

const renderList = (list, type = 1) => {
  $list.innerHTML = list
    .map(item => tplCreator(type, item))
    .join('');
};

const reset = () => {
  $list.innerHTML = '';
  $title.hide();
};

const search = () => {
  reset();

  if (!$keyword.value) {
    return;
  }

  $loading.show();
  api.query({
    keyword: $keyword.value,
    regionId: $region.value,
  }).then(renderList).then(() => {
    $loading.hide();
  });
};

const searchContract = (list) => {
  reset();

  if (!list || !list.length) {
    return;
  }

  api.multiQuery(list)
    .then(result => {
      const sumPrice = result.reduce((result, item) => {
        return result + item.sumPrice;
      }, 0);

      $title.show();
      new CountUp('sumMoney', 0, sumPrice, 2, 0.5).start();
      renderList(result, 2);
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

clipWatcher({
  onTextChange(text) {
    const result = textAnalyzer(text);
    if (result.type === 1) {  // 普通物品
      $keyword.value = result.value;
      search();
    } else if (result.type === 2) { // 合同货柜
      $keyword.value = '';
      $region.value = '10000002';
      searchContract(result.value);
    }
  }
});