let allShops = [];
let floorPagination = {};
let floorIntervals = {};

async function loadShopsData() {
  try {
    if (tg?.Serverless) {
      tg.Serverless.call('getShops', {}, (err, res) => {
        if (!err && res?.data && res.data.length > 0) {
          allShops = res.data;
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
  } catch (e) {
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