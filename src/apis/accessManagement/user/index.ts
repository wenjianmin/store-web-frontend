import http from '@/server'

/** 获取当前登录用户信息 */
export async function getCurrentUserInfo() {
  return http.request({
    url: '/api/user/currentUser',
    method: 'get'
  })
}

/**
 * 获取用户列表
 *
 * @param params 用户列表参数
 * @returns 返回用户列表数据
 */
export async function getUserList(params: User.UserListParams) {
  return http.request({
    url: '/api/user/list',
    method: 'get',
    params
  })
}

export async function addUser(data: User.UserEntity) {
  return http.request({
    url: '/api/v1/admin/register',
    method: 'post',
    data
  })
}

export async function editUser(data: Partial<User.UserEntity>) {
  return http.request({
    url: '/api/user/edit',
    method: 'patch',
    data
  })
}

export async function delUser(data: Pick<User.UserEntity, 'id'>) {
  return http.request({
    url: `/api/user/delete/${data.id}`,
    method: 'get'
  })
}
