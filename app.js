const panels = {
  profile: { title: '车主档案', content: '<p>用户名 TBD</p><p>专属座驾：RANGE ROVER 揽胜<br>驾驶证编号：LR202611051234</p>' },
  points: { title: '我的积分', content: '<span class="detail-value">20,000</span><p>探索积分</p><p>这里将展示积分明细与车主权益。</p>' },
  medals: { title: '我的勋章', content: '<span class="detail-value">0</span><p>每一段探索，都值得记录。<br>您的驾驶成就将在这里点亮。</p>' },
  ranking: { title: '辅助驾驶排行榜', content: '<span class="detail-value">999+</span><p>本市排名 · 示例数据</p><p>这里将展示同城排名及个人驾驶数据。</p>' },
  map: { title: '我的探索足迹', content: '<p>已点亮 4 座城市</p><div class="city-list"><span>● 上海</span><span>● 杭州</span><span>● 宁波</span><span>● 温州</span></div>' },
  mileage: { title: '辅助驾驶总里程', content: '<span class="detail-value">418 <small>km</small></span><p>约为卡门线高度的 4.18 倍</p><p>每一程，探索新境。后续将在这里接入累计驾驶数据与使用报告。</p>' },
  help: { title: '关于驾驶档案', content: '<p>这是路虎风格 AI 辅助驾驶证的响应式设计原型，支持手机、平板与电脑。</p><p>当前使用示例数据，尚未连接真实车主信息或数据库。</p>' }
};
const dialog = document.querySelector('#details');
function openPanel(key) {
  const panel = panels[key];
  if (!panel) return;
  document.querySelector('#dialog-title').textContent = panel.title;
  document.querySelector('#dialog-content').innerHTML = panel.content;
  dialog.setAttribute('aria-labelledby', 'dialog-title');
  dialog.showModal();
}
document.querySelectorAll('[data-panel]').forEach(button => button.addEventListener('click', () => openPanel(button.dataset.panel)));
document.querySelector('#help').addEventListener('click', () => openPanel('help'));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
