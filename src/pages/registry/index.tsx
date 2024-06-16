import { getCaptchaCode, login, registry } from '@/apis/login'
import { ComponTypeEnum } from '@/layout/BasicLayout'
import { storeGlobalUser } from '@/store/globalUser'
import { storage } from '@/utils/Storage'
import {
  LockOutlined,
  MailOutlined,
  UserOutlined
} from '@ant-design/icons'
import {
  LoginForm,
  ProFormCaptcha,
  ProFormInstance,
  ProFormText
} from '@ant-design/pro-components'
import { RouteType } from '@config/routes'
import { routers } from '@config/routes/routers'
import { message, Tabs } from 'antd'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '@/assets/mouse.jpg'

const Registry = () => {
  const navigate = useNavigate()
  const formRef = useRef<ProFormInstance>()
  const backToLogin = () => {
    navigate('/login')
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
  const handleRegistry = async (val: Login.LoginEntity) => {
    const { success } = await registry(val)
    if (success) {
      handleLogin(val)
    }
  }
  return (
    <div style={{ backgroundColor: 'white', height: '100vh' }}>
      <LoginForm
        logo={logo}
        title="数字门店管理平台"
        subTitle="基于NestJS + React的全栈项目"
        formRef={formRef}
        onFinish={async (val: Login.LoginEntity) => {
          await handleRegistry(val)
        }}
        submitter={{
          searchConfig: {
            submitText: '注册'
          }
        }}
      >
        <>
          <Tabs
            centered
            activeKey={'registry'}
          >
            <Tabs.TabPane key={'registry'} tab={'用户注册'} />
          </Tabs>
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />
              }}
              placeholder={'请输入账号/用户名'}
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
              placeholder={'请输入注册密码'}
              rules={[
                {
                  required: true,
                  message: '请输入注册密码！'
                }
              ]}
            />
            <ProFormText.Password
              name="confirmPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />
              }}
              placeholder={'请输入确认密码'}
              rules={[
                {
                  required: true,
                  message: '请输入确认密码！'
                }
              ]}
            />
            <ProFormText
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined />,
              }}
              placeholder={'请输入邮箱'}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!'
                }
              ]}
            />
            <ProFormCaptcha
              name="code"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱验证码',
                },
              ]}
              placeholder="请输入邮箱验证码"
              onGetCaptcha={async () => {
                // 获取验证码
                const { success } = await getCaptchaCode({ email: formRef.current?.getFieldValue('email') })
                if (success) {
                  message.success('验证码已发送至邮箱')
                }
              }}
            />
          </>
        </>
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <a onClick={backToLogin}>
            返回登录
          </a>
        </div>
      </LoginForm>
    </div>
  )
}

export default Registry
