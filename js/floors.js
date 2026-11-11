let allShops = [];
let allBanners = [];
let floorPagination = {};
let floorIntervals = {};

async function loadShopsData() {
  const container = document.getElementById("floors-container");
  container.innerHTML = `<div class="apple-card p-6 text-center text-xs theme-subtext">در حال بارگذاری مرکز تجارتی بهارسراب...</div>`;

  if (window.Telegram?.WebApp?.Serverless) {
    window.Telegram.WebApp.Serverless.call('getShops', {}, (err, res) => {
      if (!err && res?.data && res.data.length > 0) {
        allShops = res.data;
        allBanners = res.banners || [];
        renderDynamicFloors();
      } else {
        allShops = defaultShopsData;
        renderDynamicFloors();
      }
    });
  } else {
    allShops = defaultShopsData;
    renderDynamicFloors();
  }
}

function renderDynamicFloors() {
  const container = document.getElementById("floors-container");
  Object.values(floorIntervals).forEach(clearInterval);
  floorIntervals = {};

  let filtered = allShops;
  if (currentFilter) {
    filtered = allShops.filter(s => s.category?.includes(currentFilter) || s.shopName?.includes(currentFilter));
  }

  // طبقات به صورت استاندارد بهارسراب
  const standardFloors = ["طبقه همکف", "طبقه اول", "طبقه دوم", "طبقه سوم", "تهکوی (زیرزمین)"];

  container.innerHTML = standardFloors.map(floorName => {
    const activeShopsOnFloor = filtered.filter(s => s.floor === floorName);
    const floorKey = encodeURIComponent(floorName);
    const floorBanners = allBanners.filter(b => b.floor === floorName);

    if (!floorPagination[floorKey]) {
      floorPagination[floorKey] = { page: 0, isExpanded: false };
    }

    return `
      <section class="animate-fade-in" id="floor-sec-${floorKey}">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xs font-bold flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></span>
            ${floorName} <span class="text-[10px] theme-subtext font-normal">(${activeShopsOnFloor.length} دکان فعال)</span>
          </h3>
          <span class="text-[10px] theme-subtext">بهارسراب</span>
        </div>

        <!-- اسلایدر بنرهای طراحی‌شده طبقه با لینک مستقیم به دکان -->
        <div class="relative overflow-hidden rounded-2xl h-28 mb-3 theme-card shadow-sm border border-white/10">
          <div id="floor-slider-${floorKey}" class="flex transition-transform duration-500 h-full">
            ${Array.from({ length: 10 }).map((_, i) => {
              const customBanner = floorBanners.find(b => b.slotNumber === (i + 1));
              if (customBanner) {
                return `
                  <div onclick="openShopModal(${customBanner.shopId})" class="min-w-full h-full cursor-pointer relative overflow-hidden bg-slate-900">
                    <img src="https://api.telegram.org/file/bot${CONFIG.MINI_APP_BOT_USERNAME}/${customBanner.imageFileId}" 
                         class="w-full h-full object-cover" 
                         onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80';">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <span class="text-[10px] bg-[#0071e3] text-white px-2 py-0.5 rounded font-bold">ویژه • لمس جهت ورود به غرفه</span>
                    </div>
                  </div>
                `;
              } else {
                return `
                  <div class="min-w-full h-full flex items-center justify-between px-4 bg-gradient-to-r from-slate-900 to-black">
                    <div>
                      <span class="text-[9px] text-amber-500 font-bold">جایگاه تبلیغات • اسلاید ${i + 1} از ۱۰</span>
                      <h4 class="text-xs font-bold mt-0.5">${floorName} - ویترین دکان‌های برتر</h4>
                      <p class="text-[10px] theme-subtext">رزرو تبلیغات با مدیریت مارکت (@Akh_Aurora)</p>
                    </div>
                    <span class="text-2xl">✨</span>
                  </div>
                `;
              }
            }).join('')}
          </div>
        </div>

        <!-- گرید دکان‌ها: ۴ تای اول در چرخش، بقیه در حالت دیدن همه -->
        <div id="grid-${floorKey}" class="grid grid-cols-2 gap-2.5"></div>

        <div class="mt-2.5 text-center">
          <button id="btn-toggle-${floorKey}" onclick="toggleExpandFloor('${floorKey}')" class="w-full py-2 apple-btn rounded-xl text-[11px] text-[#0071e3] font-bold">
            مشاهده همه دکان‌های ${floorName} (دکان‌های فعال + خالی)
          </button>
        </div>
      </section>
    `;
  }).join('');

  lucide.createIcons();

  standardFloors.forEach(floorName => {
    const floorKey = encodeURIComponent(floorName);
    const activeShopsOnFloor = filtered.filter(s => s.floor === floorName);
    renderFloorCards(floorKey, activeShopsOnFloor, floorName);

    floorIntervals[floorKey] = setInterval(() => {
      if (!floorPagination[floorKey].isExpanded && activeShopsOnFloor.length > 4) {
        const totalPages = Math.ceil(activeShopsOnFloor.length / 4);
        floorPagination[floorKey].page = (floorPagination[floorKey].page + 1) % totalPages;
        renderFloorCards(floorKey, activeShopsOnFloor, floorName);
      }
    }, 5000);
  });
}

function renderFloorCards(floorKey, activeShops, floorName) {
  const grid = document.getElementById(`grid-${floorKey}`);
  if (!grid) return;

  const state = floorPagination[floorKey];

  // در حالت بسته (اسلایدی): فقط ۴ دکان فعال با اولویت
  if (!state.isExpanded) {
    const start = state.page * 4;
    const pageShops = activeShops.slice(start, start + 4);

    grid.innerHTML = pageShops.map(shop => `
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
  } 
  // در حالت «مشاهده همه»: ابتدا تمام دکان‌های فعال، سپس دکان‌های خالی آماده رزرو
  else {
    const defaultNumbers = baharSarabFloorPlan[floorName] || [];
    const activeShopNumbers = activeShops.map(s => s.shopNumber);
    const vacantNumbers = defaultNumbers.filter(num => !activeShopNumbers.includes(num));

    const activeHtml = activeShops.map(shop => `
      <div class="theme-card p-3 rounded-2xl flex flex-col justify-between border-emerald-500/30">
        <div>
          <div class="h-20 w-full rounded-xl theme-inner-box mb-2 relative overflow-hidden flex items-center justify-center">
            <span class="text-2xl">🏬</span>
            <span class="absolute top-1.5 right-1.5 text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
              دکان فعال ${shop.shopNumber}
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

    const vacantHtml = vacantNumbers.map(num => `
      <div class="theme-card p-3 rounded-2xl flex flex-col justify-between opacity-70 border-dashed border-white/20">
        <div>
          <div class="h-20 w-full rounded-xl theme-inner-box mb-2 relative overflow-hidden flex items-center justify-center">
            <span class="text-2xl opacity-40">🚪</span>
            <span class="absolute top-1.5 right-1.5 text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
              ${num}
            </span>
          </div>
          <h4 class="text-xs font-bold text-slate-400">دکان خالی شماره ${num}</h4>
          <p class="text-[10px] text-amber-500/90 mt-0.5">آماده واگذاری و رزرو</p>
        </div>

        <a href="https://t.me/${CONFIG.MINI_APP_BOT_USERNAME}?start=register" class="mt-2.5 w-full py-1.5 apple-btn rounded-xl text-[10px] font-bold text-slate-300 flex items-center justify-center gap-1">
          <span>رزرو این دکان</span>
          <i data-lucide="plus" class="w-3 h-3"></i>
        </a>
      </div>
    `).join('');

    grid.innerHTML = activeHtml + vacantHtml;
  }

  lucide.createIcons();
}

function toggleExpandFloor(floorKey) {
  const state = floorPagination[floorKey];
  state.isExpanded = !state.isExpanded;

  const floorName = decodeURIComponent(floorKey);
  const activeShops = allShops.filter(s => s.floor === floorName);
  const btn = document.getElementById(`btn-toggle-${floorKey}`);

  if (state.isExpanded) {
    btn.innerText = `بستن و چرخش خودکار دکان‌ها`;
  } else {
    btn.innerText = `مشاهده همه دکان‌های ${floorName} (دکان‌های فعال + خالی)`;
  }

  renderFloorCards(floorKey, activeShops, floorName);
}

function handleSearch(val) {
  const query = val.toLowerCase().trim();
  if (!query) {
    renderDynamicFloors();
    return;
  }
  const filtered = allShops.filter(s => 
    s.shopName?.toLowerCase().includes(query) || 
    s.category?.toLowerCase().includes(query) ||
    s.shopNumber?.toLowerCase().includes(query)
  );
  allShops = filtered;
  renderDynamicFloors();
}