const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        allowedHosts: "all",
        proxy: {
            '/api': {
                target: process.env.VUE_APP_API_BASE_URL,
                changeOrigin: true,
                ws:false,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
})
