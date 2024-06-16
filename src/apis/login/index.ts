import http from '@/server'

export async function login(data?: Login.LoginEntity) {
  return http.request({
    url: '/api/sys/login',
    method: 'post',
    data
  })
}

export async function registry(data?: Login.LoginEntity) {
  return http.request({
    url: '/api/sys/registry',
    method: 'post',
    data
  })
}

export async function getCaptchaCode(params: { email: string }) {
  return http.request({
    url: '/api/sys/sendEmailForRegistry',
    method: 'get',
    params
  })
}

export async function forgot(data?: Login.LoginEntity) {
  return http.request({
    url: '/api/sys/forgot',
    method: 'post',
    data
  })
}

export async function getGorgotCode(params: { email: string }) {
  return http.request({
    url: '/api/sys/sendEmailForGorgot',
    method: 'get',
    params
  })
}
