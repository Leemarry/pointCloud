     // handlePreview(file) {
        //     var xmlString = null;
        //     JSZip.loadAsync(file.raw)
        //         .then(function (zip) {
        //             // 遍历ZIP文件中的条目  
        //             Object.keys(zip.files).forEach(function (filename) {
        //                 // console.log(zip.files,filename);
        //                 if (filename.indexOf('.wpml') > -1) {
        //                     zip.files[filename].async('text').then(function (content) {
        //                         // console.log(filename + ':' + content);  
        //                         xmlString = content;
        //                         if (!xmlString) return;
        //                         const points = parseXML(xmlString)

        //                     });
        //                 }

        //             });
        //         })
        //         .catch(function (err) {
        //             console.error('Error reading zip:', err);
        //         });


        // },
   //      async getFileContent(url) {
   //       try {
   //           const response = await fetch(url);
   //           console.log('response', response);
   //           if (response.ok) {
   //               const contentType = response.headers.get('content-type');
   //               console.log('请求成功', contentType);
   //               let content;
   //               if (contentType.includes('application/json')) {
   //                   content = await response.json();
   //               } else if (contentType.includes('text/plain')) {
   //                   content = await response.text();
   //               } else if (contentType.includes('application/xml')) {
   //                   // 解析 XML 的逻辑
   //               }
   //               content = response.blob;
   //               // 处理获取到的内容
   //               console.log(content);
   //           } else {
   //               console.error(`请求失败，状态码: ${response.status}`);
   //           }
   //       } catch (error) {
   //           console.error('发生错误:', error);
   //       }
   //   },