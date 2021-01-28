
module.exports = {
  //publicPath: "./", // 公共路径(必须有的)
  // outputDir: "dist", // 输出文件目录
  // assetsDir: "static", //静态资源文件名称
  lintOnSave: false,
  productionSourceMap: false, //去除打包后js的map文件
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
  },
  //去掉console
  configureWebpack: (config) => {
    // 判断为生产模式下，因为开发模式我们是想保存console的
    if (process.env.NODE_ENV === "production") {
      config.optimization.minimizer.map((arg) => {
        //console.log(arg)
        if (arg && arg.options && arg.options.terserOptions && arg.options.terserOptions.compress) {
          const option = arg.options.terserOptions.compress;
          option.drop_console = true; // 打开开关
        }
        return arg;
      });
    }
  },
}