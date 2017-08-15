/**
 * Created by johnnycage on 2017/8/7.
 */
const fs = require('fs');
const request = require('request');

const re = /\?typeid=(\d+)">([^<]+)/g;

request('https://eve-central.com/home/typesearch.html', (error, response, body) => {
  if (!error && response.statusCode == 200) {
    var html = body;
    var match;
    var result = [];
    while (match = re.exec(html)) {
      if (match[2] && match[1]) {
        result.push({
          n: match[2].toLowerCase(),
          v: match[1],
        });
      }
    }
    fs.writeFileSync('../goods.json', JSON.stringify(result));
  }
});

// try {
//   const content = fs.readFileSync('./dic.txt');
//
//   content
//     .toString()
//     .split('\n')
//     .forEach(p => {
//       if (!p) {
//         return;
//       }
//
//       const tmp = p.split('\t');
//
//       if (dic[tmp[0]]) {
//         dic[tmp[0]] = {
//           id: dic[tmp[0]],
//           c: tmp[1],
//         };
//       }
//     });
//
//   fs.writeFileSync('./dic-obj.json', JSON.stringify(dic));
//   console.log('done.');
// } catch (ex) {
//   console.log(ex);
// }