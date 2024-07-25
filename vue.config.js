const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        allowedHosts: "all",
        proxy: {
            '/api': {
                target: 'http://technocratist.com',
                changeOrigin: true,
                ws:false,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
})
