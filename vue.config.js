const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        allowedHosts: "all",
        proxy: {
            '/api': {
                target: 'http://54.180.229.222:3001',
                changeOrigin: true,
                ws:false,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
})
