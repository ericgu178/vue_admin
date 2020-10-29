const Main = () => import('../pages/common/Home.vue')

const indexRouter = {
    path: '/',
    meta: { title: `首页` },
    component: Main,
    redirect: 'home', // 重定向到某个页面
    children: [
        { path: 'home',meta: {title: `首页`,},component: () => import('../pages/main/home.vue') },
        { path: 'article',meta: {title: `博客添加`,},component: () => import('../pages/main/blog/article.vue')},
        { path: 'edit_article',meta: {title: `文章修改`,},component: () => import('../pages/main/blog/article_edit.vue')},
        { path: 'php',meta: {title: `php小工具`,},component: () => import('../pages/main/tool/php.vue')},
        { path: 'js',meta: {title: `javascript小工具`,},component: () => import('../pages/main/tool/js.vue')},
    ]
}
const login = {
    path: '/login',
    component: () => import('../pages/login.vue'),
    meta: { title: 'EricGU178后台登陆' }
}

const NotFound = {
    path: '/404',
    component: () => import('../error_pages/404.vue'),
    meta: { title: "404 | 啊哦~ 你所访问的页面不存在", }
}

const NotFound403 = {
    path: '/403',
    component: () => import('../error_pages/403.vue'),
    meta: { title: "403 | 啊哦~ 你所访问的页面不存在", }
}

const NotFound302 = {
    path: '/302',
    component: () => import('../error_pages/302.vue'),
    meta: { title: "302 | 啊哦~ 你所访问的页面不存在", }
}

export const routers = [
    indexRouter,
    login,
    NotFound,
    NotFound403,
    NotFound302
]