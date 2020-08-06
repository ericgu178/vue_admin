import { getRequest, postRequest } from "../libs/axios";



export const upload = 'https://ericgu178.com' + '/admin/material/upload';





// 微信相关
export const getWechatConfig = params => {
    return getRequest('/wechat_admin/wechat_config/get', params);
}

// dashboard
export const switchStatus = params => {
    return postRequest('/wechat_admin/wechat_config/switchStatus', params);
}


// 获取所有微信回复
export const getWechatReply = params => {
    return getRequest('/wechat_admin/wechat_reply/get', params);
}

export const WechatReplyAdd = params => {
    return postRequest('/wechat_admin/wechat_reply/add', params);
}
export const WechatReplyUpdate = params => {
    return postRequest('/wechat_admin/wechat_reply/edit', params);
}


export const memberGet = params => {
    return postRequest('/wechat_admin/wechat_member/get', params);
}
export const syncMember = params => {
    return postRequest('/wechat_admin/wechat_member/syncMember', params);
}

// 素材

export const getMaterial = params => {
    return getRequest('/wechat_admin/wechat_material/get', params);
}
export const image_save = params => {
    return postRequest('/wechat_admin/wechat_material/image_save', params);
}
export const syncMaterial = params => {
    return postRequest('/wechat_admin/wechat_material/syncMaterial', params);
}

export const wechatGetMenu = params => {
    return getRequest('/wechat_admin/wechat_menu/get', params);
}
export const release = params => {
    return postRequest('/wechat_admin/wechat_menu/release', params);
}


