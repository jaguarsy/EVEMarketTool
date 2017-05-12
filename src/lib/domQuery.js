/**
 * Created by johnnycage on 2017/5/12.
 */
NodeList.prototype.show = function () {
  Array.prototype.forEach.call(this, (node) => {
    node.show();
  });
};

NodeList.prototype.hide = function () {
  Array.prototype.forEach.call(this, (node) => {
    node.hide();
  });
};

HTMLElement.prototype.show = function () {
  this.classList.remove('hide');
};

HTMLElement.prototype.hide = function () {
  this.classList.add('hide');
};


module.exports = (selector) => {
  return document.querySelector(selector);
};