import http from '@/server'

/**
 * 获取订单列表
 *
 * @returns 返回订单列表的HTTP请求结果
 */
export async function getOrderList(params: Order.OrderListParams) {
  return http.request({
    url: '/api/order/list',
    method: 'get',
    params
  })
}

export async function createOrder(data: Order.OrderEntity) {
  return http.request({
    url: '/api/order/create',
    method: 'post',
    data
  })
}

export async function updateActStatus(data: Partial<Order.OrderEntity>) {
  return http.request({
    url: '/api/order/updateStatus',
    method: 'patch',
    data
  })
}

export async function delOrder(data: Pick<Order.OrderEntity, 'id'>) {
  return http.request({
    url: `/api/order/delete/${data.id}`,
    method: 'get'
  })
}

export async function getOrderDetail(data: Pick<Order.OrderEntity, 'id'>) {
  return http.request({
    url: `/api/order/detail/${data.id}`,
    method: 'get'
  })
}

