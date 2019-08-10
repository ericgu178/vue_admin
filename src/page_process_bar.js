/**
 * 页面跳转进度条发生器
 */
import router from './router'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' //这个样式必须引入
import {message,notification} from "ant-design-vue/es"; //单独引入message消息提示模块
// 简单配置
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

// 页面跳转开始时间
var startTime
// 通知跳过的路由
const passPath = [
    '/login',
    '/404',
    '/403',
    '/302'
]

router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        localStorage.removeItem('userinfo');
    }
    let userinfo = JSON.parse(localStorage.getItem('userinfo'));
    let toTime = new Date().getTime()
    if (userinfo == null && to.path != '/login') {
        message.info('登录错误，请重新登录')
        setTimeout(()=>{
            next({path: '/login'})
        },1000)
    }
    if (userinfo && toTime >= userinfo.expire_time && to.path != '/login') {
        message.info('登录失效，请重新登录')
        setTimeout(()=>{
            next({path: '/login'})
        },1000)
    }

    // userinfo.expire_time = toTime + 1000 * 60 * 60 * 2
    // localStorage.setItem("userinfo",JSON.stringify(userinfo))

    // 页面不存在
    if (to.matched.length == 0) {
        next({path: '/404'})
    }

    startTime = new Date().getTime()
    
    NProgress.start();
    next()
});

router.afterEach(transition => {
    if (passPath.indexOf(transition.path) === -1) {
        var consumingTime = new Date().getTime() - startTime
        notification.info({
            message: '此次加载页面消耗时间',
            duration:2,
            description: `耗时${consumingTime / 1000}秒`,
        });
    }
    NProgress.done();
});