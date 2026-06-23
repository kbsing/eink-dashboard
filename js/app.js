// ================= 全局配置 =================
const CONFIG = {
    LAT: 22.3193,   
    LON: 114.1694,  
    WEATHER_INTERVAL: 1000 * 60 * 60,
    QUOTE_INTERVAL: 1000 * 60 * 30
};
// ============================================

// 0. 主题切换与初始化记忆
function initTheme() {
    const savedTheme = localStorage.getItem('eink-theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
}

function toggleTheme() {
    const current = document.body.getAttribute('data-theme');
    if (current === 'dark') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('eink-theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('eink-theme', 'dark');
    }
}

// 1. 任务栏与页面切换
function switchPage(pageId, btnElement) {
    document.querySelectorAll('.task-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.add('active');

    if (pageId === 'news' && !window.newsLoaded) {
        fetchTechNews();
        window.newsLoaded = true;
    }
}

// 2. 时钟引擎
function initClock() {
    const elHour = document.getElementById('hour-box');
    const elMin = document.getElementById('minute-box');
    const elDate = document.getElementById('date');
    const elTray = document.getElementById('tray-time');
    const days = ['日', '一', '二', '三', '四', '五', '六'];

    function tick() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        
        if (elHour.innerText !== h) elHour.innerText = h;
        if (elMin.innerText !== m) elMin.innerText = m;
        
        const trayTime = `${h}:${m} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
        if (elTray.innerText !== trayTime) elTray.innerText = trayTime;

        const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${days[now.getDay()]}`;
        if (elDate.innerText !== dateStr) elDate.innerText = dateStr;
    }
    tick();
    setInterval(tick, 1000); 
}

// 3. 一言引擎
async function fetchQuote() {
    try {
        const res = await fetch('https://v1.hitokoto.cn?c=k&c=d&c=i');
        const data = await res.json();
        document.getElementById('hitokoto').innerText = `「 ${data.hitokoto} 」 —— ${data.from}`;
    } catch (e) {}
}

// ================= 极简纯黑白 SVG 图标库 =================
// stroke="currentColor" 会让图标颜色自动跟随文字颜色，完美适配黑白切换
const SVG_ICONS = {
    sunny: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    cloudy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>`,
    rain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path><line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line></svg>`,
    snow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="5.93" y1="5.93" x2="18.07" y2="18.07"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="18.07" y1="5.93" x2="5.93" y2="18.07"></line></svg>`,
    thunder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    fog: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="14" x2="20" y2="14"></line><line x1="4" y1="18" x2="20" y2="18"></line><line x1="4" y1="10" x2="20" y2="10"></line></svg>`,
    unknown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
};

function wmoToSVGData(code) {
    const map = {
        0: [SVG_ICONS.sunny, "晴朗"], 
        1: [SVG_ICONS.cloudy, "少云"], 2: [SVG_ICONS.cloudy, "多云"], 3: [SVG_ICONS.cloudy, "阴天"],
        45: [SVG_ICONS.fog, "大雾"], 48: [SVG_ICONS.fog, "雾凇"],
        51: [SVG_ICONS.rain, "微雨"], 53: [SVG_ICONS.rain, "小雨"], 55: [SVG_ICONS.rain, "中雨"],
        56: [SVG_ICONS.rain, "冻雨"], 57: [SVG_ICONS.rain, "冻雨"],
        61: [SVG_ICONS.rain, "小雨"], 63: [SVG_ICONS.rain, "中雨"], 65: [SVG_ICONS.rain, "大雨"],
        66: [SVG_ICONS.rain, "冻雨"], 67: [SVG_ICONS.rain, "冻雨"],
        71: [SVG_ICONS.snow, "小雪"], 73: [SVG_ICONS.snow, "中雪"], 75: [SVG_ICONS.snow, "大雪"],
        77: [SVG_ICONS.snow, "米雪"],
        // 之前缺失的阵雨和暴雨代码
        80: [SVG_ICONS.rain, "阵雨"], 81: [SVG_ICONS.rain, "强阵雨"], 82: [SVG_ICONS.rain, "暴雨"],
        85: [SVG_ICONS.snow, "阵雪"], 86: [SVG_ICONS.snow, "强阵雪"],
        // 之前缺失的极端雷暴代码
        95: [SVG_ICONS.thunder, "雷雨"], 96: [SVG_ICONS.thunder, "雷暴"], 99: [SVG_ICONS.thunder, "重雷暴"]
    };
    // 为了方便以后排错，如果遇到真没见过的代码，会在控制台打印出来
    if (!map[code]) console.warn("未识别的气象代码:", code);
    
    return map[code] || [SVG_ICONS.unknown, "未知"];
}
// 4. 天气引擎
async function fetchWeather() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${CONFIG.LAT}&longitude=${CONFIG.LON}&current_weather=true&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();
        
        const curTemp = Math.round(data.current_weather.temperature);
        const [curSvg, curText] = wmoToSVGData(data.current_weather.weathercode);
        
        // 分离注入 SVG 和文字
        document.getElementById('cw-icon').innerHTML = curSvg;
        document.getElementById('cw-text').innerText = `${curText} ${curTemp}°C`;

        const list = document.getElementById('forecast_list');
        list.innerHTML = '';
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        const dailyCodes = data.daily.weather_code || data.daily.weathercode;

        for (let i = 0; i < 4; i++) {
            const dateObj = new Date(data.daily.time[i]);
            const dayName = i === 0 ? "今天" : `周${days[dateObj.getDay()]}`;
            const maxT = Math.round(data.daily.temperature_2m_max[i]);
            const minT = Math.round(data.daily.temperature_2m_min[i]);
            const [iconSvg, _] = wmoToSVGData(dailyCodes[i]);

            list.innerHTML += `
                <div class="f-item">
                    <div><b>${dayName}</b></div>
                    <div class="f-icon">${iconSvg}</div>
                    <div>${minT}~${maxT}°C</div>
                </div>
            `;
        }
    } catch (e) {
        document.getElementById('cw-text').innerText = `[气象接口请求超时]`;
    }
}

// 5. 新闻引擎
async function fetchTechNews() {
    const listEl = document.getElementById('news-list');
    try {
        const rssUrl = encodeURIComponent('https://www.ithome.com/rss/');
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
        const json = await res.json();
        
        if (json.status === 'ok' && json.items) {
            listEl.innerHTML = '';
            const newsData = json.items.slice(0, 12);
            newsData.forEach(item => {
                listEl.innerHTML += `<li><a href="${item.link}" target="_blank">${item.title}</a></li>`;
            });
        } else {
            listEl.innerHTML = `<li>RSS 解析失败，请稍后再试。</li>`;
        }
    } catch (e) {
        listEl.innerHTML = `<li>[Network Error] 无法连接到新闻服务器，请检查网络。</li>`;
    }
}

// 启动入口
window.onload = function() {
    initTheme();
    initClock();
    fetchQuote();
    fetchWeather();
    setInterval(fetchQuote, CONFIG.QUOTE_INTERVAL);
    setInterval(fetchWeather, CONFIG.WEATHER_INTERVAL);
};  