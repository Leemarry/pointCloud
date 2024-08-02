/*
 * @Date: 2024-07-19 16:58:14
 * @LastEditors: likai 2806699104@qq.com
 * @FilePath: \pointCouldPages\src\views\routeManage\kmzManage\op.js
 * @Description: Do not edit
 */
// axios({
//     url: 'efapi/pointcloud/route/updateGoods',
//     method: 'post',
//     //忽略contentType
//     contentType: false,
//     //取消序列换 formData本来就是序列化好的
//     processData: false,
//     headers: {
//         'Content-Type': 'multipart/form-data',
//         'token': getToken()
//     },
//     dataType: 'json',
//     data: formData,
//     success: function(res) {
//         if (res > 0) {
//             alert('修改成功！');
//         } else {
//             alert('修改失败，请联系系统管理员!');
//         }
//     }
// });


// async parseFileToXml(file) {
//     const kmzname = file.name;
//     let efTaskKmz = {}
//     try {
//         // eslint-disable-next-line no-undef
//         const zip = await JSZip.loadAsync(file.raw);
//         const wpmlFile = zip.file('wpml.xml');
//         // for (const filename of Object.keys(zip.files)) {
//         //     if (filename.indexOf('.wpml') > -1) {
//         //         const xmlString = await zip.files[filename].async('text');
//         //         if (!xmlString) return;
//         //         efTaskKmz = parseXML(xmlString);
//         //         this.efTaskKmzMap.set(kmzname, efTaskKmz)
//         //         this.points = efTaskKmz.points;
//         //     }
//         // }
//     } catch (err) {
//         console.error('Error reading zip:', err);
//         this.points = []
//     } finally {
//         // eslint-disable-next-line no-unsafe-finally
//         return efTaskKmz;
//     }
// },


            //发送ajax请求
            // axios({
            //     url: 'efapi/pointcloud/route/updateGoods',
            //     method: 'post',
            //     //忽略contentType
            //     contentType: false,
            //     //取消序列换 formData本来就是序列化好的
            //     processData: false,
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //         'token': getToken()
            //     },
            //     dataType: 'json',
            //     data: formData,
            //     success: function(res) {
            //         if (res > 0) {
            //             alert('修改成功！');
            //         } else {
            //             alert('修改失败，请联系系统管理员!');
            //         }
            //     }
            // });


                  // async submitUpload(files) {
        //     const formData = new FormData();
        //     const efTaskKmzs = [];
        //     // 遍历文件数组
        //     files.forEach(async(file, index) => {
        //         const filename = file.name;
        //         let kmzInfo = {}
        //         // 判断 文件名是否在 this.efTaskKmzMap  中 在取出
        //         if (this.efTaskKmzMap.has(filename)) {
        //             kmzInfo = this.efTaskKmzMap.get(filename);
        //         } else {
        //             this.parseFileToXml(file).then(res => {
        //                 this.efTaskKmzMap.set(filename, res)
        //                 kmzInfo = res;
        //             },
        //             reject => {
        //                 // 请勿上传错误文件!
        //                 this.showMessage(`${filename}文件有误,已取消上传!`, 'warning')
        //                 this.fileList = this.fileList.filter(item => item.name !== filename)
        //             }
        //             )
        //         }
        //         formData.append(`files`, file);
        //         efTaskKmzs.push(kmzInfo)
        //     });
        //     // 将对象数组转换为JSON字符串
        //     var efTaskKmzsStr = JSON.stringify(efTaskKmzs);
        //     formData.append('efTaskKmzs', new Blob([efTaskKmzsStr], { type: 'application/json' }));
        //     this.$store.dispatch('routeManage/uploadKmz', formData).then(res => {
        //         this.showToast('上传成功')
        //         // this.queryKmzlist()
        //     }, rej => {
        //         this.showToast('上传失败')
        //     })
        // },