/**
 * Created by johnnycage on 2017/8/7.
 */
const request = require('request');

const URL = 'http://api.eve-central.com/api/marketstat/json?typeid=';

const query = ({ typeId, regionId }) => {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL}${typeId}&regionlimit=${regionId}`,
      headers: {
        Host: 'api.eve-central.com',
      }
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(error || body);
      }
    });
  });
};

const multiQuery = ({ typeIds, regionId }) => {
  return query({
    typeId: typeIds.join('&typeid='),
    regionId,
  });
};

module.exports = {
  query,
  multiQuery,
};