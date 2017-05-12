/**
 * Created by johnnycage on 2017/5/12.
 */
const electron = require('electron');
const clipboard = electron.clipboard;

module.exports = (opts = { delay: 1000 }) => {
  let lastText;
  setInterval(() => {
    const text = clipboard.readText();
    if (opts.onTextChange && (text && lastText !== text)) {
      lastText = text;
      return opts.onTextChange(text);
    }
  }, opts.delay);
};