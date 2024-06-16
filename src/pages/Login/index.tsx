import { login } from '@/apis/login'
import { ComponTypeEnum } from '@/layout/BasicLayout'
import { storeGlobalUser } from '@/store/globalUser'
import { storage } from '@/utils/Storage'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginForm, ProFormText } from '@ant-design/pro-components'
import { RouteType } from '@config/routes'
import { routers } from '@config/routes/routers'
import { Tabs } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '@/assets/mouse.jpg'

type LoginType = 'username' | 'email'

const Login = () => {
  const [loginType, setLoginType] = useState<LoginType>('username')
  const navigate = useNavigate()

  const handleForgot = () => {
    navigate('/forgetPassword')
  }
  const handleLogin = async (val: Login.LoginEntity) => {
    const { data = {} } = await login(val)
    storage.set('token', data?.access_token)
    console.log('data', data)
    /** 跳转有权限的第一个菜单 */
    await storeGlobalUser.getUserDetail()
    const flattenRoutes: (routes: RouteType[]) => RouteType[] = (routes: RouteType[]) => {
      const flattenedRoutes: RouteType[] = []
      function traverse(routes: RouteType[]) {
        routes.forEach(route => {
          flattenedRoutes.push(route)
          if (route.children) {
            traverse(route.children)
          }
        })
      }

      traverse(routes)

      return flattenedRoutes
    }
    const resRoutes = flattenRoutes(routers)
    const findPath =
      resRoutes?.[
        resRoutes?.findIndex(
          item =>
            item?.name ===
            storeGlobalUser?.userInfo?.menus?.filter(
              citem => citem?.type === ComponTypeEnum.MENU
            )?.[0]?.title
        )
      ]?.path
    navigate(findPath || '/')
  }
  const handleRegistry = () => {
    navigate('/registry')
  }
  return (
    <div style={{ backgroundColor: 'white', height: '100vh' }}>
      <LoginForm
        logo={logo}
        title="数字门店管理平台"
        subTitle="基于NestJS + React的全栈项目"
        onFinish={async (val: Login.LoginEntity) => {
          await handleLogin(val)
        }}
      >
        <>
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey: LoginType) => setLoginType(activeKey as LoginType)}
          >
            <Tabs.TabPane key={'username'} tab={'账号密码登录'} />
          </Tabs>
          {loginType === 'username' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} />
                }}
                placeholder={'用户名: admin'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!'
                  }
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />
                }}
                placeholder={'密码: admin'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！'
                  }
                ]}
              />
            </>
          )}
        </>
        <div
          style={{
            marginBlockEnd: 24
          }}
        >
          <a onClick={handleRegistry}>立即注册</a>
          <a style={{ float: 'right' }} onClick={handleForgot}>
            忘记密码
          </a>
        </div>
      </LoginForm>
    </div>
  )
}

export default Login
