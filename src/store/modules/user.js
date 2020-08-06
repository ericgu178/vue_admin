/**
 * 用户登录组件
 */



const user = {
    state: {
        menus: [
            {
                icon: "sound",
                index: "/index",
                title: "老干部",
                subs: [
                    {
                        icon: "area-chart",
                        index: "dashboard",
                        title: "Dashboard",
                    },
                    {
                        icon: "contacts",
                        index: "user_index",
                        title: "用户管理",
                    },
                    {
                        icon: "question",
                        index: "question_index",
                        title: "问题管理",
                    },
                    {
                        icon: "gift",
                        index: "activity",
                        title: "活动管理",
                    },
                ],
            },
            {
                icon: "setting",
                index: "/wechat",
                title: "系统",
                subs: [
                    {
                        icon: "setting",
                        index: "admin_user",
                        title: "帐号管理",
                    },
                    {
                        icon: "schedule",
                        index: "unit_index",
                        title: "单位管理",
                    },
                ],
            },
        ]
    },
    mutations: {
        SET_MENUS: (state, action) => {
            state.menus = !state.isCollapse
        },
    }
}
export default user;