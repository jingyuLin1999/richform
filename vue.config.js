const webpack = require('webpack');
const path = require('path');
const isBuild = process.argv.includes("build")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

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
            maxEntrypointSize: 100000,
            //生成文件的最大体积
            maxAssetSize: 600000,
        },
        plugins: [
            new BundleAnalyzerPlugin()
        ],
        externals: isBuild ? {
            "ajv": "ajv",
            "ajv-errors": "ajv-errors",
            // "ajv-i18n": "ajv-i18n",
            "axios": "axios",
            "element-resize-detector": "element-resize-detector",
            "core-js": "core-js",
            "element-ui": "element-ui",
            "jquery": "jquery",
            "ramda": "ramda",
            "vue": "vue",
            "vue-baidu-map": "vue-baidu-map",
            "vue-i18n": "vue-i18n",
            "vue-router": "vue-router",
            "vue-scrollto": "vue-scrollto",
            "vue2-perfect-scrollbar": "vue2-perfect-scrollbar",
            "vuedraggable": "vuedraggable",
            "vxe-table": "vxe-table",
            "xe-utils": "xe-utils"
        } : {}
    },
    // to handle element icon error in build. 
    chainWebpack: config => {
        config.module.rule('compile')
            .test(/\.js$/)
            .include
            .add(resolve('src'))
            .add(resolve('test'))
            .add(resolve('node_modules/webpack-dev-server/client'))
            .add(resolve('node_modules'))
            .end()
            .use('babel')
            .loader('babel-loader')
            .options({
                presets: [
                    ['@babel/preset-env', {
                        modules: false
                    }]
                ]
            })
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