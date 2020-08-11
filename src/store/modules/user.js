/**
 * 用户登录组件
 */

import { router } from '@/router/index';
import { setStore } from "@/libs/store"
const user = {
    state: {
        menus: [],
        routers: [],
    },
    mutations: {
        // 设置菜单和路由
        SET_MENUS: (state, action) => {
            let result = getChild(action.menus)
            // 左侧菜单
            state.menus = result
            // 路由菜单
            const r = []
            initRouterNode(r, action.menus)
            state.routers.push(...r);
            router.options.routes.push(...r)
            router.addRoutes(r);
            router.push({ path: action.currentRouter || '/home' })
            console.log(router.options.routes)
        },
    }
}

// 创建组件
const createComponents = url => {
    return () => import(`@/pages/${url}.vue`)
}

// 创建节点
const initRouterNode = (routers, data) => {

    for (var item of data) {
        let menu = Object.assign({}, item);
        menu.component = createComponents(menu.component);

        if (item.children && item.children.length > 0) {
            menu.children = [];
            initRouterNode(menu.children, item.children);
        }

        let meta = {};
        // 给页面添加权限、标题、第三方网页链接
        meta.permTypes = menu.permTypes ? menu.permTypes : null;
        meta.title = menu.title ? menu.title : null;
        meta.url = menu.url ? menu.url : null;
        menu.meta = meta;
        routers.push(menu);
    }
};

// 子循环
const getChild = list => {
    let temp = [];
    list.filter(item => {
        temp.push({
            icon: item.icon,
            index: item.path,
            title: item.title,
            subs: getChild(item.children)
        })
    })
    return temp;
}
export default user;