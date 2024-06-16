import http from '@/server'
import { Activity } from './typing'

/**
 * 获取活动列表
 *
 * @returns 返回活动列表的HTTP请求结果
 */
export async function getActivityList(params: Activity.ActivityListParams) {
  return http.request({
    url: '/api/activity/list',
    method: 'get',
    params
  })
}

export async function createActivity(data: Activity.ActivityEntity) {
  return http.request({
    url: '/api/activity/create',
    method: 'post',
    data
  })
}

export async function editActivity(data: Partial<Activity.ActivityEntity>) {
  return http.request({
    url: '/api/activity/edit',
    method: 'patch',
    data
  })
}

export async function delActivity(data: Pick<Activity.ActivityEntity, 'id'>) {
  return http.request({
    url: `/api/activity/delete/${data.id}`,
    method: 'get'
  })
}
