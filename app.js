// ۱. راه‌اندازی و ست کردن تم هوشمند متناسب با تم دستگاه و تلگرام
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

// دیتای راسته‌ها برای اسلایدر ۵ ثانیه‌ای و منوی کشویی
const heroCategories = [
  { id: "gold", title: "راسته طلا و نقره", subtitle: "جدیدترین مدل‌های طلای ۲۱ عیار و نقره اصیل", tag: "طلا و نقره", bgDark: "from-[#2b1f0c] to-[#000000]", bgLight: "from-[#fff3d6] to-[#f5f5f7]", icon: "💍" },
  { id: "clothing", title: "لباس و گند سنتی", subtitle: "بزرگ‌ترین بورس دست‌دوز و گندهای هزارگی", tag: "لباس سنتی", bgDark: "from-[#2d1118] to-[#000000]", bgLight: "from-[#ffe8ec] to-[#f5f5f7]", icon: "👗" },
  { id: "currency", title: "صرافی‌ها و تبادله اسعار", subtitle: "حواله‌جات سریع و تبدیل دالر و افغانی در تهکوی", tag: "صرافی", bgDark: "from-[#0c2417] to-[#000000]", bgLight: "from-[#e4f7eb] to-[#f5f5f7]", icon: "💱" },
  { id: "shoes", title: "بوت، کیف و بکس زنانه", subtitle: "ترندهای لوکس فصلی و مجلسی", tag: "بوت و کیف", bgDark: "from-[#20102b] to-[#000000]", bgLight: "from-[#f4e8ff] to-[#f5f5f7]", icon: "👠" },
  { id: "cosmetics", title: "عطر و لوازم آرایشی", subtitle: "برندهای معتبر فرانسوی و ادکلن‌های اصل", tag: "آرایشی", bgDark: "from-[#2b1020] to-[#000000]", bgLight: "from-[#ffe8f3] to-[#f5f5f7]", icon: "💄" },
  { id: "cargo", title: "کارگو و انتقال اموال", subtitle: "ارسال سریع به استرالیا، اروپا و کانادا", tag: "کارگو", bgDark: "from-[#0f1d30] to-[#000000]", bgLight: "from-[#e6f0ff] to-[#f5f5f7]", icon: "✈️" }
];

let heroSlideIndex = 0;
let cart = [];
let allShops = [];
let activeShop = null;
let currentFilter = null;
let floorPagination = {};
let floorIntervals = {};

document.addEventListener("DOMContentLoaded", async () => {
  lucide.createIcons();
  initHeroSlider();
  buildCategorySideMenu();
  await loadShopsData();
  checkDeepLinkParams();
});

// ۲. اسلایدر ۵ ثانیه‌ای هوشمند
function initHeroSlider() {
  const container = document.getElementById("hero-slider");
  const dots = document.getElementById("slider-dots");
  const isDark = document.body.classList.contains('dark-theme');

  container.innerHTML = heroCategories.map((item) => `
    <div onclick="filterByCategory('${item.tag}')" class="min-w-full h-full bg-gradient-to-r ${isDark ? item.bgDark : item.bgLight} p-5 flex flex-col justify-center relative">
      <span class="text-4xl absolute left-5 top-5 opacity-40">${item.icon}</span>
      <span class="text-[10px] text-amber-600 dark:text-[#e5b869] font-bold tracking-wider mb-1">راسته تجارتی بهارسراب</span>
      <h2 class="text-base font-extrabold">${item.title}</h2>
      <p class="text-xs theme-subtext mt-1">${item.subtitle}</p>
      <span class="text-[10px] text-[#0071e3] mt-2 flex items-center gap-1 font-bold">مشاهده دکان‌های این صنف ←</span>
    </div>
  `).join("");

  dots.innerHTML = heroCategories.map((_, i) => `
    <span class="w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-[#0071e3] w-4' : 'bg-slate-400/30'}"></span>
  `).join("");

  setInterval(() => {
    heroSlideIndex = (heroSlideIndex + 1) % heroCategories.length;
    container.style.transform = `translateX(${heroSlideIndex * 100}%)`;
    Array.from(dots.children).forEach((dot, idx) => {
      dot.className = `w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === heroSlideIndex ? 'bg-[#0071e3] w-4' : 'bg-slate-400/30'}`;
    });
  }, 5000);
}

// ۳. منوی کشویی کناری
function toggleSideMenu() {
  document.getElementById("side-drawer").classList.toggle("hidden");
}

function buildCategorySideMenu() {
  const list = document.getElementById("categories-menu-list");
  list.innerHTML = `
    <button onclick="clearCategoryFilter(); toggleSideMenu();" class="w-full text-right py-2 px-3 rounded-xl text-xs flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 font-bold">
      <span>نمایش همه اصناف</span>
      <i data-lucide="check" class="w-3.5 h-3.5 text-[#0071e3]"></i>
    </button>
    ${heroCategories.map(cat => `
      <button onclick="filterByCategory('${cat.tag}'); toggleSideMenu();" class="w-full text-right py-2 px-3 rounded-xl text-xs flex items-center justify-between theme-subtext hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5">
        <span class="flex items-center gap-2"><span>${cat.icon}</span> <span>${cat.title}</span></span>
        <i data-lucide="chevron-left" class="w-3.5 h-3.5 opacity-40"></i>
      </button>
    `).join('')}
  `;
}

function filterByCategory(tag) {
  currentFilter = tag;
  document.getElementById("clear-filter-btn").classList.remove("hidden");
  document.getElementById("clear-filter-btn").innerText = `صنف: ${tag} ✕`;
  renderDynamicFloors();
}

function clearCategoryFilter() {
  currentFilter = null;
  document.getElementById("clear-filter-btn").classList.add("hidden");
  renderDynamicFloors();
}

// ۴. بارگذاری اطلاعات دکان‌ها
async function loadShopsData() {
  try {
    if (tg?.Serverless) {
      tg.Serverless.call('getShops', {}, (err, res) => {
        if (!err && res?.data && res.data.length > 0) {
          allShops = res.data;
          renderDynamicFloors();
        } else {
          loadDefaultShops();
        }
      });
    } else {
      loadDefaultShops();
    }
  } catch (e) {
    loadDefaultShops();
  }
}

function loadDefaultShops() {
  allShops = [
    { id: 1, shopName: "زرگری و طلای نگین برچی", shopNumber: "دکان ۱۲", floor: "طبقه همکف", category: "طلا و نقره", phone: "0799000111", whatsapp: "93799000111" },
    { id: 2, shopName: "طلای ۲۱ عیار سلطانی", shopNumber: "دکان ۱۴", floor: "طبقه همکف", category: "طلا و نقره", phone: "0799000112", whatsapp: "93799000112" },
    { id: 3, shopName: "نقره‌سرای خاتم کابل", shopNumber: "دکان ۱۵", floor: "طبقه همکف", category: "طلا و نقره", phone: "0799000113", whatsapp: "93799000113" },
    { id: 4, shopName: "عطر و ادکلن پاریس سنتر", shopNumber: "دکان ۱۸", floor: "طبقه همکف", category: "آرایشی", phone: "0799000114", whatsapp: "93799000114" },
    { id: 5, shopName: "ساعت‌فروشی لوکس زمان", shopNumber: "دکان ۲۰", floor: "طبقه همکف", category: "طلا و نقره", phone: "0799000115", whatsapp: "93799000115" },
    { id: 6, shopName: "گند و لباس سنتی شاهانه", shopNumber: "دکان ۲۲", floor: "طبقه اول", category: "لباس سنتی", phone: "0788000222", whatsapp: "93788000222" },
    { id: 7, shopName: "گند افغانی نگین هزاره", shopNumber: "دکان ۲۴", floor: "طبقه اول", category: "لباس سنتی", phone: "0788000223", whatsapp: "93788000223" },
    { id: 8, shopName: "بکس و چپلی کابل شیک", shopNumber: "دکان ۲۶", floor: "طبقه اول", category: "بوت و کیف", phone: "0788000224", whatsapp: "93788000224" },
    { id: 9, shopName: "حجاب و چادرسرای بانو", shopNumber: "دکان ۲۸", floor: "طبقه اول", category: "لباس سنتی", phone: "0788000225", whatsapp: "93788000225" },
    { id: 10, shopName: "بوت و کفش مجلسی نگار", shopNumber: "دکان ۳۰", floor: "طبقه اول", category: "بوت و کیف", phone: "0788000226", whatsapp: "93788000226" },
    { id: 11, shopName: "کت و شلوار و دریشی آرا", shopNumber: "دکان ۴۰", floor: "طبقه دوم", category: "پوشاک مردانه", phone: "0777000333", whatsapp: "93777000333" },
    { id: 12, shopName: "پوشاک و اسباب‌بازی کودک", shopNumber: "دکان ۴۲", floor: "طبقه دوم", category: "کودک", phone: "0777000334", whatsapp: "93777000334" },
    { id: 13, shopName: "صرافی برچی اکسپرس", shopNumber: "دکان ۰۲", floor: "تهکوی (زیرزمین)", category: "صرافی", phone: "0700000444", whatsapp: "93700000444" },
    { id: 14, shopName: "کارگو بین‌المللی افغان", shopNumber: "دکان ۰۴", floor: "تهکوی (زیرزمین)", category: "کارگو", phone: "0700000445", whatsapp: "93700000445" }
  ];
  renderDynamicFloors();
}

// ۵. ساخت خودکار طبقات و ۴ کارت چرخشی ۵ ثانیه‌ای
function renderDynamicFloors() {
  const container = document.getElementById("floors-container");
  
  Object.values(floorIntervals).forEach(clearInterval);
  floorIntervals = {};

  let filtered = allShops;
  if (currentFilter) {
    filtered = allShops.filter(s => s.category?.includes(currentFilter) || s.shopName?.includes(currentFilter));
  }

  const floorsList = [...new Set(filtered.map(s => s.floor || 'سایر طبقات'))];

  if (floorsList.length === 0) {
    container.innerHTML = `<div class="theme-card p-6 text-center text-xs theme-subtext">هیچ دکانی در این صنف یافت نشد.</div>`;
    return;
  }

  container.innerHTML = floorsList.map(floorName => {
    const shopsOnFloor = filtered.filter(s => (s.floor || 'سایر طبقات') === floorName);
    const floorKey = encodeURIComponent(floorName);
    
    if (!floorPagination[floorKey]) {
      floorPagination[floorKey] = { page: 0, isExpanded: false };
    }

    return `
      <section class="animate-fade-in" id="floor-sec-${floorKey}">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xs font-bold flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></span>
            ${floorName} <span class="text-[10px] theme-subtext font-normal">(${shopsOnFloor.length} غرفه)</span>
          </h3>
          <span class="text-[10px] theme-subtext">بهارسراب</span>
        </div>

        <div class="relative overflow-hidden rounded-xl h-24 mb-3 theme-card shadow-sm">
          <div id="floor-slider-${floorKey}" class="flex transition-transform duration-500 h-full">
            ${Array.from({ length: 10 }).map((_, i) => `
              <div class="min-w-full h-full flex items-center justify-between px-4">
                <div>
                  <span class="text-[9px] text-amber-600 dark:text-[#e5b869] font-bold">ویترین اختصاصی • اسلاید ${i + 1} از ۱۰</span>
                  <h4 class="text-xs font-bold mt-0.5">${floorName} - بورس اجناس درجه یک</h4>
                  <p class="text-[10px] theme-subtext">تخفیفات ویژه و اجناس برتر مارکت</p>
                </div>
                <span class="text-2xl">✨</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div id="grid-${floorKey}" class="grid grid-cols-2 gap-2.5"></div>

        <div class="mt-2.5 text-center">
          <button id="btn-toggle-${floorKey}" onclick="toggleExpandFloor('${floorKey}')" class="w-full py-2 apple-btn rounded-xl text-[11px] text-[#0071e3] font-bold">
            مشاهده همه دکان‌های ${floorName} (${shopsOnFloor.length} دکان)
          </button>
        </div>
      </section>
    `;
  }).join('');

  lucide.createIcons();

  floorsList.forEach(floorName => {
    const floorKey = encodeURIComponent(floorName);
    const shopsOnFloor = filtered.filter(s => (s.floor || 'سایر طبقات') === floorName);
    renderFloorCards(floorKey, shopsOnFloor);

    floorIntervals[floorKey] = setInterval(() => {
      if (!floorPagination[floorKey].isExpanded && shopsOnFloor.length > 4) {
        const totalPages = Math.ceil(shopsOnFloor.length / 4);
        floorPagination[floorKey].page = (floorPagination[floorKey].page + 1) % totalPages;
        renderFloorCards(floorKey, shopsOnFloor);
      }
    }, 5000);
  });
}

function renderFloorCards(floorKey, shopsOnFloor) {
  const grid = document.getElementById(`grid-${floorKey}`);
  if (!grid) return;

  const state = floorPagination[floorKey];
  let displayShops = shopsOnFloor;

  if (!state.isExpanded) {
    const start = state.page * 4;
    displayShops = shopsOnFloor.slice(start, start + 4);
    if (displayShops.length === 0) {
      state.page = 0;
      displayShops = shopsOnFloor.slice(0, 4);
    }
  }

  grid.innerHTML = displayShops.map(shop => `
    <div class="theme-card p-3 rounded-2xl flex flex-col justify-between">
      <div>
        <div class="h-20 w-full rounded-xl theme-inner-box mb-2 relative overflow-hidden flex items-center justify-center">
          <span class="text-2xl">🏬</span>
          <span class="absolute top-1.5 right-1.5 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded font-bold">
            ${shop.shopNumber}
          </span>
        </div>
        <h4 class="text-xs font-bold truncate">${shop.shopName}</h4>
        <p class="text-[10px] theme-subtext mt-0.5 truncate">${shop.category}</p>
      </div>

      <button onclick="openShopModal(${shop.id})" class="mt-2.5 w-full py-1.5 apple-btn rounded-xl text-[10px] font-bold text-[#0071e3] flex items-center justify-center gap-1">
        <span>ورود به غرفه</span>
        <i data-lucide="chevron-left" class="w-3 h-3"></i>
      </button>
    </div>
  `).join('');

  lucide.createIcons();
}

function toggleExpandFloor(floorKey) {
  const state = floorPagination[floorKey];
  state.isExpanded = !state.isExpanded;

  const floorName = decodeURIComponent(floorKey);
  const shopsOnFloor = allShops.filter(s => (s.floor || 'سایر طبقات') === floorName);
  const btn = document.getElementById(`btn-toggle-${floorKey}`);

  if (state.isExpanded) {
    btn.innerText = `بستن و چرخش خودکار (۴تایی)`;
  } else {
    btn.innerText = `مشاهده همه دکان‌های ${floorName} (${shopsOnFloor.length} دکان)`;
  }

  renderFloorCards(floorKey, shopsOnFloor);
}

// ۶. باز کردن غرفه دکان
function openShopModal(shopId) {
  activeShop = allShops.find(s => s.id === shopId);
  if (!activeShop) return;

  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');

  document.getElementById("modal-shop-name").innerText = activeShop.shopName;
  document.getElementById("modal-shop-location").innerText = `مرکز بهارسراب • ${activeShop.floor} • ${activeShop.shopNumber}`;
  document.getElementById("modal-shop-cat").innerText = activeShop.category;
  document.getElementById("btn-call").href = `tel:${activeShop.phone}`;
  document.getElementById("btn-wa").href = `https://wa.me/${activeShop.whatsapp}`;

  const grid = document.getElementById("shop-products-grid");
  grid.innerHTML = `
    <div class="theme-card p-3 rounded-2xl flex flex-col justify-between">
      <div class="h-28 theme-inner-box rounded-xl mb-2 flex items-center justify-center text-3xl">👗</div>
      <h5 class="text-xs font-bold truncate">گند سنتی دست‌دوز اصیل</h5>
      <span class="text-xs font-bold text-[#0071e3] my-1">4,800 افغانی</span>
      <button onclick="addToCart('گند دست‌دوز', 4800)" class="w-full py-2 bg-[#0071e3] text-white font-bold rounded-xl text-[10px] shadow">
        افزودن به سبد
      </button>
    </div>
    <div class="theme-card p-3 rounded-2xl flex flex-col justify-between">
      <div class="h-28 theme-inner-box rounded-xl mb-2 flex items-center justify-center text-3xl">💍</div>
      <h5 class="text-xs font-bold truncate">انگشتر نقره با نگین عقیق</h5>
      <span class="text-xs font-bold text-[#0071e3] my-1">1,900 افغانی</span>
      <button onclick="addToCart('انگشتر نقره', 1900)" class="w-full py-2 bg-[#0071e3] text-white font-bold rounded-xl text-[10px] shadow">
        افزودن به سبد
      </button>
    </div>
  `;

  document.getElementById("shop-modal").classList.remove("hidden");
  if (tg?.BackButton) {
    tg.BackButton.show();
    tg.BackButton.onClick(closeShopModal);
  }
}

function closeShopModal() {
  document.getElementById("shop-modal").classList.add("hidden");
  if (tg?.BackButton) tg.BackButton.hide();
}

function openChatModal() { document.getElementById("chat-modal").classList.remove("hidden"); }
function closeChatModal() { document.getElementById("chat-modal").classList.add("hidden"); }
function startDirectChat() {
  if (activeShop) document.getElementById("chat-target-name").innerText = activeShop.shopName;
  openChatModal();
}
function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  if (!msg) return;

  const chatContainer = document.getElementById("chat-messages");
  chatContainer.innerHTML += `
    <div class="flex justify-end">
      <div class="bg-[#0071e3] text-white max-w-[80%] p-2.5 rounded-2xl rounded-tl-none text-xs font-medium">
        ${msg}
      </div>
    </div>
  `;
  input.value = "";
  chatContainer.scrollTop = chatContainer.scrollHeight;
  if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
}

function addToCart(title, price) {
  cart.push({ title, price });
  document.getElementById("cart-count").innerText = cart.length;
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}
function openCartModal() {
  const container = document.getElementById("cart-items");
  if (cart.length === 0) {
    container.innerHTML = `<p class="text-xs theme-subtext text-center py-4">سبد خرید شما خالی است.</p>`;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="flex justify-between items-center theme-inner-box p-2.5 rounded-xl text-xs">
        <span>${item.title}</span>
        <span class="text-[#0071e3] font-bold">${item.price} افغانی</span>
      </div>
    `).join("");
  }
  const total = cart.reduce((acc, curr) => acc + curr.price, 0);
  document.getElementById("cart-total-price").innerText = `${total} افغانی`;
  document.getElementById("cart-modal").classList.remove("hidden");
}
function closeCartModal() { document.getElementById("cart-modal").classList.add("hidden"); }

function finalizeOrder() {
  const phone = document.getElementById("order-phone").value;
  if (!phone) {
    alert("لطفاً شماره تماس خود را وارد فرمایید.");
    return;
  }
  alert("فرمایش شما با موفقیت ثبت شد و به دکاندار مارکت بهارسراب ارجاع گردید.");
  cart = [];
  document.getElementById("cart-count").innerText = "0";
  closeCartModal();
}

function handleSearch(val) {
  const query = val.toLowerCase().trim();
  if (!query) {
    renderDynamicFloors();
    return;
  }
  const filtered = allShops.filter(s => 
    s.shopName.toLowerCase().includes(query) || 
    s.category.toLowerCase().includes(query) ||
    s.shopNumber.toLowerCase().includes(query)
  );
  allShops = filtered;
  renderDynamicFloors();
}

function checkDeepLinkParams() {
  const startParam = tg?.initDataUnsafe?.start_param;
  if (startParam?.startsWith('shop_')) {
    const shopId = parseInt(startParam.replace('shop_', ''));
    setTimeout(() => openShopModal(shopId), 400);
  }
}