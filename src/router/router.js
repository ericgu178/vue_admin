const indexRouter =
{
    path: '/',
    meta: { title: `首页`, },
    component: resolve => require(['../pages/common/Home.vue'], resolve),
    redirect: 'dashboard', // 重定向到某个页面
    children: [
        {
            path: 'dashboard',
            component: resolve => require(['../pages/main/blog/dashboard.vue'], resolve),
            meta: {
                title: `Dashboard`,
            }
        },
        {
            path: 'index',
            component: resolve => require(['../pages/main/blog/index.vue'], resolve),
            meta: {
                title: `文章管理`,
            }
        },
        {
            path: 'article',
            component: resolve => require(['../pages/main/blog/article.vue'], resolve),
            meta: {
                title: `博客添加`,
            }
        },
        {
            path: 'edit_article',
            component: resolve => require(['../pages/main/blog/article_edit.vue'], resolve),
            meta: {
                title: `文章修改`,
            }
        },
        {
            path: 'comments',
            component: resolve => require(['../pages/main/blog/comments.vue'], resolve),
            meta: {
                title: `评论管理`,
            }
        },
        {
            path: 'label',
            component: resolve => require(['../pages/main/blog/label.vue'], resolve),
            meta: {
                title: `标签管理`,
            }
        },
        {
            path: 'material',
            component: resolve => require(['../pages/main/blog/material.vue'], resolve),
            meta: {
                title: `素材管理`,
            }
        },
        {
            path: 'php',
            component: resolve => require(['../pages/main/tool/php.vue'], resolve),
            meta: {
                title: `php小工具`,
            }
        },
        {
            path: 'js',
            component: resolve => require(['../pages/main/tool/js.vue'], resolve),
            meta: {
                title: `javascript小工具`,
            }
        },
        {
            path: 'wechat_config',
            component: resolve => require(['../pages/main/wechat/wechat_config.vue'], resolve),
            meta: {
                title: `微信配置管理`,
            }
        },
        {
            path: 'wechat_reply',
            component: resolve => require(['../pages/main/wechat/wechat_reply.vue'], resolve),
            meta: {
                title: `关键词回复`,
            }
        },
        {
            path: 'custom_menu',
            component: resolve => require(['../pages/main/wechat/wechat_custom_menu.vue'], resolve),
            meta: {
                title: `自定义菜单`,
            }
        },
        {
            path: 'wechat_material',
            component: resolve => require(['../pages/main/wechat/wechat_material.vue'], resolve),
            meta: {
                title: `素材管理`,
            }
        },
        {
            path: 'wechat_member',
            component: resolve => require(['../pages/main/wechat/wechat_member.vue'], resolve),
            meta: {
                title: `会员管理`,
            }
        },
        {
            path: 'wechat_dashboard',
            component: resolve => require(['../pages/main/wechat/wechat_dashboard.vue'], resolve),
            meta: {
                title: `微信首页`,
            }
        },
        {
            path: 'menu',
            component: resolve => require(['../pages/main/system/menu.vue'], resolve),
            meta: {
                title: `菜单管理`,
            }
        },
        {
            path: 'account',
            component: resolve => require(['../pages/main/system/account.vue'], resolve),
            meta: {
                title: `账户管理`,
            }
        }
    ]
}

const login = {
    path: '/login',
    component: resolve => require(['../pages/login.vue'], resolve),
    meta: { title: 'EricGU178后台登陆' }
}

const NotFound = {
    path: '/404',
    component: resolve => require(['../error_pages/404.vue'], resolve),
    meta: { title: "404 | 啊哦~ 你所访问的页面不存在", }
}

const NotFound403 = {
    path: '/403',
    component: resolve => require(['../error_pages/403.vue'], resolve),
    meta: { title: "403 | 啊哦~ 你所访问的页面不存在", }
}

const NotFound302 = {
    path: '/302',
    component: resolve => require(['../error_pages/302.vue'], resolve),
    meta: { title: "302 | 啊哦~ 你所访问的页面不存在", }
}

export const routers = [
    indexRouter,
    login,
    NotFound,
    NotFound403,
    NotFound302
]