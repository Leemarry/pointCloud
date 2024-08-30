'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const name = defaultSettings.title || '播' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9551 // dev port
const theme = 'default';
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
    publicPath: './', //公共路径
    outputDir: 'dist', //生产输出目录
    assetsDir: 'static', //静态资产
    lintOnSave: process.env.NODE_ENV === 'development', // 生产构建期间禁用
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        disableHostCheck: true,
        allowedHosts: [
            'http://3w5y776698.zicp.vip', // 允许访问的域名地址，即花生壳内网穿透的地址
            '3577t66l98.vicp.fun' // .是二级域名的通配符
        ],
        // https: true, // 开启https
        // before: require('./mock/mock-server.js')
        // 通过代理访问后台 npm cache clean --force
        proxy: {
            // resourceminio/photo/uav/1ZNBJ5F00C008L/image/20240116/dji16515225_20240116165136.JPG
            // http://8.134.196.47:9000/efuav/photo/uav/1ZNBJ5F00C008L/image/20240116/dji16252953_20240116154426.JPG

            //重写代理
            // '/resourceminio': {
            //   target: 'http://8.148.10.90:9000',
            //   changeOrigin: true,
            //   // logLevel: 'debug',
            //   pathRewrite: {
            //     '^/resourceminio': '/efuav',
            //   },
            // },

            '/resourceminio': {
                target: process.env.HOST_URL,
                changeOrigin: true,
                logLevel: 'debug',
                pathRewrite: {
                    '^/resourceminio': '/efapi/pointcloud/resourceminio'
                }
            },
            // mapsource/satellite/{z}/{x}/{y}.jpg
            // http://127.0.0.1:456/static/satellite/{z}/{x}/{y}.jpg
            '/mapsource': {
                target: 'http://localhost:456',
                changeOrigin: true,
                pathRewrite: {
                    '^/mapsource': '/mapsource'
                }

            },
            'miniosource': {
                target: 'http://127.0.0.1:9090', // 'http://localhost:9090',
                changeOrigin: true,
                logLevel: 'debug',
                pathRewrite: {
                    '^/miniosource': ''
                },
                onProxyRes(proxyRes, req, res) {
                    const realUrl = 'http://localhost:9090' + req.url || ''; // 真实请求网址
                    console.log(realUrl); // 在终端显示
                    proxyRes.headers['A-Real-Url'] = realUrl; // 添加响应标头(A-Real-Url为自定义命名)，在浏览器中显示
                }
            },
            // miniosource
            /**代理查询天气  */
            '/queryWeather': {
                target: 'https://api.seniverse.com',
                changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
                // logLevel: 'debug', // 打印代理日志
                pathRewrite: {
                    '^/efapi/pointcloud/uav/queryWeather': '/v3/weather/now.json' // 重写url
                }
                // "https://api.seniverse.com/v3/weather/now.json?key=STZM3wOV_mjH8QsjJ&location=上海&language=zh-Hans&unit=c"
            },
            //http://vjs.zencdn.net/v/oceans.mp4
            // '/otherDownload': {
            //     target: 'http://vjs.zencdn.net',
            //     changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
            //     logLevel: 'debug', // 打印代理日志
            //     pathRewrite: {
            //         '^/efapi/pointcloud/media/otherDownload': '/v/oceans.mp4' // 重写url
            //     },
            //     onProxyRes(proxyRes, req, res) {
            //         const realUrl = 'http://vjs.zencdn.net' + req.url || ''; // 真实请求网址
            //         console.log(realUrl); // 在终端显示
            //         proxyRes.headers['A-Real-Url'] = realUrl; // 添加响应标头(A-Real-Url为自定义命名)，在浏览器中显示
            //     }
            // },
            '/otherDownload': {
                target: 'http://114.132.62.199:9000',
                changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
                logLevel: 'debug', // 打印代理日志
                pathRewrite: {
                    '^/efapi/pointcloud/media/otherDownload': '' // 重写url
                },
                // 代理  /pointcloud/web/test/ou4t/web.html 到 http://8.148.10.90:9000/test/ou4t/web.html
                onProxyRes(proxyRes, req, res) {
                    const realUrl = 'https://front-gateway.mtime.com' + req.url || ''; // 真实请求网址
                    console.log(realUrl); // 在终端显示
                    proxyRes.headers['A-Real-Url'] = realUrl; // 添加响应标头(A-Real-Url为自定义命名)，在浏览器中显示
                }
            },
            '/pointcloud/web': {
                target: 'http://8.148.10.90:9000',
                changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
                logLevel: 'debug', // 打印代理日志
                pathRewrite: {
                    '^/pointcloud/web': '' // 重写url
                },
                onProxyReq: function(proxyReq, req, res) {
                    console.log('proxyReq', proxyReq);
                    console.log('req', req);
                    console.log('res', res);
                    // const realUrl = proxyRes.req.path; // 'http://vjs.zencdn.net' + req.url || ''; // 真实请求网址
                    // proxyRes.headers['A-Real-Url'] = realUrl; // 添加响应标头(A-Real-Url为自定义命名)，在浏览器中显示
                }
                //          onProxyRes(proxyRes, req, res) {
                //     const realUrl = proxyRes.req.path; // 'http://vjs.zencdn.net' + req.url || ''; // 真实请求网址
                //     console.log(realUrl); // 在终端显示
                //     proxyRes.headers['A-Real-Url'] = realUrl; // 添加响应标头(A-Real-Url为自定义命名)，在浏览器中显示
                // }
            },

            [process.env.VUE_APP_BASE_API]: {
                target: process.env.HOST_URL,
                changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
                logLevel: 'debug', // 打印代理日志
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: '' // 重写url
                },
                onProxyRes(proxyRes, req, res) {
                    const realUrl = process.env.HOST_URL + req.url || ''; // 真实请求网址
                    console.log(realUrl); // 在终端显示
                    proxyRes.headers['A-Real-Url'] = realUrl; // 添加响应标头(A-Real-Url为自定义命名)，在浏览器中显示
                }
            },
            '/geoserver': {
                target: 'http://localhost:8080', //实际请求地址
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/geoserver/, 'geoserver') //http://localhost:8091/api
            },
            //resource this.$imgUrl  http://1.14.109.186/  process.env.HOST_URL
            '/resource': {
                target: process.env.HOST_URL,
                changeOrigin: true,
                logLevel: 'debug',
                pathRewrite: {
                    '^/resource': '/efapi/pointcloud/resource'
                }
            },
            '/efuavword': {
                target: process.env.HOST_URL,
                changeOrigin: true,
                logLevel: 'debug',
                pathRewrite: {
                    '^/efuavword': 'http://www.efuav.vip:29000/efuavword'
                }
            },
            '/websocketapi': {
                target: process.env.HOST_URL.replace('http', 'ws').replace('https', 'ws') + 'efapi/pointcloud/websocket',
                ws: true, // 开启ws, 如果是http代理此处可以不用设置
                changeOrigin: true,
                logLevel: 'debug',
                pathRewrite: {
                    '^/websocketapi': '/'
                }
            },
            '/sse': {
                target: process.env.HOST_URL + '/efapi/pointcloud/sse',
                changeOrigin: true,
                logLevel: 'debug',
                pathRewrite: {
                    '^/sse': '/'
                }
            }
        }
    },
    configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        // // 配置后只有加载 以 .worker.js 结尾的 文件才有效，parallel: false 是解决打包文件时报错问题的。 npm cache clean --force --mode development
        module: {
            rules: [
                {
                    test: /\.worker.js$/,
                    use: {
                        loader: 'worker-loader',
                        options: {
                            inline: 'no-fallback'
                            // inline: "fallback",
                        }
                    }
                }

            ]
        }
    //
    },
    chainWebpack(config) {
        config.module
            .rule('worker-loader')
            .test(/\.worker\.js$/)
            .use('worker-loader')
            .loader('worker-loader')
            .options({
                inline: 'no-fallback'
                //   inline: "fallback"
            });
        //   config.module.rule("js").exclude.add(/\.worker\.js$/);

        // it can improve the speed of the first screen, it is recommended to turn on preload
        config.plugin('preload').tap(() => [{
            rel: 'preload',
            // to ignore runtime.js
            // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
            fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
            include: 'initial'
        }])

        // when there are many pages, it will cause too many meaningless requests
        config.plugins.delete('prefetch')

        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        config
            .when(process.env.NODE_ENV !== 'development',
                config => {
                    config
                        .plugin('ScriptExtHtmlWebpackPlugin')
                        .after('html')
                        .use('script-ext-html-webpack-plugin', [{
                            // `runtime` must same as runtimeChunk name. default is `runtime`
                            inline: /runtime\..*\.js$/
                        }])
                        .end()
                    config
                        .optimization.splitChunks({
                            chunks: 'all',
                            maxInitialRequests: Infinity, // 最大并行请求数，为了以防万一，设置无穷大即可
                            minSize: 20000, // 引入的模块大于20kb才做代码分割，官方默认20000，这里不用修改了
                            maxSize: 60000, // 若引入的模块大于60kb，则告诉webpack尝试再进行拆分
                            cacheGroups: {
                                vendors: {
                                    test: /[\\/]node_modules[\\/]/, // 使用正则匹配node_modules中引入的模块
                                    priority: -10, // 优先级值越大优先级越高，默认-10，不用修改
                                    name(module) { // 设定分包以后的文件模块名字，按照包名字替换拼接一下
                                        if (!module.context) {
                                            console.error('Module context is undefined or null:', module);
                                            return 'fallbackName'; // 或者抛出错误
                                        }
                                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                                        return `npm.${packageName.replace('@', '')}`;
                                    }
                                }
                            }
                            // cacheGroups: {
                            //     libs: {
                            //         name: 'chunk-libs',
                            //         test: /[\\/]node_modules[\\/]/,
                            //         priority: 10,
                            //         chunks: 'initial' // only package third parties that are initially dependent
                            //     },
                            //     elementUI: {
                            //         name: 'chunk-elementUI', // split elementUI into a single package
                            //         priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                            //         test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                            //     },
                            //     commons: {
                            //         name: 'chunk-commons',
                            //         test: resolve('src/components'), // can customize your rules
                            //         minChunks: 3, //  minimum common number
                            //         priority: 5,
                            //         reuseExistingChunk: true
                            //     }
                            // }
                        })
                    // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
                    config.optimization.runtimeChunk('single')
                }
            )
    }
}
