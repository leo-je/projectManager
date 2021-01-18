 
module.exports = {
  
    devServer: {
      proxy: {
        // proxy all requests starting with /api to jsonplaceholder
        '/pm': {
          target: 'http://127.0.0.1:8081',   //代理接口（ps:这里为随意打的地址）
          changeOrigin: true,
          //pathRewrite: {
           // '^/api': ''    //代理的路径 //是否移除api三个字段,
          //}
        }
      }
    }
  }