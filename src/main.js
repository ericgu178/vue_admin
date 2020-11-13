import Vue from 'vue'
import App from './App'
import { router } from './router'
import Antd from "ant-design-vue/es";
import "ant-design-vue/dist/antd.css";
import { getStore, setStore, removeStore } from "./libs/store"
import store from './store'

Vue.use(Antd);

Vue.prototype.getStore = getStore;
Vue.prototype.setStore = setStore;
Vue.prototype.removeStore = removeStore;

Vue.config.productionTip = false


import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
    document: {
        icon: '',
        title: '后台管理'
    }
})