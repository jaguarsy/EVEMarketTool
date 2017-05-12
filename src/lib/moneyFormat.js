/**
 * Created by johnnycage on 2017/5/12.
 */

module.exports = (number) => {
  if (typeof number === 'number') {
    return number.toLocaleString('en-US');
  }
  return '';
};