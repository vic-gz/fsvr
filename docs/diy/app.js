(() => {
  const isChinese = document.documentElement.lang.toLowerCase().startsWith('zh');
  const tabRoot = document.querySelector('[data-tabs]');
  if (tabRoot) {
    const buttons = [...tabRoot.querySelectorAll('[data-tab]')];
    const panels = [...tabRoot.querySelectorAll('[data-panel]')];
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const selected = button.dataset.tab;
        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-selected', String(active));
        });
        panels.forEach((panel) => {
          const active = panel.dataset.panel === selected;
          panel.classList.toggle('is-active', active);
          panel.hidden = !active;
        });
      });
    });
  }

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const code = button.parentElement?.querySelector('code')?.textContent?.trim();
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code);
        const original = button.textContent;
        button.textContent = isChinese ? '已复制' : 'Copied';
        window.setTimeout(() => { button.textContent = original; }, 1500);
      } catch {
        button.textContent = isChinese ? '请手动复制' : 'Copy manually';
      }
    });
  });

  const tocLinks = [...document.querySelectorAll('.toc a[href^="#"]')];
  const sections = tocLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      tocLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
      });
    }, { rootMargin: '-15% 0px -70% 0px', threshold: [0, 0.25, 0.6] });
    sections.forEach((section) => observer.observe(section));
  }
})();
