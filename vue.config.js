const webpack = require('webpack');
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath: '',
    outputDir: 'dist/lib',
    assetsDir: 'static',
    productionSourceMap: false,
    css: { extract: false },
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: 'richform',
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        //警告 webpack 的性能提示
        performance: {
            hints: 'warning',
            //入口起点的最大体积
            maxEntrypointSize: 5000,
            //生成文件的最大体积
            maxAssetSize: 3000,
        },
        plugins: [],
        externals: {
            // "ajv-errors": "ajv-errors",
            // "ajv-i18n": "ajv-i18n",
            // "axios": "axios",
            // "core-js": "core-js",
            // "element-ui": "element-ui",
            // "jquery": "jquery",
            // "ramda": "ramda",
            // "vue": "vue",
            // "vue-i18n": "vue-i18n",
            // "vue-router": "vue-router",
            // "vue-baidu-map": "vue-baidu-map",
            // "vue2-perfect-scrollbar": "vue2-perfect-scrollbar",
            // "vuedraggable": "vuedraggable",
            // "vxe-table": "vxe-table",
            // "xe-utils": "xe-utils"
        }
    },
    // to handle element icon error in build. 
    chainWebpack: config => {
        config.module
            .rule("fonts")
            .test(/.(ttf|otf|eot|woff|woff2)$/)
            .use("url-loader")
            .loader("url-loader")
            .tap(options => {
                options = {
                    // limit: 10000,
                    name: '/static/fonts/[name].[ext]',
                }
                return options
            })
            .end()
    }
}