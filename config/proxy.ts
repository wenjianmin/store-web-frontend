/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  development: {
    '/api/': {
      target: 'http://localhost:3332',
      changeOrigin: true,
      // rewrite: (path: string) => path.replace(/^\/api/, '')
    }
  },
  docker: {
    '/api/': {
      target: 'http://localhost:3333',
      changeOrigin: true,
      // rewrite: (path: string) => path.replace('^/api/', '')
    }
  },
  test: {
    '/api/': {
      target: 'http://测试环境接口地址',
      changeOrigin: true,
      rewrite: (path: string) => path.replace('^/api/', '')
    }
  },
  pre: {
    '/api/': {
      target: 'http://预发布接口地址',
      changeOrigin: true,
      rewrite: (path: string) => path.replace('^/api/', '')
    }
  },
  pro: {
    '/api/': {
      target: 'http://线上接口地址',
      changeOrigin: true,
      rewrite: (path: string) => path.replace('^/api/', '')
    }
  }
} as any
