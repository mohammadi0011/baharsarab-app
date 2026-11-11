// ۱. دسته‌بندی‌ها و اطلاعات اسلایدر ۵ ثانیه‌ای (کاملاً هماهنگ با دکمه‌های ربات)
const heroCategories = [
  { 
    id: "gold", 
    title: "راسته طلا و نقره", 
    subtitle: "جدیدترین مدل‌های طلای ۲۱ عیار و نقره اصیل", 
    tag: "طلا و نقره", 
    bgDark: "from-[#2b1f0c] to-[#000000]", 
    bgLight: "from-[#fff3d6] to-[#f5f5f7]", 
    icon: "💍" 
  },
  { 
    id: "jewelry", 
    title: "زیورآلات و بدلیجات", 
    subtitle: "سنگ‌های قیمتی، عقیق، فیروزه و بدلیجات لوکس", 
    tag: "زیورآلات", 
    bgDark: "from-[#20102b] to-[#000000]", 
    bgLight: "from-[#f4e8ff] to-[#f5f5f7]", 
    icon: "✨" 
  },
  { 
    id: "clothing", 
    title: "پوشاک و لباس سنتی", 
    subtitle: "بزرگ‌ترین بورس گندهای هزارگی، لباس مجلسی و مردانه", 
    tag: "پوشاک", 
    bgDark: "from-[#2d1118] to-[#000000]", 
    bgLight: "from-[#ffe8ec] to-[#f5f5f7]", 
    icon: "👗" 
  },
  { 
    id: "shoes", 
    title: "کیف و کفش زنانه و مردانه", 
    subtitle: "شیک‌ترین ترندهای فصلی، بوت، بکس و چپلی", 
    tag: "کیف و کفش", 
    bgDark: "from-[#20102b] to-[#000000]", 
    bgLight: "from-[#f4e8ff] to-[#f5f5f7]", 
    icon: "👠" 
  },
  { 
    id: "cosmetics", 
    title: "عطر و لوازم آرایشی", 
    subtitle: "برندهای معتبر و ادکلن‌های اصل فرانسوی", 
    tag: "آرایشی", 
    bgDark: "from-[#2b1020] to-[#000000]", 
    bgLight: "from-[#ffe8f3] to-[#f5f5f7]", 
    icon: "💄" 
  },
  { 
    id: "currency", 
    title: "صرافی و حواله‌جات", 
    subtitle: "حواله‌جات سریع به تمام جهان و تبادله اسعار در تهکوی", 
    tag: "صرافی و حواله‌جات", 
    bgDark: "from-[#0c2417] to-[#000000]", 
    bgLight: "from-[#e4f7eb] to-[#f5f5f7]", 
    icon: "💱" 
  },
  { 
    id: "cargo", 
    title: "کارگو و انتقال اموال", 
    subtitle: "ارسال سریع به استرالیا، اروپا، کانادا و ولایات", 
    tag: "کارگو", 
    bgDark: "from-[#0f1d30] to-[#000000]", 
    bgLight: "from-[#e6f0ff] to-[#f5f5f7]", 
    icon: "✈️" 
  }
];

// ۲. دکان‌های پیش‌فرض مارکت بهارسراب (منطبق دقیق بر ۷ صنف و طبقات ربات)
const defaultShopsData = [
  // --- طبقه همکف (طلا، زیورآلات و آرایشی) ---
  { id: 1, shopName: "زرگری و طلای نگین برچی", shopNumber: "دکان ۱۲", floor: "طبقه همکف", category: "طلا و نقره", phone: "0799000111", whatsapp: "93799000111" },
  { id: 2, shopName: "طلای ۲۱ عیار سلطانی", shopNumber: "دکان ۱۴", floor: "طبقه همکف", category: "طلا و نقره", phone: "0799000112", whatsapp: "93799000112" },
  { id: 3, shopName: "نقره و عقیق‌سرای خاتم کابل", shopNumber: "دکان ۱۵", floor: "طبقه همکف", category: "زیورآلات", phone: "0799000113", whatsapp: "93799000113" },
  { id: 4, shopName: "عطر و ادکلن پاریس سنتر", shopNumber: "دکان ۱۸", floor: "طبقه همکف", category: "آرایشی", phone: "0799000114", whatsapp: "93799000114" },
  { id: 5, shopName: "گالری ساعت و زیورآلات لوکس زمان", shopNumber: "دکان ۲۰", floor: "طبقه همکف", category: "زیورآلات", phone: "0799000115", whatsapp: "93799000115" },

  // --- طبقه اول (بورس گند، لباس زنانه و کیف و کفش) ---
  { id: 6, shopName: "گند و لباس سنتی شاهانه", shopNumber: "دکان ۲۲", floor: "طبقه اول", category: "پوشاک", phone: "0788000222", whatsapp: "93788000222" },
  { id: 7, shopName: "گند افغانی نگین هزاره", shopNumber: "دکان ۲۴", floor: "طبقه اول", category: "پوشاک", phone: "0788000223", whatsapp: "93788000223" },
  { id: 8, shopName: "بکس و چپلی کابل شیک", shopNumber: "دکان ۲۶", floor: "طبقه اول", category: "کیف و کفش", phone: "0788000224", whatsapp: "93788000224" },
  { id: 9, shopName: "حجاب و چادرسرای بانو", shopNumber: "دکان ۲۸", floor: "طبقه اول", category: "پوشاک", phone: "0788000225", whatsapp: "93788000225" },
  { id: 10, shopName: "بوت و کفش مجلسی نگار", shopNumber: "دکان ۳۰", floor: "طبقه اول", category: "کیف و کفش", phone: "0788000226", whatsapp: "93788000226" },

  // --- طبقه دوم (پوشاک مردانه و اطفال) ---
  { id: 11, shopName: "کت و شلوار و دریشی آرا", shopNumber: "دکان ۴۰", floor: "طبقه دوم", category: "پوشاک", phone: "0777000333", whatsapp: "93777000333" },
  { id: 12, shopName: "پوشاک و اسباب‌بازی کودک", shopNumber: "دکان ۴۲", floor: "طبقه دوم", category: "پوشاک", phone: "0777000334", whatsapp: "93777000334" },

  // --- تهکوی / زیرزمین (صرافی و کارگو) ---
  { id: 13, shopName: "صرافی برچی اکسپرس", shopNumber: "دکان ۰۲", floor: "تهکوی (زیرزمین)", category: "صرافی و حواله‌جات", phone: "0700000444", whatsapp: "93700000444" },
  { id: 14, shopName: "کارگو بین‌المللی افغان", shopNumber: "دکان ۰۴", floor: "تهکوی (زیرزمین)", category: "کارگو", phone: "0700000445", whatsapp: "93700000445" }
];