import { useRouteError } from 'react-router-dom'

const ErrorPage = () => {
  // 使用 useRouteError 获取路由错误信息
  const error: any = useRouteError()
  console.error(error)

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error?.statusText || error?.message}</i>
      </p>
    </div>
  )
}
export default ErrorPage
