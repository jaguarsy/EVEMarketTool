/**
 * Created by johnnycage on 2017/5/11.
 */
const request = require('request');

const URL = 'https://www.ceve-market.org/query/?search=';
//const IMAGE_URL = 'https://images.ceve-market.org/Types/4311_64.png';

const orderByLength = list => list.sort((a, b) => a.typename.length - b.typename.length);

const query = ({ keyword, regionId }) => {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL}${encodeURIComponent(keyword)}&regionid=${regionId}`,
      headers: {
        referer: 'https://www.ceve-market.org/home/',
      }
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(orderByLength(JSON.parse(body) || []));
      } else {
        reject(error || body);
      }
    });
  });
};

const queryOne = ({ keyword, regionId }) => {
  return query({ keyword, regionId }).then(list => {
    const target = list.find(p => p.typename === keyword);
    if (target) {
      return target;
    }

    return list[0] || { typename: keyword };
  });
};

const multiQuery = (list, eachCallback) => {
  const promiseList = list.map(item => {
    return queryOne({
      keyword: item.name,
      regionId: '10000002',
    }).then(res => {
      let result;

      if (res.typename !== item.name) {
        result = {
          name: item.name,
          price: null,
          time: res.time,
          count: item.count,
          sumPrice: null,
          description: res.description,
        };
      } else {
        result = {
          name: res.typename,
          price: res.sell,
          time: res.time,
          count: item.count,
          sumPrice: res.sell * item.count,
          description: res.description,
        };
      }

      if (typeof eachCallback === 'function') {
        eachCallback(result);
      }

      return result;
    });
  });

  return Promise.all(promiseList);
};

module.exports = {
  query,

  queryOne,

  multiQuery,
};