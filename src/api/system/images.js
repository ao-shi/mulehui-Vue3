import request from '@/utils/request'

// 查询轮播图管理列表
export function listImages(query) {
  return request({
    url: '/system/images/list',
    method: 'get',
    params: query
  })
}

// 查询轮播图管理详细
export function getImages(id) {
  return request({
    url: '/system/images/' + id,
    method: 'get'
  })
}

// 新增轮播图管理
export function addImages(data) {
  return request({
    url: '/system/images',
    method: 'post',
    data: data
  })
}

// 修改轮播图管理
export function updateImages(data) {
  return request({
    url: '/system/images',
    method: 'put',
    data: data
  })
}

// 删除轮播图管理
export function delImages(id) {
  return request({
    url: '/system/images/' + id,
    method: 'delete'
  })
}
