// Demo records only. Dates and routes do not represent actual vehicle telemetry.
const footprintCities = {
  hangzhou: { name: '杭州市', province: '浙江', date: '2026-10-20' },
  ningbo: { name: '宁波市', province: '浙江', date: '2026-09-18' },
  wenzhou: { name: '温州市', province: '浙江', date: '2026-08-12' },
  shanghai: { name: '上海市', province: '上海', date: '2026-03-14' }
};
const cityControls = document.querySelectorAll('[data-city]');
function selectCity(id) {
  const city = footprintCities[id];
  if (!city) return;
  cityControls.forEach(control => {
    const selected = control.dataset.city === id;
    control.classList.toggle('is-selected', selected);
    control.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#detail-city').textContent = `${city.name} · ${city.province}`;
  document.querySelector('#detail-date').textContent = `${city.date.replaceAll('-', '.')} 点亮 · 示例记录`;
}
cityControls.forEach(control => {
  const city = footprintCities[control.dataset.city];
  control.setAttribute('aria-label', `${city.name}，${city.date.replaceAll('-', '.')}点亮`);
  control.addEventListener('click', () => selectCity(control.dataset.city));
  // SVG groups need explicit keyboard activation; native buttons already provide it.
  if (control.tagName.toLowerCase() === 'g') {
    control.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectCity(control.dataset.city);
      }
    });
  }
});
selectCity('hangzhou');
