/**
 * Created by johnnycage on 2017/5/11.
 */

const CountUp = require('countup.js/dist/countUp.min');
const api = require('./eve-api');
const $ = require('./lib/domQuery');
const tplCreator = require('./tplCreator');
const moneyFormat = require('./lib/moneyFormat');
const textAnalyzer = require('./lib/textAnalyzer');
const clipWatcher = require('./lib/clipWatcher');
const goods = require('../goods.json');

const $list = $('#list');
const $region = $('#region');
const $keyword = $('#keyword');
const $title = $('#title');
const $warning = $('#warning');

const renderList = (list) => {
  if (list.length) {
    $list.innerHTML = list
      .map(tplCreator)
      .join('');
  } else {
    $list.innerHTML = '<p>没有找到相关的物品</p>';
  }
};

const addContactItem = (item) => {
  $list.innerHTML += `
    <div class="item">
      <p>
        <strong>${item.name},&nbsp;</strong>
        ${item.price}&nbsp;isk&nbsp;&times;&nbsp;${item.count}
      </p>
      <p>总价:&nbsp;${item.sumPrice}</p>
    </div>
  `;
};

const reset = () => {
  $list.innerHTML = '';
  $title.hide();
  $warning.hide();
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
  const type = $region.selectedOptions[0].getAttribute('data-type');

  return api.query({
    typeId,
    regionId: $region.value,
    isSystem: type === 'system',
  });
};

const searchContract = (list) => {
  reset();

  if (!list || !list.length) {
    return;
  }

  const countUp = new CountUp('sumMoney', 0, 0, 2, 0.5);
  countUp.start();

  let allSumPrice = 0;
  let isNotComplete = false;

  $title.show();
  $list.innerHTML = '正在计算合同价格...';

  const typeIds = list.map(p => {
    const target = goods.find(t => t.n === p.name.toLowerCase()) || {};
    return target.v || '0';
  });

  loadPrice(typeIds).then(result => {
    $list.innerHTML = '';

    result.forEach((item, idx) => {
      const origin = list[idx];
      const good = {
        name: origin.name,
        count: origin.count,
        price: item.sell.min,
        sumPrice: item.sell.min * origin.count || 0,
      };
      if (!good.sumPrice) {
        isNotComplete = true;
      }
      allSumPrice = allSumPrice + good.sumPrice;
      countUp.update(allSumPrice);
      addContactItem(good);
    });

    if (isNotComplete) {
      $warning.show();
    }
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
  const dataId = target.getAttribute('data-id');
  if (dataId) {
    target.innerText = '[获取中...]';

    loadPrice(dataId)
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

clipWatcher({
  onTextChange(text) {
    const result = textAnalyzer(text);
    if (result.type === 1) {  // 普通物品
      $keyword.value = result.value;
      search();
    } else if (result.type === 2) { // 合同货柜
      $keyword.value = '';
      searchContract(result.value);
    }
  }
});