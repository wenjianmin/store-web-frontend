import dayjs from "dayjs"

declare namespace Activity {
  type ActivityEntity = {
    id?: number
    /**
     * 活动名称
     */
    name?: string
    /**
     * 备注
     */
    desc?: string
    /**
     * 活动商品
     */
    productId?: number[]
    /**
     * 活动类型
     */
    type?: number

    /**
     * 活动状态
     */
    status?: number

    /** 开始时间 */
    startTime?: string

    /** 结束时间 */
    endTime?: string

    /** 活动时间 */
    dateTimeRange?: dayjs.Dayjs[]

    
  }

  type ActivityListParams = {
    /** 用户名 */
    name?: string
  } & Global.PageParams
}
