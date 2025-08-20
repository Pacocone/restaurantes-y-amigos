// ⬇️ Config de Firebase — RELLENA TU apiKey (y verifica storageBucket si difiere en tu consola)
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDULX4PkHaJR35pFtxcNlUKzXJ3lMiJBjM",
  authDomain: "restaurantworld-86f53.firebaseapp.com",
  projectId: "restaurantworld-86f53",
  storageBucket: "restaurantworld-86f53.firebasestorage.app",
  messagingSenderId: "459185197746",
  appId: "1:459185197746:web:327c97c4a64f1757b56fab",
  measurementId: "G-LKKH1T8ZP7"
}; 
  

// === Extraído de index7.html ===

(function(){
      // Usa window.firebaseConfig. Si el usuario pegó const firebaseConfig, lo recogemos aquí.
      if (typeof window.firebaseConfig === 'undefined' && typeof firebaseConfig !== 'undefined') {
        window.firebaseConfig = firebaseConfig;
      }

      if (window.firebase && window.firebaseConfig && window.firebaseConfig.apiKey) {
        const app     = firebase.initializeApp(window.firebaseConfig);
        const auth    = firebase.auth();
        const db      = firebase.firestore();
        const storage = firebase.storage();
        window._fb = { app, auth, db, storage };
        console.log('✅ Firebase inicializado', { apps: firebase.apps.length, projectId: window.firebaseConfig.projectId });
        window._fb.auth.onAuthStateChanged(function(user) {
  if (user) {
    // Usuario autenticado, oculta el registro
    document.getElementById('registroModal').style.display = 'none';
    // Guarda el usuario en localStorage si quieres
    window._fb.db.collection("usuarios").doc(user.uid).get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        localStorage.setItem('usuarioRegistrado', JSON.stringify({ email: user.email, username: data.username, uid: user.uid }));
        cargarUsuariosDesdeFirestore();
      }
    });
  } else {
    // No autenticado, muestra el registro
    document.getElementById('registroModal').style.display = 'flex';
  }
});
      } else {
        console.warn('⚠️ Falta firebaseConfig o no cargó Firebase.');
        window._fb = null;
      }
    })();

// === Extraído de index7.html ===

// Mapeos de países y ciudades para traducción
const countryMap = {
  'spain': { es: 'España', en: 'Spain', fr: 'Espagne', de: 'Spanien', ar: 'إسبانيا', zh: '西班牙' },
  'france': { es: 'Francia', en: 'France', fr: 'France', de: 'Frankreich', ar: 'فرنسا', zh: '法国' },
  'italy': { es: 'Italia', en: 'Italy', fr: 'Italie', de: 'Italien', ar: 'إيطاليا', zh: '意大利' },
  'england': { es: 'Inglaterra', en: 'England', fr: 'Angleterre', de: 'England', ar: 'إنجلترا', zh: '英格兰' },
  'great britain': { es: 'Reino Unido', en: 'Great Britain', fr: 'Grande-Bretagne', de: 'Großbritannien', ar: 'بريطانيا العظمى', zh: '大不列颠' },
  'united kingdom': { es: 'Reino Unido', en: 'United Kingdom', fr: 'Royaume-Uni', de: 'Vereinigtes Königreich', ar: 'المملكة المتحدة', zh: '英国' },
  'germany': { es: 'Alemania', en: 'Germany', fr: 'Allemagne', de: 'Deutschland', ar: 'ألمانيا', zh: '德国' },
  'china': { es: 'China', en: 'China', fr: 'Chine', de: 'China', ar: 'الصين', zh: '中国' },
  'japan': { es: 'Japón', en: 'Japan', fr: 'Japon', de: 'Japan', ar: 'اليابان', zh: '日本' },
  'russia': { es: 'Rusia', en: 'Russia', fr: 'Russie', de: 'Russland', ar: 'روسيا', zh: '俄罗斯' },
  'uae': { es: 'Emiratos Árabes', en: 'UAE', fr: 'Émirats arabes', de: 'VAE', ar: 'الإمارات', zh: '阿联酋' }
};
const cityMap = {
  'madrid': { es: 'Madrid', en: 'Madrid', fr: 'Madrid', de: 'Madrid', ar: 'مدريد', zh: '马德里' },
  'barcelona': { es: 'Barcelona', en: 'Barcelona', fr: 'Barcelone', de: 'Barcelona', ar: 'برشلونة', zh: '巴塞罗那' },
  'paris': { es: 'París', en: 'Paris', fr: 'Paris', de: 'Paris', ar: 'باريس', zh: '巴黎' },
  'rome': { es: 'Roma', en: 'Rome', fr: 'Rome', de: 'Rom', ar: 'روما', zh: '罗马' },
  'london': { es: 'Londres', en: 'London', fr: 'Londres', de: 'London', ar: 'لندن', zh: '伦敦' }
};
function normalize(str) {
  return str.trim().toLowerCase().replace(/[áàäâ]/g,'a').replace(/[éèëê]/g,'e').replace(/[íìïî]/g,'i').replace(/[óòöô]/g,'o').replace(/[úùüû]/g,'u');
}
function translateCountry(str, lang) {
  let key = normalize(str);
  for (let k in countryMap) {
    if (key === k || key === normalize(countryMap[k].es) || key === normalize(countryMap[k].en) || key === normalize(countryMap[k].fr) || key === normalize(countryMap[k].de) || key === normalize(countryMap[k].ar) || key === normalize(countryMap[k].zh)) {
      return countryMap[k][lang] || str;
    }
  }
  return str;
}
function translateCity(str, lang) {
  let key = normalize(str);
  for (let k in cityMap) {
    if (key === k || key === normalize(cityMap[k].es) || key === normalize(cityMap[k].en) || key === normalize(cityMap[k].fr) || key === normalize(cityMap[k].de) || key === normalize(cityMap[k].ar) || key === normalize(cityMap[k].zh)) {
      return cityMap[k][lang] || str;
    }
  }
  return str;
}
const textos = {
  es: { 
    tabs: ['🍽️ Añadir Visita','📊 Resumen','📜 Historial','🍕🍣🍔 Explorar','👫 Amigos'],
    addTitle: '🍽️ Añadir visita',
    resumenTitle: '📊 Resumen de visitas',
    historialTitle: '📜 Historial de visitas',
    explorarTitle: '🍕🍣🍔 Explorar restaurantes',
    amigosTitle: '👫 Amigos',
    lblRestaurante: '🍴 Nombre restaurante:',
    lblFecha: '📅 Fecha de la visita:',
    lblCiudad: '🏙️ Ciudad:',
    lblPais: '🌍 País:',
    lblComensales: '👥 Número de comensales:',
    lblTotal: '💸 Gasto total:',
    lblAvgPrice: '💰 Precio medio por comensal:',
    lblValoracion: '⭐ Valoración:',
    lblReseña: '📝 Reseña:',
    lblTicket: '🧾 Subir ticket:',
    btnGuardar: '💾 Guardar visita',
    lblYear: 'Año:',
    selectCiudad: 'Selecciona ciudad',
    selectPais: 'Selecciona país',
    selectMoneda: 'Selecciona moneda',
    selectYear: 'Todos los años',
    placeholderRestaurante: 'Introduce el nombre',
    placeholderCiudad: 'Introduce la ciudad',
    placeholderPais: 'Introduce el país',
    placeholderReseña: 'Escribe tu reseña',
    lblHistRest: 'Restaurante:',
    lblHistCiudad: 'Ciudad:',
    lblHistPais: 'País:',
    lblExpRest: 'Restaurante:',
    lblExpCiudad: 'Ciudad:',
    lblExpPais: 'País:',
    lblExpUsuario: 'Usuario:',
    lblAmigosUsuario: 'Usuario:',
    lblAmigosCiudad: 'Ciudad:',
    lblAmigosPais: 'País:'
  },
  en: { 
    tabs: ['🍽️ Add Visit','📊 Summary','📜 History','🍕🍣🍔 Explore','👫 Friends'],
    addTitle: '🍽️ Add visit',
    resumenTitle: '📊 Visit summary',
    historialTitle: '📜 Visit history',
    explorarTitle: '🍕🍣🍔 Explore restaurants',
    amigosTitle: '👫 Friends',
    lblRestaurante: '🍴 Restaurant name:',
    lblFecha: '📅 Visit date:',
    lblCiudad: '🏙️ City:',
    lblPais: '🌍 Country:',
    lblComensales: '👥 Number of diners:',
    lblTotal: '💸 Total spent:',
    lblAvgPrice: '💰 Average price per diner:',
    lblValoracion: '⭐ Rating:',
    lblReseña: '📝 Review:',
    lblTicket: '🧾 Upload receipt:',
    btnGuardar: '💾 Save visit',
    lblYear: 'Year:',
    selectCiudad: 'Select city',
    selectPais: 'Select country',
    selectMoneda: 'Select currency',
    selectYear: 'All years',
    placeholderRestaurante: 'Enter name',
    placeholderCiudad: 'Enter city',
    placeholderPais: 'Enter country',
    placeholderReseña: 'Write your review',
    lblHistRest: 'Restaurant:',
    lblHistCiudad: 'City:',
    lblHistPais: 'Country:',
    lblExpRest: 'Restaurant:',
    lblExpCiudad: 'City:',
    lblExpPais: 'Country:',
    lblExpUsuario: 'User:',
    lblAmigosUsuario: 'User:',
    lblAmigosCiudad: 'City:',
    lblAmigosPais: 'Country:'
  },
  fr: { 
    tabs: ['🍽️ Ajouter visite','📊 Résumé','📜 Historique','🍕🍣🍔 Explorer','👫 Amis'],
    addTitle: '🍽️ Ajouter visite',
    resumenTitle: '📊 Résumé des visites',
    historialTitle: '📜 Historique des visites',
    explorarTitle: '🍕🍣🍔 Explorer les restaurants',
    amigosTitle: '👫 Amis',
    lblRestaurante: '🍴 Nom du restaurant:',
    lblFecha: '📅 Date de la visite:',
    lblCiudad: '🏙️ Ville:',
    lblPais: '🌍 Pays:',
    lblComensales: '👥 Nombre de convives:',
    lblTotal: '💸 Dépense totale:',
    lblAvgPrice: '💰 Prix moyen par convive:',
    lblValoracion: '⭐ Note:',
    lblReseña: '📝 Avis:',
    lblTicket: '🧾 Télécharger le ticket:',
    btnGuardar: '💾 Enregistrer la visite',
    lblYear: 'Année:',
    selectCiudad: 'Sélectionner ville',
    selectPais: 'Sélectionner pays',
    selectMoneda: 'Sélectionner monnaie',
    selectYear: 'Toutes les années',
    placeholderRestaurante: 'Entrez le nom',
    placeholderCiudad: 'Entrez la ville',
    placeholderPais: 'Entrez le pays',
    placeholderReseña: 'Écrivez votre avis',
    lblHistRest: 'Restaurant:',
    lblHistCiudad: 'Ville:',
    lblHistPais: 'Pays:',
    lblExpRest: 'Restaurant:',
    lblExpCiudad: 'Ville:',
    lblExpPais: 'Pays:',
    lblExpUsuario: 'Utilisateur:',
    lblAmigosUsuario: 'Utilisateur:',
    lblAmigosCiudad: 'Ville:',
    lblAmigosPais: 'Pays:'
  },
  de: { 
    tabs: ['🍽️ Besuch hinzufügen','📊 Übersicht','📜 Historie','🍕🍣🍔 Entdecken','👫 Freunde'],
    addTitle: '🍽️ Besuch hinzufügen',
    resumenTitle: '📊 Besuchsübersicht',
    historialTitle: '📜 Besuchshistorie',
    explorarTitle: '🍕🍣🍔 Restaurants entdecken',
    amigosTitle: '👫 Freunde',
    lblRestaurante: '🍴 Restaurantname:',
    lblFecha: '📅 Besuchsdatum:',
    lblCiudad: '🏙️ Stadt:',
    lblPais: '🌍 Land:',
    lblComensales: '👥 Anzahl Gäste:',
    lblTotal: '💸 Gesamtausgabe:',
    lblAvgPrice: '💰 Durchschnittspreis pro Gast:',
    lblValoracion: '⭐ Bewertung:',
    lblReseña: '📝 Rezension:',
    lblTicket: '🧾 Beleg hochladen:',
    btnGuardar: '💾 Besuch speichern',
    lblYear: 'Jahr:',
    selectCiudad: 'Stadt wählen',
    selectPais: 'Land wählen',
    selectMoneda: 'Währung wählen',
    selectYear: 'Alle Jahre',
    placeholderRestaurante: 'Name eingeben',
    placeholderCiudad: 'Stadt eingeben',
    placeholderPais: 'Land eingeben',
    placeholderReseña: 'Rezension schreiben',
    lblHistRest: 'Restaurant:',
    lblHistCiudad: 'Stadt:',
    lblHistPais: 'Land:',
    lblExpRest: 'Restaurant:',
    lblExpCiudad: 'Stadt:',
    lblExpPais: 'Land:',
    lblExpUsuario: 'Benutzer:',
    lblAmigosUsuario: 'Benutzer:',
    lblAmigosCiudad: 'Stadt:',
    lblAmigosPais: 'Land:'
  },
  ar: { 
    tabs: ['🍽️ إضافة زيارة','📊 ملخص','📜 تاريخ','🍕🍣🍔 استكشاف','👫 أصدقاء'],
    addTitle: '🍽️ إضافة زيارة',
    resumenTitle: '📊 ملخص الزيارات',
    historialTitle: '📜 تاريخ الزيارات',
    explorarTitle: '🍕🍣🍔 استكشاف المطاعم',
    amigosTitle: '👫 أصدقاء',
    lblRestaurante: '🍴 اسم المطعم:',
    lblFecha: '📅 تاريخ الزيارة:',
    lblCiudad: '🏙️ المدينة:',
    lblPais: '🌍 الدولة:',
    lblComensales: '👥 عدد الأشخاص:',
    lblTotal: '💸 إجمالي الإنفاق:',
    lblAvgPrice: '💰 متوسط السعر لكل شخص:',
    lblValoracion: '⭐ التقييم:',
    lblReseña: '📝 مراجعة:',
    lblTicket: '🧾 رفع الإيصال:',
    btnGuardar: '💾 حفظ الزيارة',
    lblYear: 'السنة:',
    selectCiudad: 'اختر المدينة',
    selectPais: 'اختر الدولة',
    selectMoneda: 'اختر العملة',
    selectYear: 'كل السنوات',
    placeholderRestaurante: 'أدخل الاسم',
    placeholderCiudad: 'أدخل المدينة',
    placeholderPais: 'أدخل الدولة',
    placeholderReseña: 'اكتب مراجعتك',
    lblHistRest: 'مطعم:',
    lblHistCiudad: 'مدينة:',
    lblHistPais: 'دولة:',
    lblExpRest: 'مطعم:',
    lblExpCiudad: 'مدينة:',
    lblExpPais: 'دولة:',
    lblExpUsuario: 'مستخدم:',
    lblAmigosUsuario: 'مستخدم:',
    lblAmigosCiudad: 'مدينة:',
    lblAmigosPais: 'دولة:'
  },
  zh: { 
    tabs: ['🍽️ 添加访问','📊 摘要','📜 历史','🍕🍣🍔 探索','👫 朋友'],
    addTitle: '🍽️ 添加访问',
    resumenTitle: '📊 访问摘要',
    historialTitle: '📜 访问历史',
    explorarTitle: '🍕🍣🍔 探索餐厅',
    amigosTitle: '👫 朋友',
    lblRestaurante: '🍴 餐厅名称:',
    lblFecha: '📅 访问日期:',
    lblCiudad: '🏙️ 城市:',
    lblPais: '🌍 国家:',
    lblComensales: '👥 人数:',
    lblTotal: '💸 总花费:',
    lblAvgPrice: '💰 人均价格:',
    lblValoracion: '⭐ 评分:',
    lblReseña: '📝 评论:',
    lblTicket: '🧾 上传票据:',
    btnGuardar: '💾 保存访问',
    lblYear: '年份:',
    selectCiudad: '选择城市',
    selectPais: '选择国家',
    selectMoneda: '选择货币',
    selectYear: '所有年份',
    placeholderRestaurante: '输入名称',
    placeholderCiudad: '输入城市',
    placeholderPais: '输入国家',
    placeholderReseña: '写下你的评论',
    lblHistRest: '餐厅:',
    lblHistCiudad: '城市:',
    lblHistPais: '国家:',
    lblExpRest: '餐厅:',
    lblExpCiudad: '城市:',
    lblExpPais: '国家:',
    lblExpUsuario: '用户:',
    lblAmigosUsuario: '用户:',
    lblAmigosCiudad: '城市:',
    lblAmigosPais: '国家:'
  }
};
// Idiomas y banderas
const idiomas = [
  { code: 'es', logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ea-1f1f8.svg', label: 'Español' },
  { code: 'en', logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1ec-1f1e7.svg', label: 'English' },
  { code: 'fr', logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1eb-1f1f7.svg', label: 'Français' },
  { code: 'de', logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1e9-1f1ea.svg', label: 'Deutsch' },
  { code: 'ar', logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1e6-1f1ea.svg', label: 'العربية' },
  { code: 'zh', logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f1e8-1f1f3.svg', label: '中文' }
];
// Traducciones principales


// Monedas ampliadas
const monedas = [
  { code: '€', label: { es: 'Euro', en: 'Euro', fr: 'Euro', de: 'Euro', ar: 'يورو', zh: '欧元' }, logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/20ac.svg' },
  { code: '$', label: { es: 'Dólar USA', en: 'US Dollar', fr: 'Dollar US', de: 'US-Dollar', ar: 'دولار أمريكي', zh: '美元' }, logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f4b5.svg' },
  { code: '£', label: { es: 'Libra esterlina', en: 'Pound Sterling', fr: 'Livre sterling', de: 'Pfund Sterling', ar: 'جنيه إسترليني', zh: '英镑' }, logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f4b7.svg' },
  { code: 'AED', label: { es: 'Dirham', en: 'Dirham', fr: 'Dirham', de: 'Dirham', ar: 'درهم', zh: '迪拉姆' }, logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f4b6.svg' },
  { code: '¥', label: { es: 'Yen japonés', en: 'Japanese Yen', fr: 'Yen japonais', de: 'Japanischer Yen', ar: 'ين ياباني', zh: '日元' }, logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f4b4.svg' },
  { code: '元', label: { es: 'Yuan chino', en: 'Chinese Yuan', fr: 'Yuan chinois', de: 'Chinesischer Yuan', ar: 'يوان صيني', zh: '人民币' }, logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f4b4.svg' },
  { code: 'A$', label: { es: 'Dólar australiano', en: 'Australian Dollar', fr: 'Dollar australien', de: 'Australischer Dollar', ar: 'دولار أسترالي', zh: '澳元' }, logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f4b5.svg' },
  { code: '₽', label: { es: 'Rublo ruso', en: 'Russian Ruble', fr: 'Rouble russe', de: 'Russischer Rubel', ar: 'روبل روسي', zh: '俄罗斯卢布' }, logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f4b2.svg' },
  { code: 'CHF', label: { es: 'Franco suizo', en: 'Swiss Franc', fr: 'Franc suisse', de: 'Schweizer Franken', ar: 'فرنك سويسري', zh: '瑞士法郎' }, logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f4b2.svg' },
  { code: 'DKK', label: { es: 'Corona danesa', en: 'Danish Krone', fr: 'Couronne danoise', de: 'Dänische Krone', ar: 'كرونة دنماركية', zh: '丹麦克朗' }, logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f4b2.svg' },
  { code: 'SGD', label: { es: 'Dólar de Singapur', en: 'Singapore Dollar', fr: 'Dollar de Singapour', de: 'Singapur-Dollar', ar: 'دولار سنغافوري', zh: '新加坡元' }, logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f4b5.svg' },
  { code: 'CAD', label: { es: 'Dólar canadiense', en: 'Canadian Dollar', fr: 'Dollar canadien', de: 'Kanadischer Dollar', ar: 'دولار كندي', zh: '加拿大元' }, logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f4b5.svg' },
  { code: 'MXN', label: { es: 'Peso mexicano', en: 'Mexican Peso', fr: 'Peso mexicain', de: 'Mexikanischer Peso', ar: 'بيزو مكسيكي', zh: '墨西哥比索' }, logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f4b2.svg' },
  { code: 'BRL', label: { es: 'Real brasileño', en: 'Brazilian Real', fr: 'Real brésilien', de: 'Brasilianischer Real', ar: 'ريال برازيلي', zh: '巴西雷亚尔' }, logo: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f4b2.svg' }
];

// Datos de ejemplo
let ciudades = ['Madrid','Barcelona','París','Roma','London'];
let paises = ['España','Francia','Italia','England','Great Britain'];
let usuarios = [];

function cargarUsuariosDesdeFirestore() {
  window._fb.db.collection("usuarios").get().then(snapshot => {
    usuarios = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.username) usuarios.push(data.username);
    });
    setLang();
    seleccionarUsuarioRegistrado();
  });
}

document.getElementById('registroForm').onsubmit = function(e) {
  e.preventDefault();
  let email = document.getElementById('regEmail').value.trim();
  let password = document.getElementById('regPassword').value.trim();
  let username = document.getElementById('regUsername').value.trim();
  if (!email || !password || !username) {
    document.getElementById('regMsg').innerText = 'Completa todos los campos.';
    return;
  }
  // Primero registra el usuario en Firebase Auth
  window._fb.auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const uid = userCredential.user.uid;
      // Comprueba si el nombre de usuario ya existe en Firestore
      window._fb.db.collection("usuarios").where("username", "==", username).get()
        .then(snapshot => {
          if (!snapshot.empty) {
            document.getElementById('regMsg').innerText = 'El nombre de usuario ya existe. Elige otro.';
            return;
          }
          // Guarda el usuario en Firestore con el UID
          window._fb.db.collection("usuarios").doc(uid).set({ email, username })
            .then(() => {
              localStorage.setItem('usuarioRegistrado', JSON.stringify({ email, username, uid }));
              document.getElementById('registroModal').style.display = 'none';
              document.getElementById('regMsg').innerText = '';
              cargarUsuariosDesdeFirestore();
            })
            .catch(err => {
              document.getElementById('regMsg').innerText = 'Error al guardar usuario: ' + err.message;
            });
        })
        .catch(err => {
          document.getElementById('regMsg').innerText = 'Error de conexión: ' + err.message;
        });
    })
    .catch(err => {
      document.getElementById('regMsg').innerText = 'Error de registro: ' + err.message;
    });
};

window.onload = function() {
  cargarUsuariosDesdeFirestore();
};
let restaurantes = ['La Tagliatella','Sushi House','Casa Paco'];
let visitas = [
  { usuario: 'Paco', restaurante: 'La Tagliatella', ciudad: 'Madrid', pais: 'España', fecha: '2024-05-10', comensales: 4, total: 120, moneda: '€', valoracion: 4, reseña: 'Muy bueno', lat: 40.4168, lng: -3.7038, ticket: '' },
  { usuario: 'Ana', restaurante: 'La Tagliatella', ciudad: 'Madrid', pais: 'España', fecha: '2025-03-12', comensales: 2, total: 60, moneda: '€', valoracion: 5, reseña: 'Excelente', lat: 40.4168, lng: -3.7038, ticket: '' },
  { usuario: 'Luis', restaurante: 'Sushi House', ciudad: 'Barcelona', pais: 'España', fecha: '2025-06-18', comensales: 2, total: 80, moneda: '€', valoracion: 5, reseña: 'Fantástico', lat: 41.3851, lng: 2.1734, ticket: '' }
];

// Inicialización idioma y tema
function initLangTheme() {
  let langSel = document.getElementById('lang');
  langSel.innerHTML = idiomas.map(l => `<option value="${l.code}">${l.label}</option>`).join('');
  langSel.value = 'es';
  document.getElementById('theme').value = 'dark';
  setTheme();
}
function capitalizeInput(input) {
  let val = input.value;
  // Capitaliza solo la primera letra de cada palabra, el resto en minúscula
  val = val.replace(/([^\s]+)/g, function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  input.value = val;
}

// Actualiza textos y datalist
function setLang() {
  let lang = document.getElementById('lang').value;
  let t = textos[lang];
  document.getElementById('langLogo').src = idiomas.find(l => l.code === lang).logo;
  document.getElementById('tabBtn0').innerText = t.tabs[0];
  document.getElementById('tabBtn1').innerText = t.tabs[1];
  document.getElementById('tabBtn2').innerText = t.tabs[2];
  document.getElementById('tabBtn3').innerText = t.tabs[3];
  document.getElementById('tabBtn4').innerText = t.tabs[4];
  document.getElementById('addTitle').innerText = t.addTitle;
  document.getElementById('resumenTitle').innerText = t.resumenTitle;
  document.getElementById('historialTitle').innerText = t.historialTitle;
  document.getElementById('explorarTitle').innerText = t.explorarTitle;
  document.getElementById('amigosTitle').innerText = t.amigosTitle;
  document.getElementById('lblRestaurante').innerText = t.lblRestaurante;
  document.getElementById('lblFecha').innerText = t.lblFecha;
  document.getElementById('lblCiudad').innerText = t.lblCiudad;
  document.getElementById('lblPais').innerText = t.lblPais;
  document.getElementById('lblComensales').innerText = t.lblComensales;
  document.getElementById('lblTotal').innerText = t.lblTotal;
  document.getElementById('lblAvgPrice').innerText = t.lblAvgPrice;
  document.getElementById('lblValoracion').innerText = t.lblValoracion;
  document.getElementById('lblReseña').innerText = t.lblReseña;
  document.getElementById('lblTicket').innerText = t.lblTicket;
  document.getElementById('btnGuardar').innerText = t.btnGuardar;
  document.getElementById('lblYear').innerText = t.lblYear;
  document.getElementById('restaurante').placeholder = t.placeholderRestaurante;
  document.getElementById('ciudadInput').placeholder = t.placeholderCiudad;
  document.getElementById('paisInput').placeholder = t.placeholderPais;
  document.getElementById('reseña').placeholder = t.placeholderReseña;
  document.getElementById('lblHistRest').innerText = t.lblHistRest;
  document.getElementById('lblHistCiudad').innerText = t.lblHistCiudad;
  document.getElementById('lblHistPais').innerText = t.lblHistPais;
  document.getElementById('lblExpRest').innerText = t.lblExpRest;
  document.getElementById('lblExpCiudad').innerText = t.lblExpCiudad;
  document.getElementById('lblExpPais').innerText = t.lblExpPais;
  document.getElementById('lblExpUsuario').innerText = t.lblExpUsuario;
  document.getElementById('lblAmigosUsuario').innerText = t.lblAmigosUsuario;
  document.getElementById('lblAmigosCiudad').innerText = t.lblAmigosCiudad;
  document.getElementById('lblAmigosPais').innerText = t.lblAmigosPais;
  // Datalist ciudad/pais/restaurante
  document.getElementById('ciudadList').innerHTML = [...new Set(ciudades.map(c => translateCity(c, lang)))].map(c => `<option value="${c}">`).join('');
  document.getElementById('paisList').innerHTML = [...new Set(paises.map(p => translateCountry(p, lang)))].map(p => `<option value="${p}">`).join('');
  document.getElementById('restauranteList').innerHTML = [...new Set(restaurantes)].map(r => `<option value="${r}">`).join('');
  // Monedas con logo
  document.getElementById('moneda').innerHTML = monedas.map(m =>
    `<option value="${m.code}">${m.label[lang]}</option>`
  ).join('');
  document.getElementById('year').innerHTML = `<option value="todos">${t.selectYear}</option>` + [...new Set(visitas.map(v => new Date(v.fecha).getFullYear()))].map(a => `<option value="${a}">${a}</option>`).join('');
  document.getElementById('histRest').innerHTML = `<option value="todos">${t.tabs[0]}</option>` + restaurantes.map(r => `<option>${r}</option>`).join('');
  document.getElementById('histCiudad').innerHTML = `<option value="todos">${t.selectCiudad}</option>` + ciudades.map(c => `<option>${translateCity(c, lang)}</option>`).join('');
  document.getElementById('histPais').innerHTML = `<option value="todos">${t.selectPais}</option>` + paises.map(p => `<option>${translateCountry(p, lang)}</option>`).join('');
  document.getElementById('explorarRestaurante').innerHTML = `<option value="todos">${t.tabs[0]}</option>` + restaurantes.map(r => `<option>${r}</option>`).join('');
  document.getElementById('explorarCiudad').innerHTML = `<option value="todos">${t.selectCiudad}</option>` + ciudades.map(c => `<option>${translateCity(c, lang)}</option>`).join('');
  document.getElementById('explorarPais').innerHTML = `<option value="todos">${t.selectPais}</option>` + paises.map(p => `<option>${translateCountry(p, lang)}</option>`).join('');
  document.getElementById('explorarUsuario').innerHTML = `<option value="todos">${t.tabs[4]}</option>` + usuarios.map(u => `<option>${u}</option>`).join('');
  document.getElementById('amigosUsuario').innerHTML = `<option value="todos">${t.tabs[4]}</option>` + usuarios.map(u => `<option>${u}</option>`).join('');
  document.getElementById('amigosCiudad').innerHTML = `<option value="todos">${t.selectCiudad}</option>` + ciudades.map(c => `<option>${translateCity(c, lang)}</option>`).join('');
  document.getElementById('amigosPais').innerHTML = `<option value="todos">${t.selectPais}</option>` + paises.map(p => `<option>${translateCountry(p, lang)}</option>`).join('');
  document.getElementById('lblResumenRest').innerText = t.lblRestaurante;
  document.getElementById('lblResumenPais').innerText = t.lblPais;
  document.getElementById('lblResumenCiudad').innerText = t.lblCiudad;
  document.getElementById('resumenRest').innerHTML = `<option value="todos">${t.tabs[0]}</option>` + restaurantes.map(r => `<option>${r}</option>`).join('');
  document.getElementById('resumenPais').innerHTML = `<option value="todos">${t.selectPais}</option>` + paises.map(p => `<option>${translateCountry(p, lang)}</option>`).join('');
  document.getElementById('resumenCiudad').innerHTML = `<option value="todos">${t.selectCiudad}</option>` + ciudades.map(c => `<option>${translateCity(c, lang)}</option>`).join('');
  renderResumen();
  renderHistorial();
  renderExplorar();
  renderAmigosResumen();
}

// Modo claro/oscuro clásico
document.getElementById('theme').onchange = setTheme;
function setTheme() {
  let theme = document.getElementById('theme').value;
  let themeLogo = document.getElementById('themeLogo');
  if (theme === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('mainContainer').classList.add('light-mode');
    themeLogo.src = "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f31e.svg";
  } else {
    document.body.classList.remove('light-mode');
    document.getElementById('mainContainer').classList.remove('light-mode');
    themeLogo.src = "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f319.svg";
  }
}

// Tabs
function showTab(idx) {
  for (let i = 0; i < 5; i++) {
    document.getElementById('tab'+i).classList.add('hidden');
    document.getElementById('tabBtn'+i).classList.remove('active');
  }
  document.getElementById('tab'+idx).classList.remove('hidden');
  document.getElementById('tabBtn'+idx).classList.add('active');
  if (idx === 1) renderResumen();
  if (idx === 2) renderHistorial();
  if (idx === 3) renderExplorar();
  if (idx === 4) renderAmigosResumen();
}
document.getElementById('tabBtn0').onclick = () => showTab(0);
document.getElementById('tabBtn1').onclick = () => showTab(1);
document.getElementById('tabBtn2').onclick = () => showTab(2);
document.getElementById('tabBtn3').onclick = () => showTab(3);
document.getElementById('tabBtn4').onclick = () => showTab(4);

// Añadir Visita: Capitalización y cálculo precio medio
document.getElementById('restaurante').oninput = function() { capitalizeInput(this); };
document.getElementById('ciudadInput').oninput = function() { capitalizeInput(this); };
document.getElementById('paisInput').oninput = function() { capitalizeInput(this); };
document.getElementById('total').oninput = calcAvgPrice;
document.getElementById('comensales').oninput = calcAvgPrice;

function calcAvgPrice() {
  let total = parseFloat(document.getElementById('total').value) || 0;
  let comensales = parseInt(document.getElementById('comensales').value) || 1;
  document.getElementById('avgPrice').value = comensales > 0 ? (total / comensales).toFixed(2) : '';
}

// Valoración estrellas
Array.from(document.querySelectorAll('#stars .stars')).forEach(star => {
  star.onclick = function() {
    let n = parseInt(this.getAttribute('data-star'));
    document.getElementById('valoracion').value = n;
    Array.from(document.querySelectorAll('#stars .stars')).forEach((s, i) => {
      s.style.color = i < n ? '#ffd700' : '#444';
    });
  };
});

// Ticket preview
document.getElementById('ticket').onchange = function(e) {
  let file = e.target.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function(ev) {
      let img = document.getElementById('ticketPreview');
      img.src = ev.target.result;
      img.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
};

// Guardar visita y actualizar datalist
document.getElementById('visitForm').onsubmit = function(e) {
  e.preventDefault();
  let lang = document.getElementById('lang').value;
  let restaurante = document.getElementById('restaurante').value.trim();
  let ciudad = document.getElementById('ciudadInput').value.trim();
  let pais = document.getElementById('paisInput').value.trim();
  let comensales = parseInt(document.getElementById('comensales').value);
  let total = parseFloat(document.getElementById('total').value) || 0;
  let moneda = document.getElementById('moneda').value;
  let avgPrice = parseFloat(document.getElementById('avgPrice').value) || 0;
  let valoracion = parseInt(document.getElementById('valoracion').value) || 0;
  let reseña = document.getElementById('reseña').value.trim();
  let ticket = document.getElementById('ticketPreview').src || '';
  let fecha = document.getElementById('fecha').value || new Date().toISOString().slice(0,10);
  let usuario = usuarios[0];
  let lat = null, lng = null;
  if (!restaurante || !ciudad || !pais || !total || !comensales) {
    document.getElementById('visitMsg').innerHTML = `<span style="color:#ff4d4d;">${textos[lang].btnGuardar} - ${textos[lang].lblRestaurante} ${textos[lang].lblCiudad} ${textos[lang].lblPais} ${textos[lang].lblTotal} ${textos[lang].lblComensales}</span>`;
    return;
  }
  // Normaliza y traduce país y ciudad
  let paisTrad = translateCountry(pais, lang);
  let ciudadTrad = translateCity(ciudad, lang);
  visitas.push({ usuario, restaurante, ciudad: ciudadTrad, pais: paisTrad, fecha, comensales, total, moneda, valoracion, reseña, lat, lng, ticket });
  // Añade ciudad/pais/restaurante si no existen
  if (!ciudades.map(c => translateCity(c, lang)).includes(ciudadTrad)) ciudades.push(ciudadTrad);
  if (!paises.map(p => translateCountry(p, lang)).includes(paisTrad)) paises.push(paisTrad);
  if (!restaurantes.includes(restaurante)) restaurantes.push(restaurante);
  setLang();
  document.getElementById('visitMsg').innerHTML = `<span style="color:#00eaff;">${textos[lang].btnGuardar} OK!</span>`;
  this.reset();
  document.getElementById('ticketPreview').style.display = 'none';
  Array.from(document.querySelectorAll('#stars .stars')).forEach(s => s.style.color = '#444');
  document.getElementById('valoracion').value = 0;
  calcAvgPrice();
};

// RESUMEN
function renderResumen() {
  let lang = document.getElementById('lang').value;
  let añoSeleccionado = document.getElementById('year').value;
  let restSel = document.getElementById('resumenRest').value;
  let ciudadSel = document.getElementById('resumenCiudad').value;
  let paisSel = document.getElementById('resumenPais').value;
  let filtradas = visitas.filter(v => {
    let añoOk = añoSeleccionado === 'todos' || new Date(v.fecha).getFullYear() == añoSeleccionado;
    let rOk = restSel === 'todos' || v.restaurante === restSel;
    let cOk = ciudadSel === 'todos' || normalize(v.ciudad) === normalize(ciudadSel);
    let pOk = paisSel === 'todos' || normalize(v.pais) === normalize(paisSel);
    return añoOk && rOk && cOk && pOk;
  });

  let totalesDivisa = {};
  filtradas.forEach(v => {
    if (!totalesDivisa[v.moneda]) totalesDivisa[v.moneda] = 0;
    totalesDivisa[v.moneda] += Number(v.total);
  });

  let totalHtml = Object.entries(totalesDivisa).map(([moneda, total]) =>
    `<div>${textos[lang].lblTotal} <span style="color:#00eaff;">${total} ${moneda}</span></div>`
  ).join('');
  document.getElementById('totalGastado').innerHTML = totalHtml;

  let grupos = {};
  filtradas.forEach(v => {
    let key = v.restaurante + '|' + normalize(v.ciudad) + '|' + normalize(v.pais);
    if (!grupos[key]) grupos[key] = { restaurante: v.restaurante, ciudad: v.ciudad, pais: v.pais, visitas: 0, totalGastado: 0, valoraciones: [], reseñas: [], moneda: v.moneda, comensales: 0, preciosPorComensal: [], lat: v.lat, lng: v.lng };
    grupos[key].visitas += 1;
    grupos[key].totalGastado += Number(v.total);
    grupos[key].valoraciones.push(Number(v.valoracion));
    grupos[key].reseñas.push({ usuario: v.usuario, reseña: v.reseña });
    grupos[key].comensales += Number(v.comensales);
    grupos[key].preciosPorComensal.push(Number(v.total) / Number(v.comensales));
  });

  let html = '';
  Object.values(grupos).forEach(grupo => {
    let valoracionMedia = grupo.valoraciones.length ? (grupo.valoraciones.reduce((a,b)=>a+b,0)/grupo.valoraciones.length).toFixed(1) : '0';
    let precioMedio = grupo.preciosPorComensal.length
        ? (grupo.preciosPorComensal.reduce((a,b)=>a+b,0)/grupo.preciosPorComensal.length).toFixed(2)
        : '0.00';
    let mapsLink = `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(grupo.restaurante + ' ' + grupo.ciudad + ' ' + grupo.pais)}" target="_blank" style="color:#00eaff;">Google Maps</a>`;
    html += `<div class="card">
      <div class="restaurante-nombre">${grupo.restaurante}</div>
      <div>${textos[lang].lblCiudad.split(':')[0]}: ${grupo.ciudad}</div>
      <div>${textos[lang].lblPais.split(':')[0]}: ${grupo.pais}</div>
      <div><b>Número de visitas:</b> ${grupo.visitas}</div>
      <div>${textos[lang].lblTotal} <b>${grupo.totalGastado} ${grupo.moneda}</b></div>
      <div>${textos[lang].lblAvgPrice.split(':')[0]}: <b>${precioMedio} ${grupo.moneda}</b></div>
      <div>${textos[lang].lblValoracion.split(':')[0]}: <span class="stars">${'★'.repeat(Math.round(valoracionMedia))}${'☆'.repeat(5-Math.round(valoracionMedia))}</span> (${valoracionMedia})</div>
      <div><b>${textos[lang].lblReseña.split(':')[0]}:</b><ul class="review-list">${grupo.reseñas.map(r=>`<li><span class="usuario-nombre">${r.usuario}</span>: ${r.reseña}</li>`).join('')}</ul></div>
      ${mapsLink}
    </div>`;
  });
  document.getElementById('resumenCards').innerHTML = html;
}
document.getElementById('year').onchange = renderResumen;

// HISTORIAL
function renderHistorial() {
  let lang = document.getElementById('lang').value;
  let restSel = document.getElementById('histRest').value;
  let ciudadSel = document.getElementById('histCiudad').value;
  let paisSel = document.getElementById('histPais').value;
  let html = '';
  let filtradas = visitas.filter(v => {
    let rOk = restSel === 'todos' || v.restaurante === restSel;
    let cOk = ciudadSel === 'todos' || normalize(v.ciudad) === normalize(ciudadSel);
    let pOk = paisSel === 'todos' || normalize(v.pais) === normalize(paisSel);
    return rOk && cOk && pOk;
  });
  filtradas.slice().sort((a,b)=>new Date(b.fecha)-new Date(a.fecha)).forEach((v, idx) => {
  let precioMedio = v.comensales > 0 ? (v.total / v.comensales).toFixed(2) : '0.00';
  html += `<div class="card">
    <div class="restaurante-nombre">${v.restaurante}</div>
    <div>(${v.ciudad}, ${v.pais})</div>
    <div>${textos[lang].lblFecha.split(':')[0]}: ${v.fecha}</div>
    <div>${textos[lang].lblComensales.split(':')[0]}: ${v.comensales}</div>
    <div>${textos[lang].lblTotal} ${v.total} ${v.moneda}</div>
    <div>${textos[lang].lblAvgPrice.split(':')[0]}: <b>${precioMedio} ${v.moneda}</b></div>
    <div>${textos[lang].lblValoracion.split(':')[0]}: <span class="stars">${'★'.repeat(v.valoracion)}${'☆'.repeat(5-v.valoracion)}</span></div>
    <div>${textos[lang].lblReseña.split(':')[0]}: ${v.reseña}</div>
    ${v.ticket ? `<button class="btn" onclick="mostrarTicket('${v.ticket}')">Ver ticket</button>` : ''}
    <button class="btn delete-btn" title="Eliminar" onclick="eliminarVisita(${idx})"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f5d1.svg" alt="Eliminar"></button>
  </div>`;
});
  document.getElementById('historialCards').innerHTML = html;
}
window.eliminarVisita = function(idx) {
  let lang = document.getElementById('lang').value;
  let restSel = document.getElementById('histRest').value;
  let ciudadSel = document.getElementById('histCiudad').value;
  let paisSel = document.getElementById('histPais').value;
  // Filtra igual que en renderHistorial
  let filtradas = visitas.filter(v => {
    let rOk = restSel === 'todos' || v.restaurante === restSel;
    let cOk = ciudadSel === 'todos' || normalize(v.ciudad) === normalize(ciudadSel);
    let pOk = paisSel === 'todos' || normalize(v.pais) === normalize(paisSel);
    return rOk && cOk && pOk;
  });
  let visita = filtradas.slice().sort((a,b)=>new Date(b.fecha)-new Date(a.fecha))[idx];
  let iReal = visitas.findIndex(v =>
    v.restaurante === visita.restaurante &&
    v.ciudad === visita.ciudad &&
    v.pais === visita.pais &&
    v.fecha === visita.fecha &&
    v.usuario === visita.usuario
  );
  if (iReal > -1 && confirm('¿Seguro que quieres eliminar esta visita?')) {
    visitas.splice(iReal, 1);
    renderHistorial();
    renderResumen();
    renderExplorar();
    renderAmigosResumen();
  }
};

function getTopActiveUsers(visitas, topN = 10) {
  let counts = {};
  visitas.forEach(v => {
    counts[v.usuario] = (counts[v.usuario] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([usuario]) => usuario);
}

function getTopRatedRestaurants(visitas, usuarios, topN = 10) {
  let agrupados = {};
  visitas.forEach(v => {
    if (!usuarios.includes(v.usuario)) return;
    const key = v.restaurante + '|' + normalize(v.ciudad) + '|' + normalize(v.pais);
    if (!agrupados[key]) agrupados[key] = { nombre: v.restaurante, ciudad: v.ciudad, pais: v.pais, moneda: v.moneda, valoraciones: [], precios: [], reseñas: [], visitas: 0 };
    agrupados[key].valoraciones.push(v.valoracion);
    agrupados[key].precios.push(v.total / v.comensales);
    agrupados[key].reseñas.push({ usuario: v.usuario, reseña: v.reseña });
    agrupados[key].visitas += 1;
  });
  let arr = Object.values(agrupados).map(grupo => {
    grupo.valoracionMedia = grupo.valoraciones.length ? (grupo.valoraciones.reduce((a,b)=>a+b,0)/grupo.valoraciones.length) : 0;
    return grupo;
  });
  return arr.sort((a, b) => b.valoracionMedia - a.valoracionMedia).slice(0, topN);
}

function renderExplorar() {
  let lang = document.getElementById('lang').value;
  let restauranteSel = document.getElementById('explorarRestaurante').value;
  let ciudadSel = document.getElementById('explorarCiudad').value;
  let paisSel = document.getElementById('explorarPais').value;
  let usuarioSel = document.getElementById('explorarUsuario').value;
  let html = '';
  let filtradas = visitas.filter(v => {
    let rOk = restauranteSel === 'todos' || v.restaurante === restauranteSel;
    let cOk = ciudadSel === 'todos' || normalize(v.ciudad) === normalize(ciudadSel);
    let pOk = paisSel === 'todos' || normalize(v.pais) === normalize(paisSel);
    let uOk = usuarioSel === 'todos' || v.usuario === usuarioSel;
    return rOk && cOk && pOk && uOk;
  });

  // Si no hay filtros, mostrar top 10 de los 10 usuarios más activos
  if (restauranteSel === 'todos' && ciudadSel === 'todos' && paisSel === 'todos' && usuarioSel === 'todos') {
    let topUsers = getTopActiveUsers(visitas, 10);
    let topRestaurantes = getTopRatedRestaurants(visitas, topUsers, 10);
    filtradas = [];
    topRestaurantes.forEach(grupo => {
      filtradas = filtradas.concat(
        visitas.filter(v =>
          v.restaurante === grupo.nombre &&
          normalize(v.ciudad) === normalize(grupo.ciudad) &&
          normalize(v.pais) === normalize(grupo.pais) &&
          topUsers.includes(v.usuario)
        )
      );
    });
  }

  let agrupados = {};
  filtradas.forEach(v => {
    const key = v.restaurante + '|' + normalize(v.ciudad) + '|' + normalize(v.pais);
    if (!agrupados[key]) agrupados[key] = { nombre: v.restaurante, ciudad: v.ciudad, pais: v.pais, moneda: v.moneda, precios: [], valoraciones: [], reseñas: [], visitas: 0 };
    agrupados[key].precios.push(v.total / v.comensales);
    agrupados[key].valoraciones.push(v.valoracion);
    agrupados[key].reseñas.push({ usuario: v.usuario, reseña: v.reseña });
    agrupados[key].visitas += 1;
  });
  Object.values(agrupados).forEach(grupo => {
    let precioMedio = grupo.precios.length ? (grupo.precios.reduce((a,b)=>a+b,0)/grupo.precios.length).toFixed(2) : '0.00';
    let valoracionMedia = grupo.valoraciones.length ? (grupo.valoraciones.reduce((a,b)=>a+b,0)/grupo.valoraciones.length).toFixed(1) : '0';
    let mapsLink = `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(grupo.nombre + ' ' + grupo.ciudad + ' ' + grupo.pais)}" target="_blank" style="color:#00eaff;">Google Maps</a>`;
    html += `<div class="card">
      <div class="restaurante-nombre">${grupo.nombre}</div>
      <div>${textos[lang].lblPais.split(':')[0]}: ${grupo.pais}</div>
      <div>${textos[lang].lblCiudad.split(':')[0]}: ${grupo.ciudad}</div>
      <div><b>Número de visitas:</b> ${grupo.visitas}</div>
      <div>${textos[lang].lblAvgPrice.split(':')[0]}: <b>${precioMedio} ${grupo.moneda}</b></div>
      <div>${textos[lang].lblValoracion.split(':')[0]}: <span class="stars">${'★'.repeat(Math.round(valoracionMedia))}${'☆'.repeat(5-Math.round(valoracionMedia))}</span> (${valoracionMedia})</div>
      <div><b>${textos[lang].lblReseña.split(':')[0]}:</b><ul class="review-list">${grupo.reseñas.map(r=>`<li><span class="usuario-nombre">${r.usuario}</span>: ${r.reseña}</li>`).join('')}</ul></div>
      ${mapsLink}
    </div>`;
  });
  document.getElementById('explorarCards').innerHTML = html;
}

function renderAmigosResumen() {
  let lang = document.getElementById('lang').value;
  let usuarioSel = document.getElementById('amigosUsuario').value;
  let ciudadSel = document.getElementById('amigosCiudad').value;
  let paisSel = document.getElementById('amigosPais').value;
  let html = '';
  let filtradas = visitas.filter(v => {
    let uOk = usuarioSel === 'todos' || v.usuario === usuarioSel;
    let cOk = ciudadSel === 'todos' || normalize(v.ciudad) === normalize(ciudadSel);
    let pOk = paisSel === 'todos' || normalize(v.pais) === normalize(paisSel);
    return uOk && cOk && pOk;
  });

  // Si no hay filtros, mostrar top 10 de los 10 usuarios más activos
  if (usuarioSel === 'todos' && ciudadSel === 'todos' && paisSel === 'todos') {
    let topUsers = getTopActiveUsers(visitas, 10);
    let topRestaurantes = getTopRatedRestaurants(visitas, topUsers, 10);
    filtradas = [];
    topRestaurantes.forEach(grupo => {
      filtradas = filtradas.concat(
        visitas.filter(v =>
          v.restaurante === grupo.nombre &&
          normalize(v.ciudad) === normalize(grupo.ciudad) &&
          normalize(v.pais) === normalize(grupo.pais) &&
          topUsers.includes(v.usuario)
        )
      );
    });
  }

  let agrupados = {};
  filtradas.forEach(v => {
    const key = v.restaurante + '|' + normalize(v.ciudad) + '|' + normalize(v.pais);
    if (!agrupados[key]) agrupados[key] = { nombre: v.restaurante, ciudad: v.ciudad, pais: v.pais, moneda: v.moneda, precios: [], valoraciones: [], reseñas: [], visitas: 0 };
    agrupados[key].precios.push(v.total / v.comensales);
    agrupados[key].valoraciones.push(v.valoracion);
    agrupados[key].reseñas.push({ usuario: v.usuario, reseña: v.reseña });
    agrupados[key].visitas += 1;
  });
  Object.values(agrupados).forEach(grupo => {
    let precioMedio = grupo.precios.length ? (grupo.precios.reduce((a,b)=>a+b,0)/grupo.precios.length).toFixed(2) : '0.00';
    let valoracionMedia = grupo.valoraciones.length ? (grupo.valoraciones.reduce((a,b)=>a+b,0)/grupo.valoraciones.length).toFixed(1) : '0';
    let mapsLink = `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(grupo.nombre + ' ' + grupo.ciudad + ' ' + grupo.pais)}" target="_blank" style="color:#00eaff;">Google Maps</a>`;
    html += `<div class="card">
      <div class="restaurante-nombre">${grupo.nombre}</div>
      <div>${textos[lang].lblPais.split(':')[0]}: ${grupo.pais}</div>
      <div>${textos[lang].lblCiudad.split(':')[0]}: ${grupo.ciudad}</div>
      <div><b>Número de visitas:</b> ${grupo.visitas}</div>
      <div>${textos[lang].lblAvgPrice.split(':')[0]}: <b>${precioMedio} ${grupo.moneda}</b></div>
      <div>${textos[lang].lblValoracion.split(':')[0]}: <span class="stars">${'★'.repeat(Math.round(valoracionMedia))}${'☆'.repeat(5-Math.round(valoracionMedia))}</span> (${valoracionMedia})</div>
      <div><b>${textos[lang].lblReseña.split(':')[0]}:</b><ul class="review-list">${grupo.reseñas.map(r=>`<li><span class="usuario-nombre">${r.usuario}</span>: ${r.reseña}</li>`).join('')}</ul></div>
      ${mapsLink}
    </div>`;
  });
  document.getElementById('amigosCards').innerHTML = html;
}
document.getElementById('amigosUsuario').onchange = renderAmigosResumen;
document.getElementById('amigosCiudad').onchange = renderAmigosResumen;
document.getElementById('amigosPais').onchange = renderAmigosResumen;

// Inicialización
initLangTheme();
setLang();
document.getElementById('lang').onchange = setLang;
document.getElementById('theme').onchange = setTheme;

document.getElementById('explorarPais').onchange = renderExplorar;
document.getElementById('explorarCiudad').onchange = renderExplorar;
document.getElementById('explorarRestaurante').onchange = renderExplorar;
document.getElementById('explorarUsuario').onchange = renderExplorar;
document.getElementById('histRest').onchange = renderHistorial;
document.getElementById('histPais').onchange = renderHistorial;
document.getElementById('histCiudad').onchange = renderHistorial;
document.getElementById('histRest').onchange = function() {
  document.getElementById('histPais').value = 'todos';
  document.getElementById('histCiudad').value = 'todos';
  renderHistorial();
};
document.getElementById('histPais').onchange = function() {
  document.getElementById('histRest').value = 'todos';
  document.getElementById('histCiudad').value = 'todos';
  renderHistorial();
};
document.getElementById('histCiudad').onchange = function() {
  document.getElementById('histRest').value = 'todos';
  document.getElementById('histPais').value = 'todos';
  renderHistorial();
};
function mostrarRegistroSiNecesario() {
  if (!localStorage.getItem('usuarioRegistrado')) {
    document.getElementById('registroModal').style.display = 'flex';
  }
}
function seleccionarUsuarioRegistrado() {
  const reg = localStorage.getItem('usuarioRegistrado');
  if (reg) {
    const { username } = JSON.parse(reg);
    // Selecciona el usuario en los desplegables
    const selects = [
      'explorarUsuario',
      'amigosUsuario'
    ];
    selects.forEach(id => {
      const sel = document.getElementById(id);
      if (sel && [...sel.options].some(opt => opt.value === username || opt.text === username)) {
        sel.value = username;
      }
    });
  }
}
function mostrarTicket(src) {
  document.getElementById('ticketImg').src = src;
  document.getElementById('ticketModal').style.display = 'flex';
}
document.getElementById('resumenRest').onchange = renderResumen;
document.getElementById('resumenPais').onchange = renderResumen;
document.getElementById('resumenCiudad').onchange = renderResumen;