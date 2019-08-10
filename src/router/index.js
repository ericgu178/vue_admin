import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const base_title = 'EricGU178个人后台管理'
export default new Router({
    routes: [
        {
            path: '/',
            meta: { 
                title: `首页`,
                title_desc:`首页 | ${base_title}`
            },
            component: resolve => require(['../page/common/Home.vue'], resolve),
            children:[
                {
                    path:'/dashboard',
                    component: resolve => require(['../page/main/blog/dashboard.vue'], resolve),
                    meta:{
                        title:`Dashboard`,
                        title_desc:`Dashboard | ${base_title}`
                    }
                },
                {
                    path:'/index',
                    component: resolve => require(['../page/main/blog/index.vue'], resolve),
                    meta:{
                        title:`文章管理`,
                        title_desc:`文章管理 | ${base_title}`
                    }
                },
                {
                    path:'/article',
                    component: resolve => require(['../page/main/blog/article.vue'], resolve),
                    meta:{
                        title:`博客添加`,
                        title_desc:`博客添加 | ${base_title}`
                    }
                },
                {
                    path:'/comments',
                    component: resolve => require(['../page/main/blog/comments.vue'], resolve),
                    meta:{
                        title:`评论管理`,
                        title_desc:`评论管理 | ${base_title}`
                    }
                },
                {
                    path:'/label',
                    component: resolve => require(['../page/main/blog/label.vue'], resolve),
                    meta:{
                        title:`标签管理`,
                        title_desc:`标签管理 | ${base_title}`
                    }
                },
                {
                    path:'/material',
                    component: resolve => require(['../page/main/blog/material.vue'],resolve),
                    meta:{
                        title:`素材管理`,
                        title_desc:`素材管理 | ${base_title}`
                    }
                },
                // 系统
                {
                    path:'/menu',
                    component: resolve => require(['../page/main/system/menu.vue'], resolve),
                    meta:{
                        title:`菜单管理`,
                        title_desc:`菜单管理 | ${base_title}`
                    }
                },
                // 微信
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../page/login.vue'], resolve),
            meta:{
                title:`EricGU178后台登陆`,
                title_desc:`EricGU178后台登陆`
            }
        },
        // error_page
        {
            path: '/404',
            component: resolve => require(['../error_page/404.vue'], resolve),
            meta:{
                title:"404 | 啊哦~ 你所访问的页面不存在",
                title_desc:`404 | 啊哦~ 你所访问的页面不存在`
            }
        }
    ]
})
