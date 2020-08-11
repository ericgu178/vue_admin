const indexRouter = {
    path: '/',
    meta: { title: `首页`, },
    component: resolve => require(['../pages/common/Home.vue'], resolve),
    redirect: 'dashboard', // 重定向到某个页面
    children: [
        {path: 'home',meta: {title: `首页`,},component: resolve => require(['../pages/main/home.vue'], resolve)},
        {path: 'article',meta: {title: `博客添加`,},component: resolve => require(['../pages/main/blog/article.vue'], resolve)},
        {path: 'edit_article',meta: {title: `文章修改`,},component: resolve => require(['../pages/main/blog/article_edit.vue'], resolve),},
        {path: 'php',meta: {title: `php小工具`,},component: resolve => require(['../pages/main/tool/php.vue'], resolve)},
        {path: 'js',meta: {title: `javascript小工具`,},component: resolve => require(['../pages/main/tool/js.vue'], resolve),},
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