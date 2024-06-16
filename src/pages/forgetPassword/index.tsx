import { forgot, getGorgotCode } from '@/apis/login'
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
import { message, Tabs } from 'antd'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '@/assets/mouse.jpg'

const ForgetPassword = () => {
  const navigate = useNavigate()
  const formRef = useRef<ProFormInstance>()
  const backToLogin = () => {
    navigate('/login')
  }
  const handleSubmit = async (val: Login.LoginEntity) => {
    const { success } = await forgot(val)
    if (success) {
      message.success('密码重置成功，请重新登录', () => {
        backToLogin()
      })
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
          handleSubmit(val)
        }}
        submitter={{
          searchConfig: {
            submitText: '确认提交'
          }
        }}
      >
        <>
          <Tabs
            centered
            activeKey={'registry'}
          >
            <Tabs.TabPane key={'registry'} tab={'忘记密码'} />
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
              placeholder={'请输入新密码'}
              rules={[
                {
                  required: true,
                  message: '请输入新密码！'
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
                const { success } = await getGorgotCode({ email: formRef.current?.getFieldValue('email') })
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

export default ForgetPassword
