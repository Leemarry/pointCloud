#标准的nginx镜像,我们需要基于标准的nginx镜像制作自己的镜像，表示该镜像是基于 nginx:latest 镜像构建的
FROM nginx:latest

#表示将项目根目录下 dist 文件夹下的所有文件复制到镜像中 的/usr/share/nginx/html/ 目录下,在nginx的default.conf配置文件中也可看到相关路径配置：root。
COPY dist/  /usr/share/nginx/html/

#拷贝.conf文件到镜像下，替换掉原有的nginx.conf
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/efuavpages.conf /etc/nginx/efuavpages.conf

#输出完成
RUN echo 'build img ok!' 