

import request from '@/utils/request'
export function queryPhotolist(formdata) {
    return request({
        url: '/media/photo/querylist',
        method: 'post',
        data: formdata
    })
}