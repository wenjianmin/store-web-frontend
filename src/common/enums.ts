
export enum ProductStatus {
  /** 未上架 */
  NOT_ON_SALE = 0,
  /** 已上架 */
  ON_SALE = 1,
  /** 已下架 */
  OFF_SALE = 2
}
export enum OrderStatus {
  /** 未付款 */
  NOT_PAY = 0,
  /** 已付款 */
  PAID = 1,
  /** 已取消订单 */
  CANCEL = 2,
}

export enum ActivityType {
  /** 限时抢购 */
  TIME_LIMIT = 3,
  /** 秒杀活动 */
  SECKILL = 2,
  /** 拼团活动 */
  GROUP_BUY = 1,
  /** 普通活动 */
  NORMAL = 0,
}

export enum ActivityStatus {
  /** 未开始 */
  NOT_START = 0,
  /** 已开始 */
  START = 1,
  /** 已结束 */
  END = 2,
}
