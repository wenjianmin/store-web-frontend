import { RouteType } from '.'
import NotFoundPage from '@/404'
import App from '@/App'
import ErrorPage from '@/ErrorPage'
import ComponManagement from '@/pages/accessManagement/ComponManagement'
import ResourceManangement from '@/pages/accessManagement/ResourceManangement'
import Resource from '@/pages/accessManagement/ResourceManangement/Resource'
import RoleManangement from '@/pages/accessManagement/RoleManangement'
import UserManagement from '@/pages/accessManagement/UserManagement'
import Activity from '@/pages/Activity'
import ForgetPassword from '@/pages/forgetPassword'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Order from '@/pages/Order'
import Product from '@/pages/Product'
import HotList from '@/pages/Product/hotList'
import Registry from '@/pages/registry'
import Test from '@/pages/Test'
import TestChild from '@/pages/Test/TestChild'
import { HomeFilled, RocketFilled, SettingFilled, ShoppingFilled, SmileFilled, FireFilled  } from '@ant-design/icons'
import { Navigate } from 'react-router-dom'

export const routers = [
  {
    path: '/',
    /** 重定向 */
    element: <Navigate replace to="/home" />
  },
  {
    path: '/',
    /** 承载布局 */
    element: <App />,
    errorElement: <ErrorPage />,
    icon: <SmileFilled />,
    children: [
      /** 布局下路由，页面路由在该children配置 */
      {
        path: '/home',
        name: '首页',
        icon: <HomeFilled />,
        element: <Home />,
        permissionObj: true
      },
      {
        path: '/product',
        name: '商品管理',
        icon: <RocketFilled />,
        permissionObj: true,
        children: [
          {
            path: '/product',
            /** 重定向 */
            element: <Navigate replace to="/product/list" />
          },
          {
            path: '/product/list',
            name: '商品列表',
            permissionObj: true,
            element: <Product />,
          },
          {
            path: '/product/hotList',
            name: '热销排行',
            permissionObj: true,
            element: <HotList />,
          },
        ]
      },
      {
        path: '/order',
        name: '订单管理',
        icon: <ShoppingFilled />,
        element: <Order />,
        permissionObj: true
      },
      {
        path: '/activity',
        name: '活动管理',
        icon: <FireFilled />,
        element: <Activity />,
        permissionObj: true
      },
      {
        path: '/accessManagement',
        name: '系统管理',
        icon: <SettingFilled />,
        permissionObj: true,
        children: [
          {
            path: '/accessManagement',
            /** 重定向 */
            element: <Navigate replace to="/accessManagement/userManagement" />
          },
          {
            path: '/accessManagement/userManagement',
            name: '用户管理',
            permissionObj: true,
            element: <UserManagement />
          },
          {
            path: '/accessManagement/roleManagement',
            name: '角色管理',
            permissionObj: true,
            element: <RoleManangement />
          },
          {
            path: '/accessManagement/componentManagement',
            name: '组件管理',
            permissionObj: true,
            element: <ComponManagement />
          },
          {
            path: '/accessManagement/resourceManagement',
            name: '资源管理',
            permissionObj: true,
            children: [
              {
                path: '/accessManagement/resourceManagement',
                /** 重定向 */
                element: (
                  <Navigate replace to="/accessManagement/resourceManagement/resourceCategory" />
                )
              },
              {
                path: '/accessManagement/resourceManagement/resourceCategory',
                name: '资源分类',
                permissionObj: true,
                element: <ResourceManangement />,
                hideInMenu: true
              },
              {
                path: '/accessManagement/resourceManagement/resourceCategory/:resourceCategoryId/resource',
                name: '资源列表',
                permissionObj: true,
                element: <Resource />,
                hideInMenu: true
              }
            ]
          }
        ]
      },
      {
        path: '/layoutNone',
        name: '布局隐藏',
        hideInMenu: true,
        hideLayout: true,
        element: <TestChild />
      }
    ]
  },
  {
    path: '/login',
    name: '登录',
    element: <Login />
  },
  {
    path: '/registry',
    name: '注册',
    element: <Registry />
  },
  {
    path: '/forgetPassword',
    name: '找回密码',
    element: <ForgetPassword />
  },
  { path: '*', element: <NotFoundPage /> }
] as RouteType[]
