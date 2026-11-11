document.addEventListener("DOMContentLoaded", async () => {
  lucide.createIcons();
  initHeroSlider();
  buildCategorySideMenu();
  await loadShopsData();
  checkDeepLinkParams();
});

function checkDeepLinkParams() {
  const startParam = tg?.initDataUnsafe?.start_param;
  if (startParam?.startsWith('shop_')) {
    const shopId = parseInt(startParam.replace('shop_', ''));
    setTimeout(() => openShopModal(shopId), 400);
  }
}