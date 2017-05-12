/**
 * Created by johnnycage on 2017/5/12.
 */

const RE = /([^IVX\n]+(?:\s+[IVX]+)?)\s+(\d+)[^\n]+(?:\n|$)/g; // 合同匹配正则

String.prototype.matchAll = function (regexp) {
  var matches = [];
  this.replace(regexp, function () {
    var arr = ([]).slice.call(arguments, 0);
    var extras = arr.splice(-2);
    arr.index = extras[0];
    arr.input = extras[1];
    matches.push(arr);
  });
  return matches.length ? matches : null;
};

/**
 * 文本解析
 * @param text: String
 * @returns {{type: number, value: Array | String}}
 *
 * type: -1, desc: 非法文本
 * type: 1, desc: 普通物品
 * type: 2, desc: 合同货柜
 */
module.exports = (text) => {
  text = text.trim();
  if (!text) {
    return { type: -1, value: null };
  }

  // 验证是否合同
  if (RE.test(text)) {
    const result = [];
    const match = text.matchAll(RE);

    match.forEach(item => {
      const name = (item[1] || '').trim();
      const count = parseInt(item[2], 10);
      const target = result.find(p => p.name === name);
      if (target) {
        target.count = target.count + count;
      } else {
        result.push({
          name,
          count,
        });
      }
    });
    return { type: 2, value: result };
  } else {
    return { type: 1, value: text };
  }
};