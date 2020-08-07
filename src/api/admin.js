import { getRequest, postRequest } from "../libs/axios";

export const getMenus = params => {
    return getRequest('/admin/auth/getMenus', params);
}