document.addEventListener('DOMContentLoaded', (event) => {
    const currentDate = new Date();
    const currentDateElement = document.getElementById('current-date');
    const currentWeekdayElement = document.getElementById('current-weekday');
    const currentWeekElement = document.getElementById('current-week');
    const lunarDateElement = document.getElementById('lunar-date');
    const datesListElement = document.getElementById('dates-list');

    // 获取当前日期
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // getMonth() 返回0-11，所以需要+1
    const year = currentDate.getFullYear();
    const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][currentDate.getDay()];

    // 获取年份的第几周
    const getWeekNumber = (date) => {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - startOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    };
    const weekNumber = getWeekNumber(currentDate);

    currentWeekElement.textContent = `第 ${weekNumber} 周`;
    currentWeekdayElement.textContent = weekday;
    currentDateElement.textContent = day;

    // 获取农历日期
    const lunar = Lunar.fromDate(currentDate);
    const lunarYear = lunar.getYearInChinese();
    const lunarMonth = lunar.getMonthInChinese();
    const lunarDay = lunar.getDayInChinese();
    const lunarYearGanZhi = lunar.getYearInGanZhi(); // 确保使用正确的API方法获取干支年份

    lunarDateElement.innerHTML = `农历 ${lunarYearGanZhi}年<br>${lunarMonth}${lunarDay}`;

    // 生成当月所有日期
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);
    const totalDays = endOfMonth.getDate();

    // 添加空白填充，使得1号对齐到正确的星期几
    const firstDayOfWeek = startOfMonth.getDay(); // 获取当月1号是星期几
    for (let i = 0; i < (firstDayOfWeek + 6) % 7; i++) {
        const emptyItem = document.createElement('div');
        emptyItem.classList.add('date-item', 'empty-item');
        datesListElement.appendChild(emptyItem);
    }

    for (let i = 1; i <= totalDays; i++) {
        const dateItem = document.createElement('div');
        dateItem.classList.add('date-item');
        dateItem.textContent = i;
        if (i === day) {
            dateItem.classList.add('current-day');
        }
        datesListElement.appendChild(dateItem);
    }
});
