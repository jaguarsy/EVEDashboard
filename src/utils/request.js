import axios from 'axios';
import getParams from './getParams';
import auth from '../services/auth';
import config from '../config';

export default {
  postForm(url, data) {
    console.info('Post form to:', url, 'data:', data);

    return axios
      .request({
        url: url,
        method: 'post',
        headers: {
          'Authorization': `Basic ${config.BAACode}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: config.clientId,
          password: config.secretKey,
        },
        data: getParams(data),
      })
      .then(res => {
        console.info('Res:', res);
        return res.data || {};
      });
  },

  post(url, data) {
    console.info('Post to:', url, 'data:', data);

    return axios
      .post(url, data)
      .then(res => {
        console.info('Res:', res);
        return res.data;
      });
  },

  get(url, data) {
    console.info('Get from:', url, 'data:', data);

    return axios
      .request({
        url: url,
        method: 'get',
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`,
        },
        params: data,
      })
      .then(res => {
        console.info('Res:', res);
        return res.data;
      });
  },

  getFromESI(url, data) {
    console.info('Get from:', config.ESI_URL + url, 'data:', data);

    if (data) {
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          data[key] = data[key].join(',');
        }
      });
    }

    return axios
      .request({
        url: `${config.ESI_URL}${url}`,
        method: 'get',
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`,
        },
        params: Object.assign({}, {
          datasource: 'tranquility',
          token: auth.accessToken,
        }, data),
      })
      .then(res => {
        console.info('Res:', res);
        return res.data;
      });
  },

  postToESI(url, data) {
    console.info('Post to:', config.ESI_URL + url, 'data:', data);

    return axios
      .request({
        url: `${config.ESI_URL}${url}`,
        method: 'post',
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`,
        },
        data: Object.assign({}, {
          datasource: 'tranquility',
          token: auth.accessToken,
        }, data),
      })
      .then(res => {
        console.info('Res:', res);
        return res.data;
      });
  },
};
