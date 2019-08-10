/**
 * 请求响应拦截器
 */
import axios from 'axios';
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' //这个样式必须引入
import {notification} from "ant-design-vue/es"; //单独引入message消息提示模块


const base_url   =   "http://ericgu178/";



const Axios = axios.create({
    baseURL: "", 
    timeout: 10000,
    responseType: "json",
    withCredentials: true, // 是否允许带cookie这些
    headers: {
        "Content-Type": "application/json;charset=UTF-8"
    }
});

var startTime
//POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(config => {
        startTime = new Date().getTime()
        NProgress.start();
        // console.log(config)
        // // 在发送请求之前
        // if (config.params && !config.params.noLoading){
        //     NProgress.start();
        // }
        // 若是有做鉴权token , 就给头部带上token
        // if (getCookie("token")) {
            // config.headers.token = getCookie("token");
        // }
        return config;
    },error => {
        var consumingTime = new Date().getTime() - startTime
        notification.error({
            message: '此次请求消耗时间',
            duration:0,
            description: `发送请求之前失败，耗时${consumingTime / 1000}秒`,
            style:{
                color:'red',
            },
        });
        NProgress.done();
        return Promise.reject(error);
    }
);

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(res => {
        var consumingTime = new Date().getTime() - startTime
        notification.success({
            message: '此次请求消耗时间',
            duration:2,
            description: `请求成功，耗时${consumingTime / 1000}秒`,
            style:{
                color:'green',
            },
        });
        NProgress.done();
        if (res.data.code != 0) {

        }
        return res;
    },error => {
        var consumingTime = new Date().getTime() - startTime
        notification.error({
            message: '此次请求消耗时间',
            duration:0,
            description: `响应失败，耗时${consumingTime / 1000}秒`,
            style:{
                color:'red',
            },
        });
        NProgress.done();
        return Promise.reject(error);
    }
);

/**
 * ajax post请求
 * @param string url 
 * @param map data 
 * @param function success 
 * @param function fail 
 * @param string dataType 
 */
function request_post(url, successFunc , failFunc , data =  {},dataType = 'json') {
    Axios({
        method: 'post',
        url: url,
        dataType:dataType,
        data:data,
    })
    .then(successFunc)
    .catch(failFunc)
}
/**
 * ajax get请求
 * @param string url 
 * @param map data 
 * @param function success 
 * @param function fail 
 * @param string dataType 
 */
function request_get(url, successFunc , failFunc , data =  {} , dataType = 'json') {
    Axios({
        method: 'get',
        url: url,
        dataType:dataType,
        data:data,
    })
    .then(successFunc)
    .catch(failFunc)
}

export default {
    base_url,
    request_post,
    request_get
}