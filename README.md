# 统一账号管理前端
## 用于管理基于iRedMail+OpenLDAP，以及其它系统的统一账号管理


# 运行环境
## 1. NPM环境变量
**VUE_APP_API_HOST**

后端RESTful API的地址跟端口(http://IP:Port)

**VUE_APP_API_PATH**
后端RESTful API路径(api_v1)

### 2. 后端RESTful API版本
```
3.4.0
```
### 3. NodeJS跟NPM版本（验证版本）
```
node: v12.14.0
npm: 6.13.4
```

# 开发跟部署
## 安装
```
npm install
```

## 开发模式（热加载）
可根据需要增加相应的.env.xxx文件, 修改package.json来增加自己的开发环境.
```
npm run serve
npm run home
```

## 打包生产环境
```
npm run build
```

# 容器化
## 打包容器
```
docker build -t ld4pman-web .
```

## 通过docker-compose打包并部署
需要修改docker-compose.yml对应配置
```
docker-compose up --build -d
```


