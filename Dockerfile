# 使用基础的Node.js镜像
FROM node:21.1.0

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json文件到工作目录
COPY package*.json ./
COPY *.lock ./

# 安装项目依赖
RUN yarn

# 复制项目文件到工作目录
COPY . .

# 构建项目
ENV NODE_ENV production
RUN yarn build

# 暴露React应用程序的默认端口
EXPOSE 3000
EXPOSE 1323

# 启动应用程序
CMD ["yarn", "start"]
