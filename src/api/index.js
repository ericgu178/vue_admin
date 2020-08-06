import { getRequest, postRequest } from "../libs/axios";



export const upload = 'https://ericgu178.com' + '/admin/material/upload';





// 后台用户相关
export const login = params => {
    return postRequest('/admin/login/login', params);
}

// dashboard
export const dashboardIndex = params => {
    return getRequest('/admin/dashboard/index', params);
}


// 文章
export const getArticle = params => {
    return getRequest('/admin/article/index', params);
}
// 文章设置banner图

export const setBanner = params => {
    return postRequest('/admin/article/setBanner', params);
}
// 评论列表
export const commentsList = params => {
    return getRequest('/admin/article/commentsList', params);
}
export const isComment = params => {
    return postRequest('/admin/article/isComment', params);
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

