import request from '@/utils/request'

// 查询公告消息列表
export function listMags(query) {
  return request({
    url: '/system/mags/list',
    method: 'get',
    params: query
  })
}

// 查询公告消息详细
export function getMags(id) {
  return request({
    url: '/system/mags/' + id,
    method: 'get'
  })
}

// 新增公告消息
export function addMags(data) {
  return request({
    url: '/system/mags',
    method: 'post',
    data: data
  })
}

// 修改公告消息
export function updateMags(data) {
  return request({
    url: '/system/mags',
    method: 'put',
    data: data
  })
}

// 删除公告消息
export function delMags(id) {
  return request({
    url: '/system/mags/' + id,
    method: 'delete'
  })
}
