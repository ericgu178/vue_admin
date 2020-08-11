import { getRequest, postRequest } from "../libs/axios";

export const getMenus = params => {
    return postRequest('/admin/getMenus', params);
}
export const getRouter = params => {
    return getRequest('/admin/getRouter', params);
}
export const getAdminIndex = params => {
    return getRequest('/admin/getAdminIndex', params);
}
export const getGroup = params => {
    return getRequest('/admin/getGroup', params);
}
// 后台用户相关
export const updateGroup = params => {
    return postRequest('/admin/updateGroup', params);
}
// 后台用户相关
export const addGroup = params => {
    return postRequest('/admin/addGroup', params);
}

// 节点相关
export const getRole = params => {
    return getRequest('/admin/getRole', params);
}
export const addRole = params => {
    return postRequest('/admin/addRole', params);
}
export const editRole = params => {
    return postRequest('/admin/editRole', params);
}
export const deleteRole = params => {
    return postRequest('/admin/deleteRole', params);
}

// 添加用户帐号
export const addUser = params => {
    return postRequest('/admin/addAUser', params);
}

export const editUser = params => {
    return postRequest('/admin/editAUser', params);
}
