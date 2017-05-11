/**
 * Created by johnnycage on 2017/5/11.
 */
const request = require('request');

const URL = 'https://www.ceve-market.org/query/?search=';
//const IMAGE_URL = 'https://images.ceve-market.org/Types/4311_64.png';

const order = (list, keyword) => {
  for(let i = 0, len=list.length;i<len;i++){
  }
};

module.exports = {
  query({ keyword, regionId }) {
    return new Promise((resolve, reject) => {
      request({
        url: `${URL}${encodeURIComponent(keyword)}&regionid=${regionId}`,
        headers: {
          referer: 'https://www.ceve-market.org/home/',
        }
      }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          resolve(JSON.parse(body));
        } else {
          reject(error || body);
        }
      });
    });
  }
};