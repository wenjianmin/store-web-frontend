
## 相关技术

| 技术                             | 官网                              | 描述             |
| -------------------------------- | --------------------------------- | ---------------- |
| Vite 5.X                         | https://cn.vitejs.dev/            | 基础脚手架       |
| React Router 6.X                 | https://reactrouter.com/en/main   | react 路由管理   |
| ant-design 5.X                   | https://ant.design/index-cn       | ui 组件          |
| @ant-design/pro-components 2.4.0 | https://procomponents.ant.design/ | 中后台高阶组件   |
| mobx 6.8.0                       | https://mobx.js.org/README.html   | 轻量级状态管理   |
| typescript                       | -                                 | 代码类型规范     |
| axios                            | -                                 | 数据请求         |
| prettier                         | -                                 | 代码美化，格式化 |
| eslint                           | -                                 | 代码规范         |
| stylelint                        | -                                 | css 代码规范     |
| husky                            | -                                 | git commit 检验  |
| lint-staged                      | -                                 | git commit 检验  |

## 项目简介

基于 vite-mobx-TypeScript-react-Nest 开发的数字门店管理系统

## 主要功能

- 登录功能
  - token 存储
  - 后端 jwt
  - 权限相关控制
- 订单管理
  - 订单列表
  - 订单详情
  - 订单创建
  - 订单删除
  - 订单编辑
- 商品管理
  - 商品列表
  - 创建商品
  - 商品上下架
  - 商品编辑
- 活动管理
  - 活动列表
  - 创建活动
  - 活动提前结束
- 排行榜
- 用户管理
  - 用户列表
  - 用户创建
  - 用户编辑
  - 用户删除
  - 文件上传功能(图片上传)
- 角色管理
  - 角色列表
  - 角色编辑
  - 角色联动菜单进行权限控制

## 安装依赖

推荐使用 pnpm

```bash
pnpm install
npx husky install
```

## 脚本描述

### 开发启动

```bash
pnpm start
# mock模式启动
pnpm start:mock
```

### 打包

```bash
pnpm build
```

### 检查代码样式

```bash
pnpm lint:script
pnpm lint:style
```

