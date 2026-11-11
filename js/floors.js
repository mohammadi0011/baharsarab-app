let allShops = [], allBanners = [], floorState = {}, floorTimers = {};

// لیست کامل طبقات واقعی مرکز بهارسراب
const standardFloors = [
  "طبقه همکف", "طبقه اول", "طبقه دوم", "طبقه سوم",
  "طبقه چهارم", "طبقه پنجم", "طبقه هفتم (رستورانت و بام)", "تهکوی (زیرزمین)"
];

// دریافت اطلاعات دکان‌ها و بنرها
async function loadShopsData() {
  const container = document.getElementById("floors-container");
  container.innerHTML = `<div class="apple-card p-6 text-center text-xs theme-subtext">در حال بارگذاری مرکز بهارسراب...</div>`;

  const twa = window.Telegram?.WebApp?.Serverless;
  if (twa) {
    twa.call('getShops', {}, (err, res) => {
      allShops = (!err && res?.data?.length) ? res.data : defaultShopsData;
      allBanners = res?.banners || [];
      renderDynamicFloors();
    });
  } else {
    allShops = defaultShopsData;
    renderDynamicFloors();
  }
}

// ساخت و چیدمان طبقات
function renderDynamicFloors() {
  const container = document.getElementById("floors-container");
  Object.values(floorTimers).forEach(clearInterval);
  floorTimers = {};

  const filtered = currentFilter ? allShops.filter(s => s.category?.includes(currentFilter) || s.shopName?.includes(currentFilter)) : allShops;

  container.innerHTML = standardFloors.map(floor => {
    const shops = filtered.filter(s => s.floor === floor);
    const banners = allBanners.filter(b => b.floor === floor);
    const key = encodeURIComponent(floor);
    if (!floorState[key]) floorState[key] = { page: 0, expanded: false };

    return `
      <section class="animate-fade-in" id="sec-${key}">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xs font-bold flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></span>${floor} (${shops.length} دکان فعال)</h3>
          <span class="text-[10px] theme-subtext">بهارسراب</span>
        </div>
        
        <!-- اسلایدر بنرها با لینک به دکان -->
        <div class="relative overflow-hidden rounded-2xl h-28 mb-3 theme-card shadow-sm border border-white/10">
          <div id="slider-${key}" class="flex transition-transform duration-500 h-full">
            ${Array.from({ length: 10 }).map((_, i) => renderBannerSlide(banners, i + 1, floor)).join('')}
          </div>
        </div>

        <div id="grid-${key}" class="grid grid-cols-2 gap-2.5"></div>
        
        <button id="btn-${key}" onclick="toggleFloor('${key}')" class="w-full mt-2.5 py-2 apple-btn rounded-xl text-[11px] text-[#0071e3] font-bold">
          مشاهده همه دکان‌های ${floor}
        </button>
      </section>`;
  }).join('');

  lucide.createIcons();

  // فعال‌سازی چرخش خودکار ۵ ثانیه‌ای ۴ تایی
  standardFloors.forEach(floor => {
    const key = encodeURIComponent(floor);
    const shops = filtered.filter(s => s.floor === floor);
    renderCards(key, shops, floor);

    floorTimers[key] = setInterval(() => {
      const state = floorState[key];
      if (!state.expanded && shops.length > 4) {
        state.page = (state.page + 1) % Math.ceil(shops.length / 4);
        renderCards(key, shops, floor);
      }
    }, 5000);
  });
}

// ساخت اسلایدهای بنر
function renderBannerSlide(banners, slot, floor) {
  const b = banners.find(x => x.slotNumber === slot);
  if (b) {
    return `<div onclick="openShopModal(${b.shopId})" class="min-w-full h-full cursor-pointer relative bg-slate-900">
      <img src="https://api.telegram.org/file/bot${CONFIG.MINI_APP_BOT_USERNAME}/${b.imageFileId}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 flex items-end p-2.5"><span class="text-[9px] bg-[#0071e3] text-white px-1.5 py-0.5 rounded font-bold">ویژه • لمس جهت ورود</span></div>
    </div>`;
  }
  return `<div class="min-w-full h-full flex items-center justify-between px-4 bg-gradient-to-r from-slate-900 to-black">
    <div><span class="text-[9px] text-amber-500 font-bold">جایگاه ${slot} از ۱۰</span><h4 class="text-xs font-bold mt-0.5">${floor}</h4><p class="text-[10px] theme-subtext">رزرو بنر با مدیریت مارکت</p></div>
    <span class="text-xl">✨</span>
  </div>`;
}

// ساخت کارت‌های دکان (حالت چرخش ۴ تایی یا مشاهده همه)
function renderCards(key, activeShops, floor) {
  const grid = document.getElementById(`grid-${key}`);
  if (!grid) return;
  const state = floorState[key];

  if (!state.expanded) {
    const pageShops = activeShops.slice(state.page * 4, state.page * 4 + 4);
    grid.innerHTML = pageShops.map(s => shopCardHtml(s, false)).join('');
  } else {
    const plan = baharSarabFloorPlan[floor] || [];
    const activeNums = activeShops.map(s => s.shopNumber);
    const vacants = plan.filter(num => !activeNums.includes(num));
    
    grid.innerHTML = activeShops.map(s => shopCardHtml(s, true)).join('') + 
      vacants.map(num => `
        <div class="theme-card p-2.5 rounded-2xl opacity-60 border-dashed border-white/20 flex flex-col justify-between">
          <div><div class="h-16 rounded-xl theme-inner-box flex items-center justify-center text-xl">🚪</div><h4 class="text-[11px] font-bold mt-1 text-slate-400">دکان خالی ${num}</h4><p class="text-[9px] text-amber-500">آماده واگذاری</p></div>
          <a href="https://t.me/${CONFIG.MINI_APP_BOT_USERNAME}?start=register" class="mt-2 py-1 apple-btn rounded-lg text-[9px] text-center font-bold text-slate-300">رزرو دکان</a>
        </div>`).join('');
  }
  lucide.createIcons();
}

function shopCardHtml(shop, isFull) {
  return `<div class="theme-card p-3 rounded-2xl flex flex-col justify-between ${isFull ? 'border-emerald-500/30' : ''}">
    <div>
      <div class="h-20 rounded-xl theme-inner-box mb-2 flex items-center justify-center text-2xl relative">
        🏬<span class="absolute top-1.5 right-1.5 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded font-bold">${shop.shopNumber}</span>
      </div>
      <h4 class="text-xs font-bold truncate">${shop.shopName}</h4>
      <p class="text-[10px] theme-subtext mt-0.5 truncate">${shop.category}</p>
    </div>
    <button onclick="openShopModal(${shop.id})" class="mt-2.5 w-full py-1.5 apple-btn rounded-xl text-[10px] font-bold text-[#0071e3] flex items-center justify-center gap-1">
      <span>ورود به غرفه</span><i data-lucide="chevron-left" class="w-3 h-3"></i>
    </button>
  </div>`;
}

function toggleFloor(key) {
  const state = floorState[key];
  state.expanded = !state.expanded;
  const floor = decodeURIComponent(key);
  document.getElementById(`btn-${key}`).innerText = state.expanded ? 'بستن دکان‌ها' : `مشاهده همه دکان‌های ${floor}`;
  renderCards(key, allShops.filter(s => s.floor === floor), floor);
}

function handleSearch(val) {
  const q = val.toLowerCase().trim();
  allShops = !q ? defaultShopsData : defaultShopsData.filter(s => s.shopName?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q) || s.shopNumber?.toLowerCase().includes(q));
  renderDynamicFloors();
}