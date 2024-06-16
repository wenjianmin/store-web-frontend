declare namespace Order {
  type OrderEntity = {
    id?: number
    /**
     * 订单价格
     */
    price?: number
    /**
     * 订单折扣
     */
    discount?: number
    /**
     * 商品数量
     */
    count?: number
    
    /**
     * 订单价格
     */
    discountPrice?: number
    /**
     * 备注
     */
    desc?: string
    /**
     * 操作员
     */
    operator?: string
    /**
     * 活动商品
     */
    productId?: number[]
    /**
     * 订单类型
     */
    status?: number
  }

  type OrderListParams = {
    /** 订单id */
    id?: string
  } & Global.PageParams
}
