/*
 *    公共组件
 */

const common = {
    state: {
        title: 'EricGU178后台管理',
        baseUrl:'https://api.ericgu178.com'
    },
    mutations: {
        SET_TITLE: (state, action) => {
            state.title = !state.isCollapse
        },
    }
}
export default common
