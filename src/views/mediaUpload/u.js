/*
 * @FilePath: \pointCloud\src\views\mediaUpload\u.js
 * @Author: likai 2806699104@qq.com
 * @Version: 0.0.1
 * @LastEditors: likai 2806699104@qq.com
 * @Description:  
 */

    let items = []
    function unload(){
      const uploadDom = document.querySelector(".uploadDom")//获取dom
      uploadDom.ondragenter = function(e){
        e.preventDefault();//阻止默认拖拽事件
      }
      uploadDom.ondragover = function(e){
        e.preventDefault();
      }
      uploadDom.ondrop =  (e)=>{
        if(items.length!=0){
          items = []
        }
        e.preventDefault();
        let arr = []
        //有可能会出现e.dataTransfer.items为空的情况用arr.forEach.call解决，没有这个问题可以不用
         arr.forEach.call(e.dataTransfer.items,async function(file){ 
        
        //获取到一个 FileSystemFileEntry 对象或 FileSystemDirectoryEntry 对象。这两种都继承自 FileSystemEntry
          const entry = file.webkitGetAsEntry()
 
          await getReader(entry)
          // setTimeout(()=>{
          //   let formDate = new FormData()
          //   items
          //   //文件已经获取，上传文件代码
          // },1000)
        })
      }
    }
     function getReader(entry){
      //判断获取到的是否为文件
      if(entry.isDirectory){
        //创建一个目录读取器
        const reader = entry.createReader()
        //读取文件下的所有东西 异步的
        reader.readEntries( (entries)=>{
          for(let i = 0;i < entries.length;i++){
            //递归遍历所有文件
            getReader(entries[i])
          }
        })
      }else{
        //读取file文件，异步的
        entry.file((f)=>{
          items.push(f)
        })
      }
    }

