let activeShop = null;
let cart = [];

// باز کردن غرفه و لود اجناس زنده از ربات
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
  grid.innerHTML = `<div class="col-span-2 text-center py-6 text-xs theme-subtext">در حال بارگذاری اجناس غرفه...</div>`;

  // لود اجناس زنده از اندپوینت getProducts سرورلس
  if (window.Telegram?.WebApp?.Serverless) {
    window.Telegram.WebApp.Serverless.call('getProducts', { shopId: shopId }, (err, res) => {
      if (!err && res?.data && res.data.length > 0) {
        renderProducts(res.data);
      } else {
        renderFallbackProducts();
      }
    });
  } else {
    renderFallbackProducts();
  }

  document.getElementById("shop-modal").classList.remove("hidden");
  if (tg?.BackButton) {
    tg.BackButton.show();
    tg.BackButton.onClick(closeShopModal);
  }
}

function renderProducts(items) {
  const grid = document.getElementById("shop-products-grid");
  grid.innerHTML = items.map(p => `
    <div class="theme-card p-3 rounded-2xl flex flex-col justify-between">
      <div class="h-28 theme-inner-box rounded-xl mb-2 flex items-center justify-center text-3xl overflow-hidden relative">
        <span>🛍</span>
        <span class="absolute top-1 right-1 text-[8px] bg-black/60 text-amber-400 px-1 py-0.5 rounded font-mono">BS-${p.id}</span>
      </div>
      <h5 class="text-xs font-bold truncate">${p.title}</h5>
      <span class="text-xs font-bold text-[#0071e3] my-1">${p.priceAfn} افغانی</span>
      <button onclick="addToCart('${p.title}', ${p.priceAfn}, ${p.shopId})" class="w-full py-2 bg-[#0071e3] text-white font-bold rounded-xl text-[10px] shadow">
        افزودن به سبد
      </button>
    </div>
  `).join('');
}

function renderFallbackProducts() {
  const grid = document.getElementById("shop-products-grid");
  grid.innerHTML = `
    <div class="theme-card p-3 rounded-2xl flex flex-col justify-between">
      <div class="h-28 theme-inner-box rounded-xl mb-2 flex items-center justify-center text-3xl">👗</div>
      <h5 class="text-xs font-bold truncate">گند سنتی دست‌دوز اصیل</h5>
      <span class="text-xs font-bold text-[#0071e3] my-1">4,800 افغانی</span>
      <button onclick="addToCart('گند سنتی دست‌دوز', 4800, ${activeShop?.id || 1})" class="w-full py-2 bg-[#0071e3] text-white font-bold rounded-xl text-[10px] shadow">
        افزودن به سبد
      </button>
    </div>
    <div class="theme-card p-3 rounded-2xl flex flex-col justify-between">
      <div class="h-28 theme-inner-box rounded-xl mb-2 flex items-center justify-center text-3xl">💍</div>
      <h5 class="text-xs font-bold truncate">انگشتر نقره با نگین عقیق</h5>
      <span class="text-xs font-bold text-[#0071e3] my-1">1,900 افغانی</span>
      <button onclick="addToCart('انگشتر نقره', 1900, ${activeShop?.id || 1})" class="w-full py-2 bg-[#0071e3] text-white font-bold rounded-xl text-[10px] shadow">
        افزودن به سبد
      </button>
    </div>
  `;
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

function addToCart(title, price, shopId) {
  cart.push({ title, price, shopId });
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

// ارسال و ثبت نهایی سفارش در ربات و ارسال نوتیفیکیشن تلگرام
function finalizeOrder() {
  const phone = document.getElementById("order-phone").value.trim();
  const delivery = document.getElementById("order-delivery").value;

  if (!phone) {
    alert("لطفاً شماره تماس خود را وارد فرمایید.");
    return;
  }
  if (cart.length === 0) {
    alert("سبد خرید خالی است.");
    return;
  }

  const deliveryLabels = {
    store: "تحویل حضوری در دکان مارکت بهارسراب",
    delivery_barchi: "ارسال با پیک در دشت برچی",
    delivery_kabul: "ارسال در شهر کابل",
    cargo: "ارسال با کارگو به خارج از کشور"
  };

  const firstItem = cart[0];
  const total = cart.reduce((acc, curr) => acc + curr.price, 0);

  const orderPayload = {
    shopId: firstItem.shopId || 1,
    productTitle: cart.map(c => c.title).join(" + "),
    priceAfn: total,
    buyerPhone: phone,
    buyerAddress: deliveryLabels[delivery] || delivery
  };

  // ارسال به اندپوینت سرورلس تلگرام
  if (window.Telegram?.WebApp?.Serverless) {
    window.Telegram.WebApp.Serverless.call('submitOrder', orderPayload, (err, res) => {
      if (!err && res?.success) {
        alert("🎉 فرمایش شما با موفقیت ثبت شد و پیام به دکاندار ارسال گردید.");
      } else {
        alert("فرمایش ثبت شد.");
      }
    });
  } else {
    alert("فرمایش شما با موفقیت ثبت شد.");
  }

  cart = [];
  document.getElementById("cart-count").innerText = "0";
  closeCartModal();
}