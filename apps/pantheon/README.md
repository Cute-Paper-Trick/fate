# 鉴权

## 中间件负责：

路由级别保护（页面访问控制）
服务端重定向
API 路由保护
初始访问控制

## 客户端负责

UI 状态管理（显示/隐藏组件） 登录登出和用户信息显示
用户体验优化（loading 状态、错误处理）
实时状态同步
条件渲染，比如导航组件 只有管理员能看到管理链接

## 总结

中间件处理安全关键的访问控制
客户端处理用户体验和 UI 状态
保持了清晰的职责边界

# 目录结构

src/features 可复用的功能

- <module> 功能模块
  - <feature> 模块下的功能
    - index.tsx 模块入口
    - <component>.tsx 组件文件

src/app

- [variants] 动态路由
  - (main) 主布局
    - layout.tsx 布局文件 只用来进行多端布局的切换
    - \_layout
      - Desktop 桌面布局组件
      - MobileL 移动布局组件
    - features 功能模块 页面的功能模块，和 src/features 的区别是，这里是页面特化的功能组合

# check

- [x] publicRoutes protectedRoutes AdminRoutes
- [ ] login redirect
- [ ] logout redirect
- [ ] navigate
- [ ] i18n
- [ ] session management

test commit
