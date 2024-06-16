import http from '@/server'

/**
 * 获取商品列表
 *
 * @returns 返回商品列表的HTTP请求结果
 */
export async function getProductList(params: Product.ProductListParams) {
  return http.request({
    url: '/api/product/list',
    method: 'get',
    params
  })
}

export async function getHotProductList(params: Product.ProductHotListParams) {
  return http.request({
    url: '/api/product/hot-list',
    method: 'get',
    params
  })
}

export async function createProduct(data: Product.ProductEntity) {
  return http.request({
    url: '/api/product/create',
    method: 'post',
    data
  })
}

export async function editProduct(data: Partial<Product.ProductEntity>) {
  return http.request({
    url: '/api/product/edit',
    method: 'patch',
    data
  })
}

export async function delProduct(data: Pick<Product.ProductEntity, 'id'>) {
  return http.request({
    url: `/api/product/delete/${data.id}`,
    method: 'get'
  })
}


export async function fileUpload(data: FormData) {
  return http.request({
    url: '/api/sys/upload',
    method: 'post',
    data,
    headers: {
      "Content-type": "multipart/form-data",
    }
  })
}
