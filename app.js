// ============================================================
//  ISLAMIC GOOGLE — Premium App Engine v2
//  Powered by Suleiman Alhassan
// ============================================================

// ── SPLASH ──
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) { splash.classList.add('out'); setTimeout(() => splash.remove(), 800); }
  }, 2500);
});

// ── TOAST ──
function toast(msg, type='info', dur=3500) {
  const wrap = document.getElementById('toasts');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity='0'; el.style.transition='.3s'; setTimeout(()=>el.remove(),300); }, dur);
}

// ── MOBILE MENU ──
function toggleMenu() {
  const nav = document.getElementById('mobile-nav');
  if (nav) nav.classList.toggle('open');
}

// ── SEARCH ──
function triggerSearch() {
  const heroInput   = document.getElementById('hero-search-input');
  const headerInput = document.getElementById('header-search-input');
  const q = (heroInput?.value || headerInput?.value || '').trim();
  if (!q) { toast('Please type something to search!', 'error'); return; }
  if (heroInput)   heroInput.value = q;
  if (headerInput) headerInput.value = q;
  performSearch(q);
  const section = document.getElementById('search-section');
  if (section) setTimeout(() => section.scrollIntoView({behavior:'smooth', block:'start'}), 200);
}

// Sync search inputs
document.addEventListener('DOMContentLoaded', () => {
  const h = document.getElementById('hero-search-input');
  const hh = document.getElementById('header-search-input');
  if (h) h.addEventListener('keydown', e => { if (e.key==='Enter') triggerSearch(); });
  if (hh) hh.addEventListener('keydown', e => { if (e.key==='Enter') triggerSearch(); });

  loadDailyAyah();
  loadDailyHadith();
  initDhikr();
  checkReminderBanner();
});

// ── CATEGORY FILTER ──
let currentCat = 'all';
let currentQuery = '';

function filterCat(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.sf-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (currentQuery) {
    performSearch(currentQuery);
  } else {
    showCategoryBrowse(cat);
  }
}

function showCategoryBrowse(cat) {
  if (typeof INDEX === 'undefined' || !INDEX.length) {
    renderResults([], document.getElementById('results-container'));
    return;
  }
  const filtered = cat === 'all' ? INDEX : INDEX.filter(i => i.type === cat);
  renderResults(filtered, document.getElementById('results-container'));
  const section = document.getElementById('search-section');
  if (section) section.scrollIntoView({behavior:'smooth', block:'start'});
}

// Override renderResults from search.js
function renderResults(list, container) {
  if (!container) return;
  if (!list || !list.length) {
    container.innerHTML = `<div class="no-results"><div class="nr-icon">🔍</div><p>No results found. Try different keywords or browse a category.</p></div>`;
    return;
  }
  container.innerHTML = list.slice(0, 30).map(it => `
    <div class="result-card">
      <div class="rc-type">${it.type || 'Resource'}</div>
      <div class="rc-title">${it.title || ''}</div>
      <div class="rc-desc">${it.description || ''}</div>
      ${it.type === 'Lecture' && it.videoId ?
        `<iframe style="width:100%;height:220px;border:none;border-radius:10px;margin:8px 0" src="https://www.youtube.com/embed/${it.videoId}?rel=0" allowfullscreen loading="lazy"></iframe>` : ''}
      ${it.url ? `<a href="${it.url}" target="_blank" class="rc-link">Open Resource →</a>` : ''}
    </div>`).join('');
}

// ── DAILY AYAH ──
const AYAHS = [
  { ar:'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', en:'"And whoever relies upon Allah — then He is sufficient for him."', ref:'Qur\'an 65:3' },
  { ar:'إِنَّ مَعَ الْعُسْرِ يُسْرًا', en:'"Indeed, with hardship comes ease."', ref:'Qur\'an 94:6' },
  { ar:'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', en:'"And your Lord is going to give you, and you will be satisfied."', ref:'Qur\'an 93:5' },
  { ar:'فَاذْكُرُونِي أَذْكُرْكُمْ', en:'"So remember Me; I will remember you."', ref:'Qur\'an 2:152' },
  { ar:'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', en:'"Indeed, Allah is with the patient."', ref:'Qur\'an 2:153' },
  { ar:'وَقُل رَّبِّ زِدْنِي عِلْمًا', en:'"And say: My Lord, increase me in knowledge."', ref:'Qur\'an 20:114' },
  { ar:'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', en:'"Sufficient for us is Allah, and He is the best Disposer of affairs."', ref:'Qur\'an 3:173' },
  { ar:'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ', en:'"And He is with you wherever you are."', ref:'Qur\'an 57:4' },
  { ar:'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', en:'"For indeed, with hardship will be ease."', ref:'Qur\'an 94:5' },
  { ar:'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ', en:'"And do not despair of relief from Allah."', ref:'Qur\'an 12:87' },
];

let ayahIndex = 0;
function loadDailyAyah() {
  ayahIndex = new Date().getDate() % AYAHS.length;
  showAyah(ayahIndex);
}
function showAyah(i) {
  const a = AYAHS[i];
  const ar = document.getElementById('da-arabic');
  const en = document.getElementById('da-english');
  const ref = document.getElementById('da-ref');
  if (ar) ar.textContent = a.ar;
  if (en) en.textContent = a.en;
  if (ref) ref.textContent = a.ref;
}
function nextAyah() {
  ayahIndex = (ayahIndex + 1) % AYAHS.length;
  showAyah(ayahIndex);
}

// ── DAILY HADITH ──
const HADITHS = [
  { text:'"The best of you are those who learn the Qur\'an and teach it."', source:'Sahih al-Bukhari 5027' },
  { text:'"A Muslim is the one from whose tongue and hand other Muslims are safe."', source:'Sahih al-Bukhari 10' },
  { text:'"The strong man is not the one who wrestles, but the one who controls himself when angry."', source:'Sahih al-Bukhari 6114' },
  { text:'"Whoever believes in Allah and the Last Day should speak good or remain silent."', source:'Sahih al-Bukhari 6136' },
  { text:'"Do not be angry, and paradise is yours."', source:'al-Mu\'jam al-Awsat 2374' },
  { text:'"Smiling at your brother is an act of charity."', source:'Jami at-Tirmidhi 1956' },
  { text:'"The world is a prison for the believer and a paradise for the disbeliever."', source:'Sahih Muslim 2956' },
  { text:'"Whoever removes a worldly hardship from a believer, Allah will remove from him one of the hardships of the Day of Judgement."', source:'Sahih Muslim 2699' },
  { text:'"None of you truly believes until he loves for his brother what he loves for himself."', source:'Sahih al-Bukhari 13' },
  { text:'"The most beloved deed to Allah is the one done most regularly, even if it is small."', source:'Sahih al-Bukhari 6464' },
];

let hadithIndex = 0;
function loadDailyHadith() {
  hadithIndex = (new Date().getDate() + 3) % HADITHS.length;
  showHadith(hadithIndex);
}
function showHadith(i) {
  const h = HADITHS[i];
  const t = document.getElementById('hod-text');
  const s = document.getElementById('hod-source');
  if (t) t.textContent = h.text;
  if (s) s.textContent = '— ' + h.source;
}
function nextHadith() {
  hadithIndex = (hadithIndex + 1) % HADITHS.length;
  showHadith(hadithIndex);
}

// ── DHIKR COUNTER ──
const DHIKRS = {
  subhanallah:    { ar:'سُبْحَانَ اللَّهِ',          en:'Glory be to Allah',          target:33 },
  alhamdulillah:  { ar:'الْحَمْدُ لِلَّهِ',           en:'All praise is due to Allah', target:33 },
  allahuakbar:    { ar:'اللَّهُ أَكْبَرُ',            en:'Allah is the Greatest',      target:34 },
  astaghfirullah: { ar:'أَسْتَغْفِرُ اللَّهَ',        en:'I seek forgiveness from Allah', target:100 },
  lailahaillallah:{ ar:'لَا إِلَٰهَ إِلَّا اللَّهُ', en:'There is no god but Allah',  target:100 },
};

let dhikrKey = 'subhanallah';
let dhikrCount = 0;

function initDhikr() {
  const saved = localStorage.getItem('dhikr_state');
  if (saved) {
    try {
      const s = JSON.parse(saved);
      dhikrKey   = s.key   || 'subhanallah';
      dhikrCount = s.count || 0;
    } catch(e) {}
  }
  updateDhikrUI();
}

function setDhikr(btn, key) {
  dhikrKey   = key;
  dhikrCount = 0;
  document.querySelectorAll('.dtab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateDhikrUI();
  saveDhikr();
}

function countDhikr() {
  const d = DHIKRS[dhikrKey];
  dhikrCount++;
  if (dhikrCount === d.target) {
    toast(`✅ ${d.target} ${dhikrKey === 'subhanallah' ? 'Subhanallah' : dhikrKey === 'alhamdulillah' ? 'Alhamdulillah' : 'Dhikr'} complete! MashaAllah 🤲`, 'gold', 4000);
  }
  if (dhikrCount > d.target) dhikrCount = 0;
  updateDhikrUI();
  saveDhikr();
  const el = document.getElementById('dhikr-count');
  if (el) { el.classList.add('bump'); setTimeout(() => el.classList.remove('bump'), 150); }
}

function resetDhikr() {
  dhikrCount = 0;
  updateDhikrUI();
  saveDhikr();
}

function updateDhikrUI() {
  const d = DHIKRS[dhikrKey] || DHIKRS.subhanallah;
  const pct = Math.min((dhikrCount / d.target) * 100, 100);
  const ar  = document.getElementById('dhikr-arabic');
  const mn  = document.getElementById('dhikr-meaning');
  const tg  = document.getElementById('dhikr-target');
  const ct  = document.getElementById('dhikr-count');
  const fill= document.getElementById('dp-fill');
  const txt = document.getElementById('dp-text');
  if (ar)   ar.textContent   = d.ar;
  if (mn)   mn.textContent   = d.en;
  if (tg)   tg.textContent   = `Target: ${d.target} times`;
  if (ct)   ct.textContent   = dhikrCount;
  if (fill) fill.style.width = pct + '%';
  if (txt)  txt.textContent  = `${dhikrCount} / ${d.target}`;
}

function saveDhikr() {
  localStorage.setItem('dhikr_state', JSON.stringify({ key: dhikrKey, count: dhikrCount }));
}

// ── DAILY NOTIFICATIONS ──
function checkReminderBanner() {
  if (Notification && Notification.permission === 'granted') {
    const banner = document.getElementById('reminder-banner');
    if (banner) banner.style.display = 'none';
  }
}

function requestNotifications() {
  if (!('Notification' in window)) {
    toast('Your browser does not support notifications.', 'error');
    return;
  }
  Notification.requestPermission().then(perm => {
    if (perm === 'granted') {
      toast('✅ Daily reminders enabled! JazakAllah Khayr 🤲', 'success', 4000);
      const banner = document.getElementById('reminder-banner');
      if (banner) banner.style.display = 'none';
      scheduleDailyReminder();
    } else {
      toast('Notifications blocked. You can enable them in browser settings.', 'error');
    }
  });
}

function scheduleDailyReminder() {
  const ayah = AYAHS[new Date().getDate() % AYAHS.length];
  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification('🌙 Islamic Google — Daily Reminder', {
        body: ayah.en + ' — ' + ayah.ref,
        icon: 'https://i.imgur.com/8KQbDmJ.png',
      });
    }
  }, 5000);
}
