let heroSlideIndex = 0;
let currentFilter = null;

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
      <span class="text-[10px] text-[#0071e3] mt-2 flex items-center gap-1 font-bold">مشاهده دکان‌های این راسته ←</span>
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

function toggleSideMenu() {
  document.getElementById("side-drawer").classList.toggle("hidden");
}

function buildCategorySideMenu() {
  const list = document.getElementById("categories-menu-list");
  list.innerHTML = `
    <button onclick="clearCategoryFilter(); toggleSideMenu();" class="w-full text-right py-2 px-3 rounded-xl text-xs flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 font-bold">
      <span>نمایش همه راسته‌ها</span>
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
  document.getElementById("clear-filter-btn").innerText = `راسته: ${tag} ✕`;
  renderDynamicFloors();

  // اسکرول نرم به سمت ویترین دکان‌ها
  document.getElementById("floors-container")?.scrollIntoView({ behavior: 'smooth' });
}

function clearCategoryFilter() {
  currentFilter = null;
  document.getElementById("clear-filter-btn").classList.add("hidden");
  renderDynamicFloors();
}