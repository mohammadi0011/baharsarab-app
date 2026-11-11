const tg = window.Telegram?.WebApp;

function applyAdaptiveTheme() {
  const isDark = tg?.colorScheme === 'dark' || 
    (!tg?.colorScheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    if (tg?.setHeaderColor) tg.setHeaderColor('#000000');
    if (tg?.setBackgroundColor) tg.setBackgroundColor('#000000');
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    if (tg?.setHeaderColor) tg.setHeaderColor('#f5f5f7');
    if (tg?.setBackgroundColor) tg.setBackgroundColor('#f5f5f7');
  }
}

if (tg) {
  tg.ready();
  tg.expand();
  tg.enableClosingConfirmation();
  if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
  applyAdaptiveTheme();
  tg.onEvent('themeChanged', applyAdaptiveTheme);
} else {
  applyAdaptiveTheme();
}
