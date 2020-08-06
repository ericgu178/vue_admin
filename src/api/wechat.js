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

// 标签列表
export const tagsIndex = params => {
    return getRequest('/admin/tags/index', params);
}
export const tagsAdd = params => {
    return postRequest('/admin/tags/add', params);
}
export const tagsUpdate = params => {
    return postRequest('/admin/tags/edit', params);
}

export const tagsSetStatus = params => {
    return postRequest('/admin/tags/setStatus', params);
}


// 素材
export const getMaterial = params => {
    return getRequest('/admin/material/get', params);
}

// 保存图片
export const imageSave = params => {
    return postRequest('/admin/material/image_save', params);

}

