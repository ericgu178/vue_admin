import axios from 'axios';
import { getStore, setStore } from './store'
let base = process.env.NODE_ENV == 'development' ? 'https://ericgu178.com' : 'https://ericgu178.com'; // 基础url

axios.defaults.timeout = 15000;


export const getRequest = (url, params = {}) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params,
        // headers: {
        //   'accessToken': accessToken
        // }
    }).then(function (response) {
        return new Promise(function (resolve, reject) {
            resolve(response.data)
        });
    });
};

export const postRequest = (url, params = {}) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            ret = ret.substring(0, ret.length - 1);
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then(function (response) {
        return new Promise(function (resolve, reject) {
            resolve(response.data)
        });
    });
};
