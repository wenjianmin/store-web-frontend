declare namespace Product {
  type ProductEntity = {
    id?: number
    /**
     * 活动名称
     */
    name?: string
    /**
     * 价格
     */
    price?: string
    /**
     * 备注
     */
    desc?: string
    /**
     * 商品图片
     */
    images?: string[]
    /**
     * 商品上下架状态
     */
    status?: number
  }

  type ProductListParams = {
    /** 商品名 */
    name?: string
    status?: number
  } & Global.PageParams

  type ProductHotListParams = {
    /** 排名 */
    topN?: number
  }

}
