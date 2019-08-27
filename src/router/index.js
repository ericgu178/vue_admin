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
            component: resolve => require(['../pages/common/Home.vue'], resolve),
            redirect:'dashboard', // 重定向到某个页面
            children:[
                {
                    path:'dashboard',
                    component: resolve => require(['../pages/main/blog/dashboard.vue'], resolve),
                    meta:{
                        title:`Dashboard`,
                        title_desc:`Dashboard | ${base_title}`
                    }
                },
                {
                    path:'index',
                    component: resolve => require(['../pages/main/blog/index.vue'], resolve),
                    meta:{
                        title:`文章管理`,
                        title_desc:`文章管理 | ${base_title}`
                    }
                },
                {
                    path:'article',
                    component: resolve => require(['../pages/main/blog/article.vue'], resolve),
                    meta:{
                        title:`博客添加`,
                        title_desc:`博客添加 | ${base_title}`
                    }
                },
                {
                    path:'comments',
                    component: resolve => require(['../pages/main/blog/comments.vue'], resolve),
                    meta:{
                        title:`评论管理`,
                        title_desc:`评论管理 | ${base_title}`
                    }
                },
                {
                    path:'label',
                    component: resolve => require(['../pages/main/blog/label.vue'], resolve),
                    meta:{
                        title:`标签管理`,
                        title_desc:`标签管理 | ${base_title}`
                    }
                },
                {
                    path:'material',
                    component: resolve => require(['../pages/main/blog/material.vue'],resolve),
                    meta:{
                        title:`素材管理`,
                        title_desc:`素材管理 | ${base_title}`
                    }
				},
            ]
		},
/*+====================================================+
 *+				微信路由
 *+====================================================+
 **/
		{
			path:'/wechat',
			component: resolve => require(['../pages/common/Home.vue'], resolve),
			redirect:'wechat_dashboard',
			meta:{
			  	title:`微信首页`,
			  	title_desc:`微信首页 | ${base_title}`
			},
			children:[
				{
					path:'wechat_reply',
					component: resolve => require(['../pages/main/wechat/wechat_reply.vue'], resolve),
					meta:{
					  	title:`关键词回复`,
					  	title_desc:`关键词回复 | ${base_title}`
					}
				},
				{
					path:'wechat_material',
					component: resolve => require(['../pages/main/wechat/wechat_material.vue'], resolve),
					meta:{
						title:`素材管理`,
					  	title_desc:`素材管理 | ${base_title}`
					}
				},
				{
					path:'wechat_member',
					component: resolve => require(['../pages/main/wechat/wechat_member.vue'], resolve),
					meta:{
					  	title:`会员管理`,
					  	title_desc:`会员管理 | ${base_title}`
					}
				},
				{
					path:'wechat_dashboard',
					component: resolve => require(['../pages/main/wechat/wechat_dashboard.vue'], resolve),
					meta:{
					  	title:`微信首页`,
					  	title_desc:`微信首页 | ${base_title}`
					}
				}
			]
		},
/*+====================================================+
 *+				系统路由
 *+====================================================+
 **/
		{
			path:'/system',
			component: resolve => require(['../pages/common/Home.vue'], resolve),
			// redirect:'wechat_dashboard',
			meta:{
			  	title:`系统`,
			  	title_desc:`系统 | ${base_title}`
			},
			children:[
				{
					path:'menu',
					component: resolve => require(['../pages/main/system/menu.vue'], resolve),
					meta:{
						title:`菜单管理`,
						title_desc:`菜单管理 | ${base_title}`
					}
				}
			]
		},
/*+====================================================+
 *+				其他路由
 *+====================================================+
 **/
        {
            path: '/login',
            component: resolve => require(['../pages/login.vue'], resolve),
            meta:{
                title:`EricGU178后台登陆`,
                title_desc:`EricGU178后台登陆`
            }
        },
        // error_pages
        {
            path: '/404',
            component: resolve => require(['../error_pages/404.vue'], resolve),
            meta:{
                title:"404 | 啊哦~ 你所访问的页面不存在",
                title_desc:`404 | 啊哦~ 你所访问的页面不存在`
            }
		},
		{
            path: '/403',
            component: resolve => require(['../error_pages/403.vue'], resolve),
            meta:{
                title:"403 | 啊哦~ 你所访问的页面不存在",
                title_desc:`403 | 啊哦~ 你所访问的页面不存在`
            }
		},
		{
            path: '/302',
            component: resolve => require(['../error_pages/302.vue'], resolve),
            meta:{
                title:"302 | 啊哦~ 你所访问的页面不存在",
                title_desc:`302 | 啊哦~ 你所访问的页面不存在`
            }
        }
    ]
})
