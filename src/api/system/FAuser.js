import request from '@/utils/request'

// 查询会员表列表
export function listFAuser(query) {
  return request({
    url: '/system/FAuser/list',
    method: 'get',
    params: query
  })
}

// 查询会员表详细
export function getFAuser(id) {
  return request({
    url: '/system/FAuser/' + id,
    method: 'get'
  })
}

// 新增会员表
export function addFAuser(data) {
  return request({
    url: '/system/FAuser',
    method: 'post',
    data: data
  })
}

// 修改会员表
export function updateFAuser(data) {
  return request({
    url: '/system/FAuser',
    method: 'put',
    data: data
  })
}

// 删除会员表
export function delFAuser(id) {
  return request({
    url: '/system/FAuser/' + id,
    method: 'delete'
  })
}
