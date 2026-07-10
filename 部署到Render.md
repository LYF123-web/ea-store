# 部署到 Render 免费服务器

## 步骤一：安装 Git 并推送代码到 GitHub

### 1. 初始化 Git 仓库
```powershell
cd C:\Users\13307\Desktop\vscode\MT5\mt5
git init
git add .
git commit -m "EA Store 初始化"
```

### 2. 在 GitHub 创建仓库
1. 打开 https://github.com/new
2. 仓库名：`ea-store`
3. 点击 Create repository
4. 复制仓库地址如：`https://github.com/你的用户名/ea-store.git`

### 3. 推送代码
```powershell
git remote add origin https://github.com/你的用户名/ea-store.git
git branch -M main
git push -u origin main
```

## 步骤二：在 Render 部署

### 1. 注册 Render 账号
1. 打开 https://render.com
2. 点击 Get Started for Free
3. 用 GitHub 账号登录

### 2. 创建 Web Service
1. 点击 New + → Web Service
2. 选择你的 `ea-store` 仓库
3. 点击 Connect

### 3. 配置部署设置
- **Name**: `ea-store`
- **Runtime**: `Node`
- **Build Command**: 
  ```
  npm install && cd server && npm install && npm run build
  ```
- **Start Command**: 
  ```
  cd server && node index.js
  ```

### 4. 添加环境变量（可选）
- `NODE_ENV` = `production`

### 5. 点击 Create Web Service

## 步骤三：配置支付宝回调地址

部署成功后，你会得到一个域名如：`https://ea-store.onrender.com`

1. 打开支付宝开放平台
2. 进入应用 → 开发设置
3. 修改：
   - 授权回调地址：`https://ea-store.onrender.com/pay-result`
   - 应用网关：`https://ea-store.onrender.com`

## 步骤四：更新代码中的域名

在本地修改 `server/config.js`：
```javascript
notifyUrl: 'https://ea-store.onrender.com/api/alipay/notify',
returnUrl: 'https://ea-store.onrender.com/pay-result',
```

然后推送更新：
```powershell
git add .
git commit -m "更新回调地址"
git push
```

## 完成！

- 访问地址：`https://ea-store.onrender.com`
- 支付宝支付回调会自动工作
- 免费额度：每月750小时运行时间

## 注意事项

1. **首次部署会比较慢**（约5-10分钟）
2. **免费版会休眠**：15分钟无访问会休眠，再次访问会自动唤醒
3. **国内访问较慢**：Render服务器在国外
