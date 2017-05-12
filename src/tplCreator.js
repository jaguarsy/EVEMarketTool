/**
 * Created by johnnycage on 2017/5/12.
 */

const moneyFormat = require('./lib/moneyFormat');

/**
 * 获取HTML内容字符串
 * @param type
 * @param item
 * @returns { String }
 */
module.exports = (type, item) => {
  // 普通物品模板
  if (type === 1) {
    const result = ['<div class="item">'];
    result.push(`<p>名称: <strong>${item.typename}</strong></p>`);
    result.push(`<p>求购出价: <strong>${moneyFormat(item.buy)}</p></strong>`);
    result.push(`<p>卖方出价: <strong>${moneyFormat(item.sell)}</strong></p>`);
    if (item.time) {
      result.push(`<p>时间: <strong>${item.time}</strong></p>`);
    }
    result.push('</div>');
    return result.join('');

  } else if (type === 2) { // 合同模板
    const result = ['<div class="item">'];
    result.push(`<p>名称: <strong>${item.name}</strong></p>`);
    result.push(`<p>单价: <strong>${moneyFormat(item.price)}</p></strong>`);
    result.push(`<p>数量: <strong>${moneyFormat(item.count)}</strong></p>`);
    result.push(`<p>总价: <strong>${moneyFormat(item.sumPrice)}</strong></p>`);
    if (item.time) {
      result.push(`<p>时间: <strong>${item.time}</strong></p>`);
    }
    result.push('</div>');
    return result.join('');
  }
};