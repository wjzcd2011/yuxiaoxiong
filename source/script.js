// 更新时钟，翻页效果
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    flipDigit('hours', hours);
    flipDigit('minutes', minutes);
    flipDigit('seconds', seconds);
}

function flipDigit(id, value) {
    const digit = document.getElementById(id);
    const top = digit.querySelector('.top');
    const bottom = digit.querySelector('.bottom');
    const flipper = digit.querySelector('.flipper');

    if (top.textContent !== value) {
        flipper.textContent = value;
        digit.classList.add('flip');
        setTimeout(() => {
            top.textContent = value;
            bottom.textContent = value;
            digit.classList.remove('flip');
        }, 500);
    }
}

// 获取当前是第几周
function getWeekNumber(d) {
    const date = new Date(d.getFullYear(), 0, 1);
    const dayMs = 24 * 60 * 60 * 1000;
    return Math.ceil((((d - date) / dayMs) + date.getDay() + 1) / 7);
}

// 获取农历日期，并分行显示年份（含干支纪年）和月份、日期
function getLunarDate() {
    const now = new Date();
    const lunar = Lunar.fromDate(now);
    const lunarYear = lunar.getYearInGanZhi() + '年'; //（' + lunar.getYearInChinese() + '）
    const lunarDate = lunar.getMonthInChinese() + '月 ' + lunar.getDayInChinese() + '日';
    
    return { year: lunarYear, date: lunarDate };
}

// 更新日期信息
function updateDateInfo() {
    const now = new Date();
    const currentDay = now.getDate();

    document.getElementById('current-date').textContent = currentDay;
    document.getElementById('week-number').textContent = `第${getWeekNumber(now)}周`;

    const lunarInfo = getLunarDate();
    document.getElementById('lunar-year').textContent = lunarInfo.year;
    document.getElementById('lunar-date').textContent = lunarInfo.date;
}

// 获取某个月的天数
function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

// 绘制日历
function generateCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const daysContainer = document.getElementById('calendar');
    daysContainer.innerHTML = ''; // 清空之前的内容

    const totalDays = daysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 获取当月1号是星期几
    const adjustedFirstDay = (firstDayOfMonth === 0) ? 7 : firstDayOfMonth; // 将星期天调整为7，以便与数组对齐

    // 补充空白天数（为日历对齐）
    for (let i = 1; i < adjustedFirstDay; i++) {
        const emptyCell = document.createElement('div');
        daysContainer.appendChild(emptyCell);
    }

    // 添加每一天
    for (let day = 1; day <= totalDays; day++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        if (day === today) {
            dayElement.classList.add('current-day');
        }
        daysContainer.appendChild(dayElement);
    }
}

// 初始化函数
function init() {
    updateDateInfo();
    generateCalendar();
    updateClock();
    setInterval(updateClock, 1000); // 每秒更新时钟
}

// 运行初始化函数
init();
