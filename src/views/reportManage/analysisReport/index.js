//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等!）
//例如：import 《组件名称》 from '《组件路径》';
import { reportOptions, pickerOptions } from "@/utils/export.js";
export default {
    name: "",
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        const tableData = [];
        const fileTypes = ["Text", "Image", "Video", "Audio", "Document"];
        const dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };

        for (let i = 1; i <= 200; i++) {
            const randomDate = new Date(
                Math.random() *
                (new Date().getTime() - new Date("2023-01-01").getTime()) +
                new Date("2023-01-01").getTime()
            ).toLocaleDateString(undefined, dateOptions);
            const fileName = `file_${i}.${["txt", "jpg", "p4", "p3", "pdf"][Math.floor(Math.random() * 5)]
                }`;
            const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
            const fileSize = `${Math.floor(Math.random() * 1000)} KB`;
            const fileUrl = `http://127.0.0.1:9090/ceshi/11.pdf`;

            tableData.push({
                date: randomDate,
                fileName,
                fileType,
                fileSize,
                fileUrl
            });
        }
        return {
            formInline: {
                type: 1,
                startTime: "",
                endTime: ""
            },
            tableData,
            //分页
            currentPage: 1,
            pageSize: 10,
            windows: {}, // 用于存储浏览器窗口对象的引用
            reportOptions,
            pickerOptions
        };
    },
    //让组件接收外部传来的数据
    props: {},
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        onSubmit() {
            console.log("submit!");
        },

        /**无刷新查看 */
        // handleClick(row) {
        //     const windowName = "windowName-" + row.fileName;
        //     if(!this.windows[windowName] || this.windows[windowName].closed){
        //         // console.log('创建新窗口');
        //        const  existingWindow = window.open(row.fileUrl, windowName);
        //        this.windows[windowName] = existingWindow;
        //     }else{
        //         // console.log('窗口已存在');
        //         this.windows[windowName].focus(); // 窗口已经打开，则聚焦
        //     }
        //     console.log('this.windows',this.windows);

        // },

        handleClick(row) {
            const windowName = 'windowName-' + row.fileName;
            if (!this.windows[windowName] || this.windows[windowName].closed) {
                // 创建新窗口
                const existingWindow = window.open('', windowName);
                const queryString = `?id=${row.id}&src=${encodeURIComponent(
                    row.fileUrl
                )}&data=${encodeURIComponent(JSON.stringify(row))}`;
                existingWindow.location.href = '/preview' + queryString;
                this.windows[windowName] = existingWindow;
                // // 为新窗口添加 message 事件监听器
                // existingWindow.addEventListener('message', handleMessage);
            } else {
                this.windows[windowName].focus();
            }
        },

        handleMessage(event) {
            // 在这里处理接收到的消息
            if (event.data === "窗口关闭") {
                // 执行相应的操作，例如显示提示信息等
                console.log("收到父窗口的消息：窗口关闭");
            }
        },

        downloadFile(row, index) {
            console.log("下载文件", row.fileUrl, index);
            // this.handleFetchClick()
            this.download(row.fileUrl);
            // var element = document.createElement('a');
            // element.setAttribute('href', row.fileUrl);
            // element.setAttribute('download', 'filename');
            // element.style.display = 'none';
            // document.body.appendChild(element);
            // element.click();
            // document.body.removeChild(element);
            // URL.revokeObjectURL(blobUrl)
        },
        download(url) {
            fetch(url, {
                responseType: "blob" //重要代码
            })
                .then(res => {
                    const contentType = res.headers["content-type"] || "application/pdf";
                    let filename = "使用说明文档.pdf"; // 默认文件名
                    // 根据content-type进行判断
                    if (contentType.includes("application/pdf")) {
                        filename = "使用说明文档.pdf";
                    } else if (contentType.includes("image/jpeg")) {
                        filename = "图片.jpg";
                    } else if (contentType.includes("image/png")) {
                        filename = "图片.png";
                    } else {
                        filename = Date.now() + ".unknown";
                    }
                    if (res.status == 200) {
                        // 返回的.blob()为promise，然后生成了blob对象，此方法获得的blob对象包含了数据类型，十分方便
                        console.log("response", res);
                        // var contentType = res.headers.get('content-type');
                        return res.blob();
                    }
                })
                .then(blob => {
                    console.log("blobUrl", blob);

                    var element = document.createElement("a");
                    const blobUrl = URL.createObjectURL(blob);
                    element.setAttribute("href", blobUrl);
                    element.setAttribute("download", "filename");
                    element.style.display = "none";
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                    URL.revokeObjectURL(blobUrl);
                })
                .catch(error => console.log(error));
        },
        handleFetchClick(signal = 1) {
            var url = "http://127.0.0.1:9090/ceshi/14.jpg"; //http://127.0.0.1:9090/ceshi/14.jpg PvReport.pdf
            console.log("signal", signal);
            fetch(url, {})
                .then(response => {
                    if (response.status == 200) {
                        // 返回的.blob()为promise，然后生成了blob对象，此方法获得的blob对象包含了数据类型，十分方便
                        console.log("response", response);
                        var contentType = response.headers.get("content-type");
                        console.log(contentType);
                        return response.blob();
                    }
                })
                .then(blob => {
                    console.log("blobUrl", blob);

                    var element = document.createElement("a");
                    const blobUrl = URL.createObjectURL(blob);
                    element.setAttribute("href", blobUrl);
                    element.setAttribute("download", "filename");
                    element.style.display = "none";
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                    URL.revokeObjectURL(blobUrl);
                })
                .catch(error => {
                    console.warn(`Fetch 2 error: ${error.message}`);
                });

            // 等待 2 秒后取消请求
        },
        // #region ---------------------------------------------------  分页 ---------------------------------------------------
        //每页条数改变时触发 选择一页显示多少行
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.currentPage = 1;
            this.pageSize = val;
        },
        //当前页改变时触发 跳转其他页
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
        }

        // #endregion
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() { },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() { },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { } //如果页面有keep-alive缓存功能，这个函数会触发
};
