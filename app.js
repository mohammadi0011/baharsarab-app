const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.enableClosingConfirmation();
}

// اسلایدر ۳ ثانیه‌ای برگرفته از اصناف اصلی مرکز بهارسراب
const heroSlides = [
  { title: "راسته طلا، نقره و عقیق", subtitle: "جدیدترین زیورآلات و طلاهای ۲۱ عیار در طبقه همکف", bg: "from-amber-950 to-slate-900", icon: "💍" },
  { title: "گند و لباس سنتی هزارگی", subtitle: "بزرگ‌ترین بورس دست‌دوز و لباس محفلی در طبقه اول", bg: "from-rose-950 to-slate-900", icon: "👗" },
  { title: "صرافی‌ها و حواله‌جات", subtitle: "حواله فوری به سراسر جهان و تبادله اسعار در تهکوی", bg: "from-emerald-950 to-slate-900", icon: "💱" },
  { title: "بوت، چپلی و بکس شیک", subtitle: "ترندهای فصلی زنانه و مردانه در طبقات اول و دوم", bg: "from-purple-950 to-slate-900", icon: "👠" },
  { title: "کارگو و انتقال اموال", subtitle: "ارسال سریع و مطمئن اموال به استرالیا، اروپا و کانادا", bg: "from-blue-950 to-slate-900", icon: "✈️" },
  { title: "رستورانت خانوادگی بهارسراب", subtitle: "لذیذترین کباب‌های اصیل و فست‌فود در طبقه سوم", bg: "from-orange-950 to-slate-900", icon: "🍲" }
];

let currentSlide = 0;
let cart = [];
let allShops = [];
let activeShop = null;

document.addEventListener("DOMContentLoaded", async () => {
  lucide.createIcons();
  initHeroSlider();
  await loadShopsFromBackend();
  checkDeepLinkParams();
});

// راه‌اندازی اسلایدر ۳ ثانیه‌ای
function initHeroSlider() {
  const container = document.getElementById("hero-slider");
  const dots = document.getElementById("slider-dots");

  container.innerHTML = heroSlides.map(slide => `
    <div class="min-w-full h-full bg-gradient-to-r ${slide.bg} p-5 flex flex-col justify-center relative">
      <span class="text-4xl absolute left-5 top-5 opacity-40">${slide.icon}</span>
      <span class="text-[10px] text-amber-400 font-bold tracking-wider mb-1">مرکز تجارتی بهارسراب دشت برچی</span>
      <h2 class="text-base font-extrabold text-white">${slide.title}</h2>
      <p class="text-xs text-slate-300 mt-1">${slide.subtitle}</p>
    </div>
  `).join("");

  dots.innerHTML = heroSlides.map((_, i) => `
    <span class="w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-amber-400 w-4' : 'bg-white/30'}"></span>
  `).join("");

  setInterval(() => {
    currentSlide = (currentSlide + 1) % heroSlides.length;
    container.style.transform = `translateX(${currentSlide * 100}%)`;
    Array.from(dots.children).forEach((dot, idx) => {
      dot.className = `w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-amber-400 w-4' : 'bg-white/30'}`;
    });
  }, 3000);
}

// بارگذاری دکان‌ها از سرورلس تلگرام
async function loadShopsFromBackend() {
  try {
    if (tg?.Serverless) {
      tg.Serverless.call('getShops', {}, (err, res) => {
        if (!err && res?.data && res.data.length > 0) {
          allShops = res.data;
          renderFloors(allShops);
        } else {
          loadRealisticShops();
        }
      });
    } else {
      loadRealisticShops();
    }
  } catch (e) {
    loadRealisticShops();
  }
}

// دکان‌های نمونه منطبق با واقعیت مارکت بهارسراب
function loadRealisticShops() {
  allShops = [
    // طبقه اول (لباس و گند)
    { id: 1, shopName: "گند و لباس سنتی شاهانه", shopNumber: "دکان ۱۸", floor: "طبقه اول", category: "لباس سنتی و گند", phone: "0799112233", whatsapp: "93799112233" },
    { id: 2, shopName: "حجاب و چادر سرای بانو", shopNumber: "دکان ۲۴", floor: "طبقه اول", category: "لباس زنانه و شال", phone: "0788223344", whatsapp: "93788223344" },
    { id: 3, shopName: "بوت و بکس لوکس کابل", shopNumber: "دکان ۳۰", floor: "طبقه اول", category: "بوت و کیف زنانه", phone: "0777334455", whatsapp: "93777334455" },

    // طبقه همکف (طلا و لوازم آرایشی)
    { id: 4, shopName: "طلا و جواهرات نگین برچی", shopNumber: "دکان ۰۸", floor: "طبقه همکف", category: "طلا و زیورآلات", phone: "0700445566", whatsapp: "93700445566" },
    { id: 5, shopName: "نقره و عقیق سرای خاوران", shopNumber: "دکان ۱۱", floor: "طبقه همکف", category: "نقره و سنگ‌های قیمتی", phone: "0744556677", whatsapp: "93744556677" },
    { id: 6, shopName: "عطر و آرایشی پاریس سنتر", shopNumber: "دکان ۱۵", floor: "طبقه همکف", category: "عطر و لوازم آرایشی", phone: "0799667788", whatsapp: "93799667788" },

    // طبقه دوم (مردانه و اطفال)
    { id: 7, shopName: "کت و شلوار و دریشی برتر", shopNumber: "دکان ۴۲", floor: "طبقه دوم", category: "پوشاک مردانه", phone: "0788778899", whatsapp: "93788778899" },
    { id: 8, shopName: "دنیای بازی و پوشاک کودک", shopNumber: "دکان ۴۸", floor: "طبقه دوم", category: "کودک و اسباب‌بازی", phone: "0777889900", whatsapp: "93777889900" },

    // تهکوی / زیرزمین (صرافی و کارگو)
    { id: 9, shopName: "صرافی و خدمات پولی برچی", shopNumber: "دکان ۰۲", floor: "تهکوی (زیرزمین)", category: "صرافی و حواله‌جات", phone: "0700112244", whatsapp: "93700112244" },
    { id: 10, shopName: "کارگو بین‌المللی امید کابل", shopNumber: "دکان ۰۶", floor: "تهکوی (زیرزمین)", category: "کارگو و انتقال اموال", phone: "0799223355", whatsapp: "93799223355" }
  ];
  renderFloors(allShops);
}

// چیدمان طبقات (طبقه همکف، اول، دوم، سوم و سپس زیرزمین)
function renderFloors(shopsList) {
  const container = document.getElementById("floors-container");
  const floorOrder = ["طبقه همکف", "طبقه اول", "طبقه دوم", "طبقه سوم (رستورانت)", "تهکوی (زیرزمین)"];

  container.innerHTML = floorOrder.map(floorName => {
    const shopsInFloor = shopsList.filter(s => s.floor?.includes(floorName) || s.shopNumber?.includes(floorName));
    if (shopsInFloor.length === 0) return '';

    return `
      <section class="animate-fade-in">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xs font-black text-white flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-amber-400"></span>
            ${floorName} <span class="text-[10px] text-slate-400 font-normal">(${shopsInFloor.length} غرفه فعال)</span>
          </h3>
        </div>

        <div class="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
          ${shopsInFloor.map(shop => `
            <div class="min-w-[210px] max-w-[210px] glass-card p-3 rounded-2xl snap-start flex flex-col justify-between">
              <div>
                <div class="h-24 w-full rounded-xl bg-slate-900/90 mb-2 relative overflow-hidden flex items-center justify-center border border-white/10">
                  <span class="text-3xl">🏬</span>
                  <span class="absolute top-1.5 right-1.5 text-[9px] bg-slate-950/80 backdrop-blur px-1.5 py-0.5 rounded text-amber-400 font-bold border border-white/10">
                    ${shop.shopNumber}
                  </span>
                </div>
                <h4 class="text-xs font-bold text-white truncate">${shop.shopName}</h4>
                <p class="text-[10px] text-slate-400 mt-0.5 truncate">${shop.category}</p>
              </div>

              <button onclick="openShopModal(${shop.id})" class="mt-3 w-full py-2 glass-btn rounded-xl text-[11px] font-bold text-amber-400 flex items-center justify-center gap-1">
                <span>ورود به غرفه</span>
                <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }).join('');

  lucide.createIcons();
}

// باز کردن غرفه دکان
function openShopModal(shopId) {
  activeShop = allShops.find(s => s.id === shopId);
  if (!activeShop) return;

  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');

  document.getElementById("modal-shop-name").innerText = activeShop.shopName;
  document.getElementById("modal-shop-location").innerText = `مرکز بهارسراب • ${activeShop.floor || 'دشت برچی'} • ${activeShop.shopNumber}`;
  document.getElementById("modal-shop-cat").innerText = activeShop.category;
  document.getElementById("btn-call").href = `tel:${activeShop.phone}`;
  document.getElementById("btn-wa").href = `https://wa.me/${activeShop.whatsapp}`;

  const grid = document.getElementById("shop-products-grid");
  grid.innerHTML = `
    <div class="glass-card p-3 rounded-2xl flex flex-col justify-between">
      <div class="h-28 bg-slate-900 rounded-xl mb-2 flex items-center justify-center text-3xl">👗</div>
      <h5 class="text-xs font-bold text-white truncate">پیراهن گند دست‌دوز اصیل</h5>
      <span class="text-xs font-black text-amber-400 my-1">4,800 افغانی</span>
      <button onclick="addToCart('پیراهن گند دست‌دوز', 4800)" class="w-full py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-[11px] shadow">
        افزودن به سبد
      </button>
    </div>
    <div class="glass-card p-3 rounded-2xl flex flex-col justify-between">
      <div class="h-28 bg-slate-900 rounded-xl mb-2 flex items-center justify-center text-3xl">💍</div>
      <h5 class="text-xs font-bold text-white truncate">انگشتر نقره با نگین عقیق</h5>
      <span class="text-xs font-black text-amber-400 my-1">1,900 افغانی</span>
      <button onclick="addToCart('انگشتر نقره عقیق', 1900)" class="w-full py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-[11px] shadow">
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

// چت مستقیم درون مینی‌اپ
function openChatModal() {
  document.getElementById("chat-modal").classList.remove("hidden");
}

function closeChatModal() {
  document.getElementById("chat-modal").classList.add("hidden");
}

function startDirectChat() {
  if (activeShop) {
    document.getElementById("chat-target-name").innerText = activeShop.shopName;
  }
  openChatModal();
}

function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  if (!msg) return;

  const chatContainer = document.getElementById("chat-messages");
  chatContainer.innerHTML += `
    <div class="flex justify-end">
      <div class="bg-amber-500 text-slate-950 max-w-[80%] p-2.5 rounded-2xl rounded-tl-none text-xs font-medium shadow">
        ${msg}
      </div>
    </div>
  `;
  input.value = "";
  chatContainer.scrollTop = chatContainer.scrollHeight;
  if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
}

// مدیریت سبد خرید
function addToCart(title, price) {
  cart.push({ title, price });
  document.getElementById("cart-count").innerText = cart.length;
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
}

function openCartModal() {
  const container = document.getElementById("cart-items");
  if (cart.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-400 text-center py-4">سبد خرید شما خالی است.</p>`;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="flex justify-between items-center bg-white/5 p-2 rounded-xl text-xs">
        <span class="text-white">${item.title}</span>
        <span class="text-amber-400 font-bold">${item.price} افغانی</span>
      </div>
    `).join("");
  }
  const total = cart.reduce((acc, curr) => acc + curr.price, 0);
  document.getElementById("cart-total-price").innerText = `${total} افغانی`;
  document.getElementById("cart-modal").classList.remove("hidden");
}

function closeCartModal() {
  document.getElementById("cart-modal").classList.add("hidden");
}

function finalizeOrder() {
  const phone = document.getElementById("order-phone").value;
  if (!phone) {
    alert("لطفاً شماره تماس خود را وارد فرمایید.");
    return;
  }
  alert("فرمایش شما موفقانه ثبت و به دکاندار مارکت بهارسراب ارجاع گردید.");
  cart = [];
  document.getElementById("cart-count").innerText = "0";
  closeCartModal();
}

// خواندن دیپ‌لینک کانال
function checkDeepLinkParams() {
  const startParam = tg?.initDataUnsafe?.start_param;
  if (startParam?.startsWith('shop_')) {
    const shopId = parseInt(startParam.replace('shop_', ''));
    setTimeout(() => openShopModal(shopId), 400);
  }
}
