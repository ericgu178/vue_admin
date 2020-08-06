/*
 *    公共组件
 */

const common = {
    state: {
        title: '视频管理'
    },
    mutations: {
        SET_TITLE: (state, action) => {
            state.title = !state.isCollapse
        },
    }
}
export default common
