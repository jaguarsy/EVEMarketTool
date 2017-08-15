/**
 * Created by johnnycage on 2017/5/12.
 */

/**
 * 获取HTML内容字符串
 * @param type
 * @param item
 * @returns { String }
 */
module.exports = (item, idx) => {
  const result = ['<div class="item">'];
  result.push(`<p title="${item.n || ''}">${idx + 1}: <strong>${item.n}</strong>`);
  result.push(`&nbsp;<a href="javascript:void(0)" data-id="${item.v}">[获取价格]</a></p>`);
  result.push('</div>');
  return result.join('');
};