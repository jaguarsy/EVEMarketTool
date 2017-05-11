/**
 * Created by johnnycage on 2017/5/11.
 */

const api = require('./api');
const electron = require('electron');
const clipboard = electron.clipboard;

const clipboardWatcher = (opts = { delay: 1000 }) => {
  let lastText = clipboard.readText();
  setInterval(() => {
    const text = clipboard.readText();
    if (opts.onTextChange && (text && lastText !== text)) {
      lastText = text;
      return opts.onTextChange(text);
    }
  }, opts.delay);
};

const $ = (selector) => {
  return document.querySelector(selector);
};

const $container = $('#container');
const $region = $('#region');
const $keyword = $('#keyword');
const $form = $('#form');
const $loading = $('#loading');

const postData = {};

const getItemHtml = (item) => {
  const result = ['<div class="item">'];
  result.push(`<p>名称: <strong>${item.typename}</strong></p>`);
  result.push(`<p>求购出价: <strong>${item.buy}</p></strong>`);
  result.push(`<p>卖方出价: <strong>${item.sell}</strong></p>`);
  if (item.time) {
    result.push(`<p>时间: <strong>${item.time}</strong></p>`);
  }
  result.push('</div>');
  return result.join('');
};

const render = (list) => {
  $container.innerHTML = list.map(getItemHtml).join('');
};

const search = () => {
  $container.innerHTML = '';
  $loading.style.display = 'block';

  postData.keyword = $keyword.value;
  if (!postData.keyword) {
    return;
  }

  postData.regionId = $region.value;
  api.query(postData).then(render).then(() => {
    $loading.style.display = 'none';
  });
};

$region.addEventListener('change', () => {
  search();
});

$form.addEventListener('submit', (event) => {
  event.preventDefault();
  search();
});

clipboardWatcher({
  onTextChange(text) {
    $keyword.value = text;
    search();
  }
});