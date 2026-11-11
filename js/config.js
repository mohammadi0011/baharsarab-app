// دسته‌بندی‌ها و اطلاعات اسلایدر ۵ ثانیه‌ای
const heroCategories = [
  { id: "gold", title: "راسته طلا و نقره", subtitle: "جدیدترین مدل‌های طلای ۲۱ عیار و نقره اصیل", tag: "طلا و نقره", bgDark: "from-[#2b1f0c] to-[#000000]", bgLight: "from-[#fff3d6] to-[#f5f5f7]", icon: "💍" },
  { id: "clothing", title: "لباس و گند سنتی", subtitle: "بزرگ‌ترین بورس دست‌دوز و گندهای هزارگی", tag: "لباس سنتی", bgDark: "from-[#2d1118] to-[#000000]", bgLight: "from-[#ffe8ec] to-[#f5f5f7]", icon: "👗" },
  { id: "currency", title: "صرافی‌ها و تبادله اسعار", subtitle: "حواله‌جات سریع و تبدیل دالر و افغانی در تهکوی", tag: "صرافی", bgDark: "from-[#0c2417] to-[#000000]", bgLight: "from-[#e4f7eb] to-[#f5f5f7]", icon: "💱" },
  { id: "shoes", title: "بوت، کیف و بکس زنانه", subtitle: "ترندهای لوکس فصلی و مجلسی", tag: "بوت و کیف", bgDark: "from-[#20102b] to-[#000000]", bgLight: "from-[#f4e8ff] to-[#f5f5f7]", icon: "👠" },
  { id: "cosmetics", title: "عطر و لوازم آرایشی", subtitle: "برندهای معتبر فرانسوی و ادکلن‌های اصل", tag: "آرایشی", bgDark: "from-[#2b1020] to-[#000000]", bgLight: "from-[#ffe8f3] to-[#f5f5f7]", icon: "💄" },
  { id: "cargo", title: "کارگو و انتقال اموال", subtitle: "ارسال سریع به استرالیا، اروپا و کانادا", tag: "کارگو", bgDark: "from-[#0f1d30] to-[#000000]", bgLight: "from-[#e6f0ff] to-[#f5f5f7]", icon: "✈️" }
];

// دکان‌های پیش‌فرض مارکت بهارسراب
const defaultShopsData = [
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