/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import user from './modules/user'
import vuexI18n from 'vuex-i18n';
import en from "@/i18n/en-US"
import zh from "@/i18n/zh-CN"

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        common,
        user,
        i18n: vuexI18n.store
    },
})


Vue.use(vuexI18n.plugin, store);

// 两种语言
Vue.i18n.add('en', en);
Vue.i18n.add('cn', zh);

// 切换
Vue.i18n.set('en');

export default store
