const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        allowedHosts: "all",
        proxy: {
            '/api': {
                target: 'http://www.alb-was-386184360.ap-northeast-2.elb.amazonaws.com',
                changeOrigin: true,
                ws:false,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
})
