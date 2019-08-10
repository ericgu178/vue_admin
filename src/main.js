import Vue from 'vue'
import App from './App'
import router from './router'
import Antd from "ant-design-vue/es";
import "ant-design-vue/dist/antd.css";
Vue.use(Antd);

import axios from 'axios';
Vue.prototype.$http= axios

// 注册请求js
import request from './config/request'
Vue.prototype.request = request 

// 之前写的 做了一下兼容
Vue.prototype.HOST = request.base_url
Vue.config.productionTip = false

// 引入外部页面进度条js
import './page_process_bar'

import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    document:{
        icon:'',
        title:'后台管理'
    },
    watch: {
        $route() {
            document.title = this.$route.meta.title_desc || '出错了'
        }
    }
  
})
