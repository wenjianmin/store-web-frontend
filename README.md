<p align="center">
  <a href="https://react.dev" target="blank"><img src="https://avatars.githubusercontent.com/u/102812?s=200&v=4" width="200" alt="React Logo" /></a>
</p>

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

基于 Vite-Mobx-TypeScript-React-Nest 开发的数字门店管理系统，是 **《NestJS全栈开发解析：快速上手与实践》** 的前端项目实战部分，与 **2024.9月** 上线。

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

## 交流学习

在项目运行中有遇到任何问题，请直接与作者联系！
需要加入交流群探讨学习，直接扫描下方二维码，如过期请添加作者WeChat！

作者WeChat：

<img src="image.png" alt="描述文本" width="200" height="auto">


项目交流群：

<img src="image-1.png" alt="描述文本" width="200" height="auto">

## 支持作者


图书购买链接：<a href="https://item.jd.com/14283389.html" target="blank">京东</a>

图书购买链接：<a href="https://product.dangdang.com/29783482.html" target="blank">当当</a>

## 更新日志

- 2024.10.26 新增Excel导入导出服务，支持Excel导入产品数据到db，导出db数据到Excel。
- 2024.11.10 新增爬虫服务，支持自定义爬虫内容、自动反爬等功能。

## 最新 NestJS 文章 & 专栏
- <a href="https://juejin.cn/column/7287914116285677603" target="blank"> Nest系列专栏 </a>
- <a href="https://juejin.cn/post/7442705410790965248" target="blank">NestJS全栈进阶指南</a>
- <a href="https://juejin.cn/post/7434869636506435624" target="blank"> NestJS实现通用爬虫服务</a>
- <a href="https://juejin.cn/post/7431476378450542626" target="blank"> NestJS实现Excel导入导出服务</a>

## 前端领域
- <a href="https://juejin.cn/column/7283768998777045051" target="blank"> 前端专栏 </a>

## 人生踩坑 & 感悟专栏 
- <a href="https://juejin.cn/column/7283776161527545893" target="blank"> 星光不问赶路人 </a>
