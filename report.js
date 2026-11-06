// Deterministic demo data. All summary values and insights derive from the daily records.
const endDate = new Date(Date.UTC(2026, 10, 4));
const samples = Array.from({ length: 60 }, (_, index) => {
  const date = new Date(endDate);
  date.setUTCDate(date.getUTCDate() - 59 + index);
  const day = date.toISOString().slice(0, 10);
  const mileage = ({ 4: 8.4, 9: 3.2, 16: 11.6, 23: 5.5, 29: 2.8, 37: 19, 46: 2.1, 59: 1.7 })[index] || 0;
  const parking = ({ 3: 1, 9: 2, 17: 1, 24: 2, 35: 2, 39: 1, 43: 1, 47: 2, 53: 3, 56: 1, 59: 2 })[index] || 0;
  const totalMileage = mileage ? (index === 37 ? mileage / 0.21 : mileage * 8) : 0;
  return { date: day, mileage, parking, ratio: totalMileage ? mileage / totalMileage * 100 : 0 };
});
const formatDate = day => day.replaceAll('-', '.');
const shortDate = day => day.slice(5).replace('-', '.');
const chineseDate = day => `${Number(day.slice(5, 7))}月${Number(day.slice(8))}日`;
const configs = [
  { key: 'mileage', unit: 'km', label: '辅助驾驶里程', format: value => value.toFixed(1) },
  { key: 'ratio', unit: '%', label: '辅助驾驶里程占比', format: value => Number(value.toFixed(1)).toString() },
  { key: 'parking', unit: '次', label: '辅助泊入次数', format: value => String(value) }
];
function renderChart(card, data, config, chartIndex) {
  const values = data.map(row => row[config.key]);
  const max = Math.max(...values);
  const ceiling = config.key === 'parking' ? Math.max(4, max + 1) : Math.max(4, Math.ceil(max / 4) * 4);
  const peakIndex = values.indexOf(max);
  const x = i => i / (data.length - 1) * 900;
  const y = value => 165 - value / ceiling * 155;
  const points = values.map((value, i) => `${x(i)},${y(value)}`);
  const chart = card.querySelector('.chart');
  chart.removeAttribute('role');
  chart.setAttribute('aria-label', `${config.label}，${data.length}天，单日峰值${config.format(max)}${config.unit}`);
  card.querySelector('.section-heading b').textContent = `${config.format(max)} ${config.unit}`;
  chart.innerHTML = `<div class="ticks">${Array.from({ length: 5 }, (_, i) => `<span>${Number((ceiling * (4 - i) / 4).toFixed(1))}${config.key === 'ratio' ? '%' : ''}</span>`).join('')}</div><div class="plot"><svg viewBox="0 0 900 170" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="fill-${chartIndex}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#86a56b" stop-opacity=".35"/><stop offset="1" stop-color="#86a56b" stop-opacity=".02"/></linearGradient></defs><path fill="url(#fill-${chartIndex})" d="M0 170 L${points.join(' L')} L900 170Z"/><path class="line" d="M${points.join(' L')}"/><circle cx="${x(peakIndex)}" cy="${y(max)}" r="4"/></svg><div class="point-controls">${data.map((row, i) => `<button type="button" class="data-point" style="left:${i / (data.length - 1) * 100}%;top:${y(row[config.key]) / 170 * 100}%" aria-label="${row.date}，${config.label} ${config.format(row[config.key])}${config.unit}" data-index="${i}"></button>`).join('')}</div><output class="chart-tooltip" aria-live="polite"></output></div><div class="dates">${Array.from({ length: 6 }, (_, i) => `<span>${shortDate(data[Math.round(i * (data.length - 1) / 5)].date)}</span>`).join('')}</div>`;
  const tooltip = chart.querySelector('.chart-tooltip');
  const show = index => {
    const row = data[index];
    tooltip.textContent = `${shortDate(row.date)} · ${config.format(row[config.key])} ${config.unit}`;
    tooltip.style.left = `${Math.max(17, Math.min(83, index / (data.length - 1) * 100))}%`;
    tooltip.style.top = `${Math.max(0, y(row[config.key]) / 170 * 100 - 25)}%`;
  };
  chart.querySelectorAll('.data-point').forEach(button => {
    ['pointerenter', 'focus', 'click'].forEach(event => button.addEventListener(event, () => show(Number(button.dataset.index))));
  });
  show(peakIndex);
}
function renderReport(days) {
  const data = samples.slice(-days);
  const total = data.reduce((sum, row) => sum + row.mileage, 0);
  const parking = data.reduce((sum, row) => sum + row.parking, 0);
  const ratioPeak = Math.max(...data.map(row => row.ratio));
  const mileagePeak = data.reduce((peak, row) => row.mileage > peak.mileage ? row : peak);
  const ratioPeakRow = data.find(row => row.ratio === ratioPeak);
  const activeDays = data.filter(row => row.mileage > 0 || row.parking > 0).length;
  document.querySelectorAll('[data-days]').forEach(button => {
    const selected = Number(button.dataset.days) === days;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('.subtitle span').textContent = `· 近${days}天`;
  document.querySelector('.date').textContent = `${formatDate(data[0].date)} — ${formatDate(data.at(-1).date)}`;
  const metrics = document.querySelectorAll('.metric');
  metrics[0].querySelector('.value').innerHTML = `${total.toFixed(1)} <span>km</span>`;
  metrics[1].querySelector('.value').innerHTML = `${Number(ratioPeak.toFixed(1))} <span>%</span>`;
  metrics[1].querySelector('.caption').textContent = chineseDate(ratioPeakRow.date);
  metrics[2].querySelector('.value').innerHTML = `${parking} <span>次</span>`;
  document.querySelector('.ring strong').innerHTML = `${activeDays}<span>天</span>`;
  document.querySelector('.ring').style.background = `conic-gradient(#658158 0 ${activeDays / days * 100}%,#d9ddcc ${activeDays / days * 100}% 100%)`;
  document.querySelector('.activity>.caption').textContent = `使用天数 / ${days}天`;
  document.querySelectorAll('.chart-card').forEach((card, index) => renderChart(card, data, configs[index], index));
  const insights = document.querySelectorAll('.insight-grid p');
  insights[0].innerHTML = `<strong>${chineseDate(mileagePeak.date)}</strong><br>单日辅助驾驶里程达到 ${mileagePeak.mileage.toFixed(1)} km`;
  insights[1].innerHTML = `<strong>多次从容泊入</strong><br>本周期共记录${parking}次辅助泊入`;
  document.querySelector('#report-status').textContent = `已显示近${days}天报告 · 点击或聚焦图表数据点查看详情`;
}
document.querySelectorAll('[data-days]').forEach(button => button.addEventListener('click', () => renderReport(Number(button.dataset.days))));
renderReport(30);
