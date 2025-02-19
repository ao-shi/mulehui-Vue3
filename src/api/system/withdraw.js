import request from '@/utils/request'

// 查询提现列表
export function listWithdraw(query) {
  return request({
    url: '/system/withdraw/list',
    method: 'get',
    params: query
  })
}

// 查询提现详细
export function getWithdraw(id) {
  return request({
    url: '/system/withdraw/' + id,
    method: 'get'
  })
}

// 新增提现
export function addWithdraw(data) {
  return request({
    url: '/system/withdraw',
    method: 'post',
    data: data
  })
}

// 修改提现
export function updateWithdraw(data) {
  return request({
    url: '/system/withdraw',
    method: 'put',
    data: data
  })
}

// 删除提现
export function delWithdraw(id) {
  return request({
    url: '/system/withdraw/' + id,
    method: 'delete'
  })
}
