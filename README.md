# E-Ink Dashboard (墨水屏复古控制台)

一个专为电子墨水屏（E-Ink）设备量身打造的信息看板。

## 核心功能

- **翻页时钟**：采用全屏幕自适应 (`vmin`) 布局
- **天气**：接入 [Open-Meteo](https://open-meteo.com/) 免密钥 API，支持自动适配当地经纬度。
- **资讯**：
  - 默认接入「IT之家」科技资讯。
  - 带有设置弹窗，支持**自定义任意 RSS 订阅源**。
- **主题反色**：利用纯黑/纯白底色切换，配置自动保存在浏览器 `LocalStorage` 中，断电重启不丢失。
- **清屏机制**：针对墨水屏的物理特性，在标签页切换时引入了 **黑白交替全屏闪烁（Global Refresh）** 机制，清除残影。
**如果你需要修改天气的默认经纬度或接口刷新频率，请打开 js/app.js 修改顶部的全局配置项**

```javascript
const CONFIG = {
    LAT: 30.494791,     // 默认纬度 (示例：武汉)
    LON: 114.304569,    // 默认经度
    WEATHER_INTERVAL: 1000 * 60 * 60, // 天气刷新频率 (默认1小时)
    QUOTE_INTERVAL: 1000 * 60 * 30    // 一言刷新频率 (默认半小时)
};
```


**[Live Demo](https://kbsing.github.io/eink-dashboard/)**


*(初次访问建议允许浏览器获取位置信息，以便自动同步当地天气。)*

## 本地开发与部署

本项目为 100% 纯静态纯前端项目，**零依赖、无需构建工具（No Node.js, No Webpack）**，开箱即用。

1. **克隆项目**
   ```bash
   git clone [https://github.com/kbsing/eink-dashboard.git](https://github.com/kbsing/eink-dashboard.git)