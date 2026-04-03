document.addEventListener('DOMContentLoaded', function() {
  // Panel izquierdo toggle
  const leftPanel = document.querySelector('.left-panel');
  const toggleBtn = document.querySelector('.toggle-btn');
  const navList = document.querySelector('.nav-list');

  toggleBtn.addEventListener('click', function() {
    leftPanel.classList.toggle('collapsed');
  });

  // Panel derecho navegación
  const navButtons = document.querySelectorAll('.nav-list button');
  const rightPanels = document.querySelectorAll('.right-panel > div');

  function showPanel(panelId) {
    rightPanels.forEach(div => {
      div.classList.remove('active');
    });
    const target = document.getElementById(panelId);
    if (target) target.classList.add('active');
    navButtons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = Array.from(navButtons).find(btn => btn.dataset.target === panelId);
    if (activeBtn) activeBtn.classList.add('active');
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      showPanel(btn.dataset.target);
    });
  });

  // Mostrar por defecto "quienes somos"
  showPanel('panel-quienes');
});
