declare namespace User {
  type UserEntity = {
    /**
     * 邮箱
     */
    email?: string
    /**
     * 用户头像
     */
    icon?: string
    id?: number
    /**
     * 备注
     */
    desc?: string
    /**
     * 密码
     */
    password: string
    /**
     * 角色ids
     */
    roleIds?: number[]
    roles?: Role.RoleEntity[]
    /**
     * 帐号是否冻结：0->未冻结；1->冻结
     */
    freezed?: number
    /**
     * 用户名
     */
    username: string
    menus?: Menu.MenuEntity[]
    /** 用户类型 */
    userType?: number
  }

  type UserListParams = {
    /** 用户名 */
    username?: string
  } & Global.PageParams
}
