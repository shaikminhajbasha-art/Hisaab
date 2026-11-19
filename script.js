/**
 * Hisaab — Digital Kirana Ledger
 * Vanilla JavaScript implementation with offline localStorage persistence,
 * integer paise arithmetic, WhatsApp reminders, UPI links, JSON import,
 * CSV export, payment screenshot compression, and English / Hindi / Telugu labels.
 */

const STORAGE_KEY = 'hisaab_data';
const LANG_KEY = 'hisaab_lang';
const THEME_KEY = 'hisaab_theme';
const SAMPLE_DATA_URL = '/assets/aistudio/sample-data_633eb33f.json';
const TESSERACT_CDN_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';

/* ==========================================================================
   1. Localized Strings (English, Hindi, Telugu)
   ========================================================================== */
const I18N = {
  en: {
    appName: 'Hisaab',
    defaultShopName: 'My Kirana Store',
    totalOutstanding: 'Total Outstanding (Baki)',
    addCustomer: 'Add Customer',
    totalCreditGiven: 'Total Udhaar Given',
    totalPaymentReceived: 'Total Jama Received',
    customersWithDue: 'Pending Customers',
    searchPlaceholder: 'Search by name or 10-digit phone...',
    allCustomersTab: 'All Customers',
    overdueTab: 'Overdue',
    customerListTitle: 'Customer Khata',
    overdueListTitle: 'Overdue Customers',
    sortedByHighestDue: 'Highest balance first',
    sortedByDaysOverdue: 'Oldest unpaid first',
    noCustomersTitle: 'No customers yet',
    noCustomersDesc: 'Add your first customer or paste shop JSON in the Import box to get started.',
    noMatchingCustomers: 'No matching customers found.',
    noOverdueCustomers: 'No overdue balances right now.',
    addNewCustomerTitle: 'Add New Customer',
    customerNameLabel: 'Customer Name',
    customerNamePlaceholder: 'e.g. Ravi Kumar',
    phoneLabel: '10-Digit Mobile Number',
    saveCustomerBtn: 'Save Customer',
    importJsonTitle: 'Import Shop JSON',
    loadSampleBtn: 'Load Sample Shop',
    importHint: 'Paste shop JSON below or upload a .json file. Valid import replaces current shop data.',
    importBtn: 'Import JSON',
    uploadFileBtn: 'File',
    shopSettingsTitle: 'Shop & Export',
    shopNameLabel: 'Shop Name',
    upiIdLabel: 'Shop UPI ID (Optional)',
    upiHelp: 'Adds a one-tap UPI pay link to WhatsApp reminders.',
    saveSettingsBtn: 'Save Shop Details',
    exportCsvBtn: 'Download CSV',
    clearShopBtn: 'Clear Shop Data',
    backToDashboard: 'All Customers',
    currentBalance: 'Current Balance',
    totalCredit: 'Total Udhaar (Credit)',
    totalPayment: 'Total Jama (Paid)',
    entriesCount: 'Entries',
    transactionHistory: 'Transaction History',
    newestFirst: 'Newest first',
    noEntriesTitle: 'No entries yet',
    noEntriesDesc: 'Record udhaar (credit given) or jama (payment received) using the form.',
    addEntryTitle: 'Add Entry',
    editEntryTitle: 'Edit Entry',
    cancelEdit: 'Cancel Edit',
    entryTypeLabel: 'Entry Type',
    creditGiven: 'Credit given',
    paymentReceived: 'Payment received',
    amountLabel: 'Amount (₹)',
    dateLabel: 'Date',
    noteLabel: 'Short Note (Optional)',
    notePlaceholder: 'e.g. groceries, rice & dal, paid on UPI',
    screenshotLabel: 'Payment Screenshot (Optional)',
    removePhoto: 'Remove photo',
    saveEntryBtn: 'Save Entry',
    updateEntryBtn: 'Update Entry',
    openLedger: 'Open Khata',
    remindBtn: 'WhatsApp',
    upiPayBtn: 'UPI Pay',
    settled: 'Settled',
    balanceDue: 'Baki (Due)',
    daysOverdue: (d) => (d <= 0 ? 'Due today' : `${d}d overdue`),
    lastPaidOn: (dt) => `Last paid ${dt}`,
    noPaymentYet: (dt) => `No payment since ${dt}`,
    editBtn: 'Edit',
    deleteBtn: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    navCustomers: 'Khata',
    navOverdue: 'Overdue',
    navAdd: 'Add',
    navTools: 'Import/CSV',
    errNameRequired: 'Please enter the customer name.',
    errPhoneInvalid: 'Enter a valid 10-digit Indian mobile number.',
    errPhoneDuplicate: 'A customer with this phone number already exists.',
    errAmountInvalid: 'Enter a valid amount greater than 0.',
    errDateInvalid: 'Please select a valid date.',
    errJsonEmpty: 'Paste shop JSON in the box before importing.',
    errJsonInvalid: 'Invalid JSON format. Please check the syntax and try again.',
    toastCustomerAdded: 'Customer added.',
    toastEntrySaved: 'Entry saved.',
    toastEntryUpdated: 'Entry updated.',
    toastEntryDeleted: 'Entry deleted.',
    toastImported: (shop, count) => `Imported "${shop}" (${count} customers).`,
    toastSettingsSaved: 'Shop details saved.',
    toastCsvDownloaded: 'CSV downloaded.',
    toastCleared: 'Shop data cleared.',
    confirmDeleteEntryTitle: 'Delete Entry?',
    confirmDeleteEntryMsg: 'This entry will be permanently removed and balances will be recalculated.',
    confirmClearTitle: 'Clear All Shop Data?',
    confirmClearMsg: 'All customers, transactions, and screenshots stored on this device will be erased.',
    waGreeting: (name) => `Hello ${name},`,
    waBody: (shop, amt) => `Your current outstanding balance at ${shop} is ${amt}.`,
    waUpiLine: (link) => `You can pay via UPI here: ${link}`,
    waClosing: 'Kindly clear the pending amount when convenient.\n\nThank you!',
    readAmountBtn: 'Read Amount (OCR)',
    ocrScanning: 'Reading screenshot...',
    ocrDetected: (amt) => `Suggested amount: ${amt}`,
    ocrUseBtn: (amt) => `Use ${amt}`,
    ocrNotFound: 'Could not read a clear amount. Please enter manually.',
    ocrUnavailable: 'OCR unavailable offline. Please enter the amount manually.',
    errStorageFull: 'Browser storage is full. Could not save — try removing old screenshots.',
  },
  hi: {
    appName: 'हिसाब',
    defaultShopName: 'मेरी किराना दुकान',
    totalOutstanding: 'कुल बकाया (बाकी)',
    addCustomer: 'ग्राहक जोड़ें',
    totalCreditGiven: 'कुल उधार दिया',
    totalPaymentReceived: 'कुल जमा मिला',
    customersWithDue: 'बकाया ग्राहक',
    searchPlaceholder: 'नाम या 10 अंकों के नंबर से खोजें...',
    allCustomersTab: 'सभी ग्राहक',
    overdueTab: 'बकाया सूची',
    customerListTitle: 'ग्राहक खाता',
    overdueListTitle: 'बकाया ग्राहक (दिन के अनुसार)',
    sortedByHighestDue: 'सबसे ज़्यादा बकाया पहले',
    sortedByDaysOverdue: 'सबसे पुराना बकाया पहले',
    noCustomersTitle: 'अभी कोई ग्राहक नहीं है',
    noCustomersDesc: 'नया ग्राहक जोड़ें या नीचे JSON इम्पोर्ट करें।',
    noMatchingCustomers: 'कोई ग्राहक नहीं मिला।',
    noOverdueCustomers: 'अभी कोई बकाया नहीं है।',
    addNewCustomerTitle: 'नया ग्राहक जोड़ें',
    customerNameLabel: 'ग्राहक का नाम',
    customerNamePlaceholder: 'जैसे: रवि कुमार',
    phoneLabel: '10 अंकों का मोबाइल नंबर',
    saveCustomerBtn: 'ग्राहक सेव करें',
    importJsonTitle: 'दुकान JSON इम्पोर्ट करें',
    loadSampleBtn: 'सैंपल दुकान लोड करें',
    importHint: 'नीचे JSON पेस्ट करें या .json फ़ाइल चुनें। सही डेटा पुराना खाता बदल देगा।',
    importBtn: 'JSON इम्पोर्ट करें',
    uploadFileBtn: 'फ़ाइल',
    shopSettingsTitle: 'दुकान और एक्सपोर्ट',
    shopNameLabel: 'दुकान का नाम',
    upiIdLabel: 'दुकान UPI ID (वैकल्पिक)',
    upiHelp: 'WhatsApp रिमाइंडर में UPI भुगतान लिंक जोड़ता है।',
    saveSettingsBtn: 'विवरण सेव करें',
    exportCsvBtn: 'CSV डाउनलोड',
    clearShopBtn: 'डेटा साफ़ करें',
    backToDashboard: 'सभी ग्राहक',
    currentBalance: 'वर्तमान बकाया',
    totalCredit: 'कुल उधार',
    totalPayment: 'कुल जमा',
    entriesCount: 'प्रविष्टियाँ',
    transactionHistory: 'लेन-देन इतिहास',
    newestFirst: 'नया पहले',
    noEntriesTitle: 'अभी कोई प्रविष्टि नहीं',
    noEntriesDesc: 'फॉर्म से उधार या जमा दर्ज करें।',
    addEntryTitle: 'नई प्रविष्टि जोड़ें',
    editEntryTitle: 'प्रविष्टि बदलें',
    cancelEdit: 'रद्द करें',
    entryTypeLabel: 'प्रकार',
    creditGiven: 'उधार दिया',
    paymentReceived: 'जमा मिला',
    amountLabel: 'राशि (₹)',
    dateLabel: 'तारीख',
    noteLabel: 'छोटा नोट (वैकल्पिक)',
    notePlaceholder: 'जैसे: राशन, चावल, UPI से भुगतान',
    screenshotLabel: 'भुगतान स्क्रीनशॉट (वैकल्पिक)',
    removePhoto: 'फ़ोटो हटाएं',
    saveEntryBtn: 'प्रविष्टि सेव करें',
    updateEntryBtn: 'अपडेट करें',
    openLedger: 'खाता खोलें',
    remindBtn: 'WhatsApp',
    upiPayBtn: 'UPI भुगतान',
    settled: 'हिसाब बराबर',
    balanceDue: 'बकाया',
    daysOverdue: (d) => (d <= 0 ? 'आज देय' : `${d} दिन से बकाया`),
    lastPaidOn: (dt) => `आखिरी जमा ${dt}`,
    noPaymentYet: (dt) => `${dt} से कोई भुगतान नहीं`,
    editBtn: 'बदलें',
    deleteBtn: 'हटाएं',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    close: 'बंद करें',
    navCustomers: 'खाता',
    navOverdue: 'बकाया',
    navAdd: 'जोड़ें',
    navTools: 'इम्पोर्ट',
    errNameRequired: 'कृपया ग्राहक का नाम लिखें।',
    errPhoneInvalid: 'कृपया सही 10 अंकों का मोबाइल नंबर लिखें।',
    errPhoneDuplicate: 'इस मोबाइल नंबर का ग्राहक पहले से मौजूद है।',
    errAmountInvalid: 'कृपया 0 से ज़्यादा सही राशि लिखें।',
    errDateInvalid: 'कृपया सही तारीख चुनें।',
    errJsonEmpty: 'इम्पोर्ट करने से पहले JSON पेस्ट करें।',
    errJsonInvalid: 'गलत JSON फ़ॉर्मेट। कृपया जाँच कर फिर कोशिश करें।',
    toastCustomerAdded: 'ग्राहक जुड़ गया।',
    toastEntrySaved: 'प्रविष्टि सेव हो गई।',
    toastEntryUpdated: 'प्रविष्टि अपडेट हो गई।',
    toastEntryDeleted: 'प्रविष्टि हटा दी गई।',
    toastImported: (shop, count) => `"${shop}" इम्पोर्ट हुआ (${count} ग्राहक)।`,
    toastSettingsSaved: 'दुकान विवरण सेव हुआ।',
    toastCsvDownloaded: 'CSV डाउनलोड हो गया।',
    toastCleared: 'दुकान का डेटा साफ़ हो गया।',
    confirmDeleteEntryTitle: 'प्रविष्टि हटाएं?',
    confirmDeleteEntryMsg: 'यह प्रविष्टि हट जाएगी और बकाया फिर से गिना जाएगा।',
    confirmClearTitle: 'सारा डेटा साफ़ करें?',
    confirmClearMsg: 'इस फ़ोन पर सेव सभी ग्राहक और लेन-देन मिट जाएंगे।',
    waGreeting: (name) => `नमस्ते ${name},`,
    waBody: (shop, amt) => `${shop} पर आपका वर्तमान बकाया ${amt} है।`,
    waUpiLine: (link) => `आप यहाँ UPI से भुगतान कर सकते हैं: ${link}`,
    waClosing: 'कृपया सुविधा के अनुसार बकाया राशि जमा कर दें।\n\nधन्यवाद!',
    readAmountBtn: 'राशि पढ़ें (OCR)',
    ocrScanning: 'स्क्रीनशॉट पढ़ा जा रहा है...',
    ocrDetected: (amt) => `सुझाई गई राशि: ${amt}`,
    ocrUseBtn: (amt) => `${amt} भरें`,
    ocrNotFound: 'राशि स्पष्ट नहीं पढ़ी जा सकी। कृपया स्वयं लिखें।',
    ocrUnavailable: 'ऑफ़लाइन OCR उपलब्ध नहीं है। कृपया राशि स्वयं लिखें।',
    errStorageFull: 'ब्राउज़र स्टोरेज भर गया है। सेव नहीं हो सका — पुराने स्क्रीनशॉट हटाएं।',
  },
  te: {
    appName: 'హిసాబ్',
    defaultShopName: 'మా కిరాణా షాప్',
    totalOutstanding: 'మొత్తం బకాయి',
    addCustomer: 'కస్టమర్ జోడించు',
    totalCreditGiven: 'మొత్తం అప్పు ఇచ్చారు',
    totalPaymentReceived: 'మొత్తం జమ వచ్చింది',
    customersWithDue: 'బకాయి కస్టమర్లు',
    searchPlaceholder: 'పేరు లేదా 10 అంకెల ఫోన్ నంబర్...',
    allCustomersTab: 'అందరు కస్టమర్లు',
    overdueTab: 'బకాయి జాబితా',
    customerListTitle: 'కస్టమర్ ఖాతా',
    overdueListTitle: 'బకాయి కస్టమర్లు',
    sortedByHighestDue: 'ఎక్కువ బకాయి ముందు',
    sortedByDaysOverdue: 'ఎక్కువ రోజుల బకాయి ముందు',
    noCustomersTitle: 'ఇంకా కస్టమర్లు లేరు',
    noCustomersDesc: 'కొత్త కస్టమర్‌ను జోడించండి లేదా JSON ఇంపోర్ట్ చేయండి.',
    noMatchingCustomers: 'కస్టమర్లు కనుగొనబడలేదు.',
    noOverdueCustomers: 'ప్రస్తుతం బకాయిలు లేవు.',
    addNewCustomerTitle: 'కొత్త కస్టమర్ జోడించు',
    customerNameLabel: 'కస్టమర్ పేరు',
    customerNamePlaceholder: 'ఉదా: రవి కుమార్',
    phoneLabel: '10 అంకెల మొబైల్ నంబర్',
    saveCustomerBtn: 'కస్టమర్ సేవ్ చేయి',
    importJsonTitle: 'షాప్ JSON ఇంపోర్ట్',
    loadSampleBtn: 'శాంపిల్ షాప్ లోడ్',
    importHint: 'కింద JSON పేస్ట్ చేయండి లేదా .json ఫైల్ ఎంచుకోండి.',
    importBtn: 'JSON ఇంపోర్ట్',
    uploadFileBtn: 'ఫైల్',
    shopSettingsTitle: 'షాప్ & ఎక్స్‌పోర్ట్',
    shopNameLabel: 'షాప్ పేరు',
    upiIdLabel: 'షాప్ UPI ID (ఐచ్ఛికం)',
    upiHelp: 'WhatsApp రిమైండర్‌లో UPI లింక్ జతచేస్తుంది.',
    saveSettingsBtn: 'వివరాలు సేవ్ చేయి',
    exportCsvBtn: 'CSV డౌన్‌లోడ్',
    clearShopBtn: 'డేటా క్లియర్ చేయి',
    backToDashboard: 'అందరు కస్టమర్లు',
    currentBalance: 'ప్రస్తుత బకాయి',
    totalCredit: 'మొత్తం అప్పు',
    totalPayment: 'మొత్తం జమ',
    entriesCount: 'నమోదులు',
    transactionHistory: 'లావాదేవీల చరిత్ర',
    newestFirst: 'కొత్తవి ముందు',
    noEntriesTitle: 'ఇంకా లావాదేవీలు లేవు',
    noEntriesDesc: 'అప్పు లేదా చెల్లింపు నమోదు చేయండి.',
    addEntryTitle: 'కొత్త నమోదు',
    editEntryTitle: 'నమోదు మార్చు',
    cancelEdit: 'రద్దు చేయి',
    entryTypeLabel: 'రకం',
    creditGiven: 'అప్పు ఇచ్చారు',
    paymentReceived: 'చెల్లింపు వచ్చింది',
    amountLabel: 'మొత్తం (₹)',
    dateLabel: 'తేదీ',
    noteLabel: 'చిన్న గమనిక (ఐచ్ఛికం)',
    notePlaceholder: 'ఉదా: కిరాణా సామాన్లు, UPI చెల్లింపు',
    screenshotLabel: 'చెల్లింపు స్క్రీన్‌షాట్ (ఐచ్ఛికం)',
    removePhoto: 'ఫోటో తొలగించు',
    saveEntryBtn: 'నమోదు సేవ్ చేయి',
    updateEntryBtn: 'అప్‌డేట్ చేయి',
    openLedger: 'ఖాతా తెరువు',
    remindBtn: 'WhatsApp',
    upiPayBtn: 'UPI చెల్లింపు',
    settled: 'చెల్లించబడింది',
    balanceDue: 'బకాయి',
    daysOverdue: (d) => (d <= 0 ? 'ఈరోజు గడువు' : `${d} రోజుల బకాయి`),
    lastPaidOn: (dt) => `చివరి చెల్లింపు ${dt}`,
    noPaymentYet: (dt) => `${dt} నుండి చెల్లింపు లేదు`,
    editBtn: 'మార్చు',
    deleteBtn: 'తొలగించు',
    cancel: 'రద్దు',
    confirm: 'నిర్ధారించు',
    close: 'మూసివేయి',
    navCustomers: 'ఖాతా',
    navOverdue: 'బకాయి',
    navAdd: 'జోడించు',
    navTools: 'ఇంపోర్ట్',
    errNameRequired: 'దయచేసి కస్టమర్ పేరు నమోదు చేయండి.',
    errPhoneInvalid: 'సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.',
    errPhoneDuplicate: 'ఈ ఫోన్ నంబర్‌తో కస్టమర్ ఇప్పటికే ఉన్నారు.',
    errAmountInvalid: '0 కంటే ఎక్కువ సరైన మొత్తం నమోదు చేయండి.',
    errDateInvalid: 'సరైన తేదీని ఎంచుకోండి.',
    errJsonEmpty: 'ఇంపోర్ట్ చేయడానికి ముందు JSON పేస్ట్ చేయండి.',
    errJsonInvalid: 'చెల్లని JSON ఫార్మాట్. దయచేసి సరిచూడండి.',
    toastCustomerAdded: 'కస్టమర్ జోడించబడింది.',
    toastEntrySaved: 'నమోదు సేవ్ చేయబడింది.',
    toastEntryUpdated: 'నమోదు అప్‌డేట్ చేయబడింది.',
    toastEntryDeleted: 'నమోదు తొలగించబడింది.',
    toastImported: (shop, count) => `"${shop}" ఇంపోర్ట్ అయింది (${count} కస్టమర్లు).`,
    toastSettingsSaved: 'షాప్ వివరాలు సేవ్ అయ్యాయి.',
    toastCsvDownloaded: 'CSV డౌన్‌లోడ్ అయింది.',
    toastCleared: 'షాప్ డేటా క్లియర్ అయింది.',
    confirmDeleteEntryTitle: 'నమోదు తొలగించాలా?',
    confirmDeleteEntryMsg: 'ఈ నమోదు తొలగించబడి బకాయిలు మళ్లీ లెక్కించబడతాయి.',
    confirmClearTitle: 'మొత్తం డేటా క్లియర్ చేయాలా?',
    confirmClearMsg: 'అన్ని కస్టమర్లు మరియు లావాదేవీలు తొలగించబడతాయి.',
    waGreeting: (name) => `నమస్కారం ${name},`,
    waBody: (shop, amt) => `${shop} వద్ద మీ ప్రస్తుత బకాయి ${amt}.`,
    waUpiLine: (link) => `UPI ద్వారా చెల్లించండి: ${link}`,
    waClosing: 'దయచేసి వీలైనప్పుడు బకాయి చెల్లించండి.\n\nధన్యవాదాలు!',
    readAmountBtn: 'మొత్తం చదవండి (OCR)',
    ocrScanning: 'స్క్రీన్‌షాట్ చదువుతోంది...',
    ocrDetected: (amt) => `సూచించిన మొత్తం: ${amt}`,
    ocrUseBtn: (amt) => `${amt} వాడండి`,
    ocrNotFound: 'మొత్తం స్పష్టంగా కనిపించలేదు. దయచేసి స్వయంగా నమోదు చేయండి.',
    ocrUnavailable: 'ఆఫ్‌లైన్‌లో OCR అందుబాటులో లేదు. దయచేసి స్వయంగా నమోదు చేయండి.',
    errStorageFull: 'స్టోరేజ్ నిండిపోయింది. సేవ్ చేయలేకపోయాము — పాత స్క్రీన్‌షాట్లు తొలగించండి.',
  },
};

/* ==========================================================================
   2. Application State
   ========================================================================== */
let state = {
  shop: 'My Kirana Store',
  upiId: '',
  customers: [], // { name, phone }
  entries: [],   // { id, phone, type: 'credit'|'payment', amountPaise, date: 'YYYY-MM-DD', note, shotDataUrl? }
};

let uiState = {
  lang: 'en',
  activeTab: 'all',          // 'all' | 'overdue'
  searchQuery: '',
  selectedPhone: null,       // null = dashboard, string = customer ledger
  pendingShotDataUrl: null,  // currently staged screenshot on entry form
  confirmCallback: null,
};

/* ==========================================================================
   3. Date & Currency Utilities (IST-safe local dates, paise integer math)
   ========================================================================== */

/**
 * Returns the application's "today" as YYYY-MM-DD.
 * Honours ?today=YYYY-MM-DD in the URL if present and valid; otherwise uses local date.
 */
function getAppToday() {
  const params = new URLSearchParams(window.location.search);
  const override = params.get('today');
  if (override && isValidIsoDate(override)) {
    return override;
  }
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isValidIsoDate(str) {
  if (typeof str !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const [y, m, d] = str.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

function parseIsoDateLocal(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function diffDays(fromIso, toIso) {
  const from = parseIsoDateLocal(fromIso);
  const to = parseIsoDateLocal(toIso);
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

function formatDisplayDate(iso) {
  if (!isValidIsoDate(iso)) return iso;
  const dt = parseIsoDateLocal(iso);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function rupeesToPaise(val) {
  if (val === null || val === undefined || typeof val === 'boolean') return NaN;
  if (typeof val === 'string' && val.trim() === '') return NaN;
  const num = Number(val);
  if (!Number.isFinite(num)) return NaN;
  return Math.round(num * 100);
}

function paiseToRupeesNumber(paise) {
  return paise / 100;
}

/**
 * Formats integer paise into Indian Rupee string (e.g. ₹11,820 or ₹11,820.50).
 */
function formatRupees(paise) {
  const isNeg = paise < 0;
  const absPaise = Math.abs(paise);
  const hasDecimals = absPaise % 100 !== 0;
  const num = absPaise / 100;
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `${isNeg ? '-' : ''}₹${formatted}`;
}

function formatUpiAmount(paise) {
  const num = Math.max(0, paise) / 100;
  return paise % 100 === 0 ? String(num) : num.toFixed(2);
}

function generateId() {
  return `e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function t(key, ...args) {
  const dict = I18N[uiState.lang] || I18N.en;
  const val = dict[key] !== undefined ? dict[key] : I18N.en[key];
  return typeof val === 'function' ? val(...args) : val;
}

/* ==========================================================================
   4. Balance & Overdue Calculations (Always derived from transaction records)
   ========================================================================== */

/**
 * Computes credit, payment, balance, and overdue metrics for every customer.
 */
function computeAllCustomerMetrics() {
  const today = getAppToday();
  const byPhone = new Map();

  for (const cust of state.customers) {
    byPhone.set(cust.phone, {
      customer: cust,
      creditPaise: 0,
      paymentPaise: 0,
      balancePaise: 0,
      entryCount: 0,
      lastPaymentDate: null,
      oldestCreditDate: null,
      overdueDays: 0,
      overdueRefDate: null,
      hasPaidBefore: false,
    });
  }

  for (const entry of state.entries) {
    const rec = byPhone.get(entry.phone);
    if (!rec) continue;
    rec.entryCount += 1;
    if (entry.type === 'credit') {
      rec.creditPaise += entry.amountPaise;
      if (!rec.oldestCreditDate || entry.date < rec.oldestCreditDate) {
        rec.oldestCreditDate = entry.date;
      }
    } else if (entry.type === 'payment') {
      rec.paymentPaise += entry.amountPaise;
      rec.hasPaidBefore = true;
      if (!rec.lastPaymentDate || entry.date > rec.lastPaymentDate) {
        rec.lastPaymentDate = entry.date;
      }
    }
  }

  let shopCreditPaise = 0;
  let shopPaymentPaise = 0;
  let totalOutstandingPaise = 0;
  let pendingCustomersCount = 0;

  for (const rec of byPhone.values()) {
    rec.balancePaise = rec.creditPaise - rec.paymentPaise;
    shopCreditPaise += rec.creditPaise;
    shopPaymentPaise += rec.paymentPaise;
    totalOutstandingPaise += rec.balancePaise;

    if (rec.balancePaise > 0) {
      pendingCustomersCount += 1;
      const refDate = rec.lastPaymentDate || rec.oldestCreditDate || today;
      rec.overdueRefDate = refDate;
      rec.overdueDays = Math.max(0, diffDays(refDate, today));
    }
  }

  return {
    byPhone,
    shopCreditPaise,
    shopPaymentPaise,
    totalOutstandingPaise,
    pendingCustomersCount,
  };
}

/**
 * Builds the WhatsApp click-to-chat reminder URL (and optional UPI link).
 */
function buildWhatsAppUrl(customer, balancePaise) {
  const amtText = formatRupees(balancePaise);
  const lines = [
    t('waGreeting', customer.name),
    '',
    t('waBody', state.shop || t('defaultShopName'), amtText),
  ];

  const upiLink = buildUpiUrl(balancePaise);
  if (upiLink) {
    lines.push('', t('waUpiLine', upiLink));
  }

  lines.push('', t('waClosing'));
  const message = lines.join('\n');
  return `https://wa.me/91${customer.phone}?text=${encodeURIComponent(message)}`;
}

function buildUpiUrl(balancePaise) {
  const upi = (state.upiId || '').trim();
  if (!upi || balancePaise <= 0) return '';
  return `upi://pay?pa=${encodeURIComponent(upi)}&am=${formatUpiAmount(balancePaise)}&cu=INR`;
}

/* ==========================================================================
   5. LocalStorage Persistence
   ========================================================================== */

function loadFromStorage() {
  try {
    const savedLang = localStorage.getItem(LANG_KEY);
    if (savedLang && I18N[savedLang]) {
      uiState.lang = savedLang;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return;

    const customers = Array.isArray(parsed.customers)
      ? parsed.customers.filter((c) => c && typeof c.name === 'string' && /^\d{10}$/.test(String(c.phone)))
      : [];

    const validPhones = new Set(customers.map((c) => String(c.phone)));

    const entries = Array.isArray(parsed.entries)
      ? parsed.entries
          .filter(
            (e) =>
              e &&
              validPhones.has(String(e.phone)) &&
              (e.type === 'credit' || e.type === 'payment') &&
              Number.isFinite(Number(e.amountPaise)) &&
              Number(e.amountPaise) > 0 &&
              isValidIsoDate(e.date)
          )
          .map((e) => ({
            id: e.id || generateId(),
            phone: String(e.phone),
            type: e.type,
            amountPaise: Math.round(Number(e.amountPaise)),
            date: e.date,
            note: typeof e.note === 'string' ? e.note : '',
            shotDataUrl: typeof e.shotDataUrl === 'string' ? e.shotDataUrl : '',
          }))
      : [];

    state = {
      shop: typeof parsed.shop === 'string' && parsed.shop.trim() ? parsed.shop.trim() : t('defaultShopName'),
      upiId: typeof parsed.upiId === 'string' ? parsed.upiId.trim() : '',
      customers: customers.map((c) => ({ name: c.name.trim(), phone: String(c.phone) })),
      entries,
    };
  } catch (err) {
    console.warn('Could not load saved Hisaab data:', err);
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
    showToast(t('errStorageFull'));
    return false;
  }
}

function commitStateChange(mutator) {
  const snapshot = {
    shop: state.shop,
    upiId: state.upiId,
    customers: state.customers.map((c) => ({ ...c })),
    entries: state.entries.map((e) => ({ ...e })),
  };
  mutator();
  if (!saveToStorage()) {
    state = snapshot;
    return false;
  }
  return true;
}

/* ==========================================================================
   6. JSON Import Validation & Replacement
   ========================================================================== */

/**
 * Validates and imports a shop JSON string.
 * Replaces existing shop data ONLY after full validation succeeds.
 */
function importShopJson(rawText) {
  const trimmed = (rawText || '').trim();
  if (!trimmed) {
    return { ok: false, error: t('errJsonEmpty') };
  }

  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { ok: false, error: t('errJsonInvalid') };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: 'JSON root must be an object with shop, customers, and entries.' };
  }

  const shopName = typeof parsed.shop === 'string' && parsed.shop.trim() ? parsed.shop.trim() : t('defaultShopName');

  if (!Array.isArray(parsed.customers)) {
    return { ok: false, error: 'JSON must contain a "customers" array.' };
  }
  if (!Array.isArray(parsed.entries)) {
    return { ok: false, error: 'JSON must contain an "entries" array.' };
  }

  const newCustomers = [];
  const phoneSet = new Set();

  for (let i = 0; i < parsed.customers.length; i++) {
    const c = parsed.customers[i];
    if (!c || typeof c !== 'object') {
      return { ok: false, error: `Customer at index ${i} is invalid.` };
    }
    const name = typeof c.name === 'string' ? c.name.trim() : '';
    const phone = String(c.phone || '').trim();
    if (!name) {
      return { ok: false, error: `Customer at index ${i} is missing a name.` };
    }
    if (!/^\d{10}$/.test(phone)) {
      return { ok: false, error: `Customer "${name}" has an invalid 10-digit phone number (${phone}).` };
    }
    if (phoneSet.has(phone)) {
      return { ok: false, error: `Duplicate phone number found in import: ${phone}.` };
    }
    phoneSet.add(phone);
    newCustomers.push({ name, phone });
  }

  const newEntries = [];
  for (let i = 0; i < parsed.entries.length; i++) {
    const e = parsed.entries[i];
    if (!e || typeof e !== 'object') {
      return { ok: false, error: `Entry at index ${i} is invalid.` };
    }
    const phone = String(e.phone || '').trim();
    if (!phoneSet.has(phone)) {
      return { ok: false, error: `Entry at index ${i} references unknown customer phone ${phone}.` };
    }
    if (e.type !== 'credit' && e.type !== 'payment') {
      return { ok: false, error: `Entry at index ${i} has invalid type "${e.type}". Use "credit" or "payment".` };
    }
    const amountPaise = rupeesToPaise(e.amount);
    if (!Number.isFinite(amountPaise) || amountPaise <= 0) {
      return { ok: false, error: `Entry at index ${i} has invalid amount "${e.amount}".` };
    }
    if (!isValidIsoDate(e.date)) {
      return { ok: false, error: `Entry at index ${i} has invalid date "${e.date}". Use YYYY-MM-DD.` };
    }

    newEntries.push({
      id: generateId(),
      phone,
      type: e.type,
      amountPaise,
      date: e.date,
      note: typeof e.note === 'string' ? e.note.trim() : '',
      shotDataUrl: typeof e.shotDataUrl === 'string' ? e.shotDataUrl : '',
    });
  }

  // Validation passed — replace shop data atomically (roll back if storage is full)
  const saved = commitStateChange(() => {
    state = {
      shop: shopName,
      upiId: typeof parsed.upiId === 'string' ? parsed.upiId.trim() : '',
      customers: newCustomers,
      entries: newEntries,
    };
  });

  if (!saved) {
    return { ok: false, error: t('errStorageFull') };
  }
  return { ok: true, shop: shopName, customerCount: newCustomers.length };
}

/* ==========================================================================
   7. Payment Screenshot Compression (FileReader + Canvas fallback)
   ========================================================================== */

function readAndCompressScreenshot(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.onload = () => {
      const rawDataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!rawDataUrl) {
        reject(new Error('Empty image file.'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 720;
          let { width, height } = img;
          if (!width || !height) {
            resolve(rawDataUrl);
            return;
          }
          if (width > maxDim || height > maxDim) {
            const ratio = Math.min(maxDim / width, maxDim / height);
            width = Math.max(1, Math.round(width * ratio));
            height = Math.max(1, Math.round(height * ratio));
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.72);
          resolve(compressed.length < rawDataUrl.length ? compressed : rawDataUrl);
        } catch {
          resolve(rawDataUrl);
        }
      };
      img.onerror = () => {
        // Fallback to raw data URL (useful for minimal synthetic images in automated tests)
        resolve(rawDataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/* ==========================================================================
   7B. Optional Client-Side OCR for Payment Screenshots (Lazy-loaded)
   ========================================================================== */

let tesseractLoadPromise = null;
function loadTesseractScript() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (tesseractLoadPromise) return tesseractLoadPromise;
  tesseractLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TESSERACT_CDN_URL;
    script.async = true;
    script.onload = () => (window.Tesseract ? resolve(window.Tesseract) : reject(new Error('Tesseract missing')));
    script.onerror = () => {
      tesseractLoadPromise = null;
      reject(new Error('Failed to load OCR library'));
    };
    document.head.appendChild(script);
  });
  return tesseractLoadPromise;
}

/**
 * Extracts the most plausible payment amount (in rupees) from OCR text.
 * Prioritises currency-prefixed values (₹, Rs, INR) and ignores 10-digit phone numbers.
 */
function extractAmountFromOcrText(text) {
  if (!text || typeof text !== 'string') return null;
  const cleaned = text.replace(/,/g, '');

  const currencyRegex = /(?:₹|rs\.?|inr|paid|amount)\s*[:\-]?\s*(\d{1,6}(?:\.\d{1,2})?)/gi;
  const currencyMatches = [];
  let m;
  while ((m = currencyRegex.exec(cleaned)) !== null) {
    const val = Number(m[1]);
    if (Number.isFinite(val) && val > 0 && val <= 500000) {
      currencyMatches.push(val);
    }
  }
  if (currencyMatches.length > 0) {
    return currencyMatches[0];
  }

  // Fallback: standalone 1-6 digit numbers that are not 10-digit phone numbers or 4-digit years
  const numRegex = /\b(\d{1,6}(?:\.\d{1,2})?)\b/g;
  const candidates = [];
  while ((m = numRegex.exec(cleaned)) !== null) {
    const raw = m[1];
    const val = Number(raw);
    if (!Number.isFinite(val) || val <= 0 || val > 500000) continue;
    if (/^(19|20)\d{2}$/.test(raw)) continue;
    candidates.push(val);
  }
  if (candidates.length > 0) {
    return Math.max(...candidates);
  }
  return null;
}

async function runOcrOnPendingScreenshot() {
  if (!uiState.pendingShotDataUrl) return;
  const box = document.getElementById('ocr-suggestion-box');
  const statusEl = document.getElementById('ocr-status-text');
  const applyBtn = document.getElementById('ocr-apply-btn');
  const readBtn = document.getElementById('ocr-read-btn');

  box.classList.remove('hidden');
  applyBtn.classList.add('hidden');
  statusEl.textContent = t('ocrScanning');
  readBtn.disabled = true;

  try {
    const Tesseract = await loadTesseractScript();
    const result = await Tesseract.recognize(uiState.pendingShotDataUrl, 'eng');
    const detected = extractAmountFromOcrText(result?.data?.text || '');
    if (detected !== null) {
      const paise = rupeesToPaise(detected);
      const label = formatRupees(paise);
      statusEl.textContent = t('ocrDetected', label);
      applyBtn.textContent = t('ocrUseBtn', label);
      applyBtn.dataset.amount = String(paiseToRupeesNumber(paise));
      applyBtn.classList.remove('hidden');
    } else {
      statusEl.textContent = t('ocrNotFound');
    }
  } catch {
    statusEl.textContent = t('ocrUnavailable');
  } finally {
    readBtn.disabled = false;
  }
}

/* ==========================================================================
   8. CSV Export
   ========================================================================== */

function escapeCsvCell(val) {
  const str = String(val ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function exportLedgerCsv() {
  const nameByPhone = new Map(state.customers.map((c) => [c.phone, c.name]));
  const header = ['Customer Name', 'Phone', 'Type', 'Amount', 'Date', 'Note'];

  const sortedEntries = [...state.entries].sort((a, b) => b.date.localeCompare(a.date));
  const rows = [header.join(',')];

  for (const e of sortedEntries) {
    rows.push(
      [
        escapeCsvCell(nameByPhone.get(e.phone) || ''),
        escapeCsvCell(e.phone),
        escapeCsvCell(e.type),
        escapeCsvCell(paiseToRupeesNumber(e.amountPaise)),
        escapeCsvCell(e.date),
        escapeCsvCell(e.note || ''),
      ].join(',')
    );
  }

  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hisaab-${getAppToday()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(t('toastCsvDownloaded'));
}

/* ==========================================================================
   9. Rendering
   ========================================================================== */

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (typeof text === 'string') {
      el.textContent = text;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = t(key);
    if (typeof text === 'string') {
      el.setAttribute('placeholder', text);
    }
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === uiState.lang);
  });
}

function renderApp() {
  applyTranslations();
  syncThemeIcons();

  // Header & mobile strip metadata
  const shopDisplay = state.shop || t('defaultShopName');
  const dateDisplay = formatDisplayDate(getAppToday());
  document.getElementById('header-shop-name').textContent = shopDisplay;
  document.getElementById('header-today-date').textContent = dateDisplay;
  document.getElementById('mobile-shop-name').textContent = shopDisplay;
  document.getElementById('mobile-today-date').textContent = dateDisplay;

  // Sync shop settings inputs
  document.getElementById('shop-name-input').value = state.shop || '';
  document.getElementById('shop-upi-input').value = state.upiId || '';

  const metrics = computeAllCustomerMetrics();

  // Always keep dashboard summary updated (even if ledger is open)
  document.getElementById('total-outstanding').textContent = formatRupees(metrics.totalOutstandingPaise);
  document.getElementById('summary-total-credit').textContent = formatRupees(metrics.shopCreditPaise);
  document.getElementById('summary-total-payment').textContent = formatRupees(metrics.shopPaymentPaise);
  document.getElementById('summary-pending-count').textContent = `${metrics.pendingCustomersCount} / ${state.customers.length}`;

  const dashboardEl = document.getElementById('dashboard-view');
  const ledgerEl = document.getElementById('ledger-view');

  if (uiState.selectedPhone) {
    const exists = state.customers.some((c) => c.phone === uiState.selectedPhone);
    if (!exists) {
      uiState.selectedPhone = null;
    }
  }

  if (uiState.selectedPhone) {
    dashboardEl.classList.add('hidden');
    ledgerEl.classList.remove('hidden');
    renderCustomerLedger(uiState.selectedPhone, metrics);
  } else {
    ledgerEl.classList.add('hidden');
    dashboardEl.classList.remove('hidden');
    renderCustomerList(metrics);
  }

  updateBottomNavState();
}

function renderCustomerList(metrics) {
  const listEl = document.getElementById('customer-list');
  const emptyEl = document.getElementById('empty-customers-state');
  const headingEl = document.getElementById('list-heading');
  const subtitleEl = document.getElementById('list-subtitle');

  const isOverdueTab = uiState.activeTab === 'overdue';
  document.getElementById('tab-all-customers').classList.toggle('active', !isOverdueTab);
  document.getElementById('tab-all-customers').setAttribute('aria-selected', String(!isOverdueTab));
  document.getElementById('tab-overdue-list').classList.toggle('active', isOverdueTab);
  document.getElementById('tab-overdue-list').setAttribute('aria-selected', String(isOverdueTab));

  headingEl.textContent = isOverdueTab ? t('overdueListTitle') : t('customerListTitle');
  subtitleEl.textContent = isOverdueTab ? t('sortedByDaysOverdue') : t('sortedByHighestDue');

  const query = uiState.searchQuery.trim().toLowerCase();
  let records = Array.from(metrics.byPhone.values());

  if (isOverdueTab) {
    records = records.filter((r) => r.balancePaise > 0);
  }

  if (query) {
    records = records.filter(
      (r) => r.customer.name.toLowerCase().includes(query) || r.customer.phone.includes(query)
    );
  }

  if (isOverdueTab) {
    records.sort((a, b) => {
      if (b.overdueDays !== a.overdueDays) return b.overdueDays - a.overdueDays;
      return b.balancePaise - a.balancePaise;
    });
  } else {
    records.sort((a, b) => {
      if (b.balancePaise !== a.balancePaise) return b.balancePaise - a.balancePaise;
      return a.customer.name.localeCompare(b.customer.name);
    });
  }

  listEl.innerHTML = '';

  if (records.length === 0) {
    emptyEl.classList.remove('hidden');
    const titleNode = emptyEl.querySelector('.empty-title');
    const descNode = emptyEl.querySelector('.empty-desc');
    if (state.customers.length === 0) {
      titleNode.textContent = t('noCustomersTitle');
      descNode.textContent = t('noCustomersDesc');
    } else if (query) {
      titleNode.textContent = t('noMatchingCustomers');
      descNode.textContent = '';
    } else {
      titleNode.textContent = t('noOverdueCustomers');
      descNode.textContent = '';
    }
    return;
  }

  emptyEl.classList.add('hidden');

  const fragment = document.createDocumentFragment();

  for (const rec of records) {
    const { customer, balancePaise } = rec;
    const row = document.createElement('div');
    row.className = 'customer-row';
    row.setAttribute('data-customer', customer.phone);

    // Main clickable info + balance
    const main = document.createElement('div');
    main.className = 'customer-row-main';

    const identity = document.createElement('div');
    identity.className = 'customer-identity';
    identity.setAttribute('role', 'button');
    identity.setAttribute('tabindex', '0');
    identity.addEventListener('click', () => openCustomerLedger(customer.phone));
    identity.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        openCustomerLedger(customer.phone);
      }
    });

    const nameEl = document.createElement('h3');
    nameEl.className = 'customer-name';
    nameEl.textContent = customer.name;

    const metaEl = document.createElement('div');
    metaEl.className = 'customer-meta tabular-nums';

    const phoneSpan = document.createElement('span');
    phoneSpan.textContent = customer.phone;
    metaEl.appendChild(phoneSpan);

    if (balancePaise > 0 && rec.overdueRefDate) {
      const sep1 = document.createElement('span');
      sep1.textContent = '·';
      sep1.setAttribute('aria-hidden', 'true');
      metaEl.appendChild(sep1);

      const overdueSpan = document.createElement('span');
      overdueSpan.className = 'overdue-note';
      overdueSpan.textContent = t('daysOverdue', rec.overdueDays);
      metaEl.appendChild(overdueSpan);

      if (isOverdueTab) {
        const sep2 = document.createElement('span');
        sep2.textContent = '·';
        sep2.setAttribute('aria-hidden', 'true');
        metaEl.appendChild(sep2);

        const refSpan = document.createElement('span');
        refSpan.textContent = rec.hasPaidBefore
          ? t('lastPaidOn', formatDisplayDate(rec.lastPaymentDate))
          : t('noPaymentYet', formatDisplayDate(rec.overdueRefDate));
        metaEl.appendChild(refSpan);
      }
    }

    identity.appendChild(nameEl);
    identity.appendChild(metaEl);

    const balCol = document.createElement('div');
    balCol.className = 'customer-balance-col';

    const balSpan = document.createElement('span');
    balSpan.className = `balance-value tabular-nums ${balancePaise > 0 ? 'balance-due' : 'balance-settled'}`;
    balSpan.setAttribute('data-balance', '');
    balSpan.textContent = formatRupees(balancePaise);

    const balCaption = document.createElement('span');
    balCaption.className = 'balance-caption';
    balCaption.textContent = balancePaise > 0 ? t('balanceDue') : t('settled');

    balCol.appendChild(balSpan);
    balCol.appendChild(balCaption);

    main.appendChild(identity);
    main.appendChild(balCol);

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'customer-row-actions';

    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'btn btn-secondary btn-sm';
    openBtn.textContent = t('openLedger');
    openBtn.addEventListener('click', () => openCustomerLedger(customer.phone));
    actions.appendChild(openBtn);

    if (balancePaise > 0) {
      const waLink = document.createElement('a');
      waLink.className = 'btn btn-whatsapp btn-sm';
      waLink.setAttribute('data-remind', customer.phone);
      waLink.href = buildWhatsAppUrl(customer, balancePaise);
      waLink.target = '_blank';
      waLink.rel = 'noopener noreferrer';
      waLink.textContent = t('remindBtn');
      actions.appendChild(waLink);

      const upiUrl = buildUpiUrl(balancePaise);
      if (upiUrl) {
        const upiLink = document.createElement('a');
        upiLink.className = 'btn btn-upi btn-sm';
        upiLink.href = upiUrl;
        upiLink.textContent = t('upiPayBtn');
        actions.appendChild(upiLink);
      }
    } else {
      const settledSpan = document.createElement('span');
      settledSpan.className = 'settled-label';
      settledSpan.textContent = t('settled');
      actions.appendChild(settledSpan);
    }

    row.appendChild(main);
    row.appendChild(actions);
    fragment.appendChild(row);
  }

  listEl.appendChild(fragment);
}

function renderCustomerLedger(phone, metrics) {
  const rec = metrics.byPhone.get(phone);
  if (!rec) return;

  const { customer, creditPaise, paymentPaise, balancePaise, entryCount } = rec;

  document.getElementById('ledger-customer-name').textContent = customer.name;
  document.getElementById('ledger-customer-phone').textContent = `+91 ${customer.phone}`;

  const balEl = document.getElementById('ledger-current-balance');
  balEl.textContent = formatRupees(balancePaise);
  balEl.className = `ledger-balance-value tabular-nums ${balancePaise > 0 ? 'balance-due' : 'balance-settled'}`;

  document.getElementById('ledger-total-credit').textContent = formatRupees(creditPaise);
  document.getElementById('ledger-total-payment').textContent = formatRupees(paymentPaise);
  document.getElementById('ledger-entries-count').textContent = String(entryCount);

  // Quick WhatsApp & UPI actions
  const quickActions = document.getElementById('ledger-quick-actions');
  quickActions.innerHTML = '';
  if (balancePaise > 0) {
    const waLink = document.createElement('a');
    waLink.className = 'btn btn-whatsapp btn-sm';
    waLink.setAttribute('data-remind', customer.phone);
    waLink.href = buildWhatsAppUrl(customer, balancePaise);
    waLink.target = '_blank';
    waLink.rel = 'noopener noreferrer';
    waLink.textContent = t('remindBtn');
    quickActions.appendChild(waLink);

    const upiUrl = buildUpiUrl(balancePaise);
    if (upiUrl) {
      const upiLink = document.createElement('a');
      upiLink.className = 'btn btn-upi btn-sm';
      upiLink.href = upiUrl;
      upiLink.textContent = t('upiPayBtn');
      quickActions.appendChild(upiLink);
    }
  }

  // Render transactions newest first (preserve reverse insertion order for same-day entries)
  const customerEntries = state.entries
    .map((e, idx) => ({ e, idx }))
    .filter((item) => item.e.phone === phone)
    .sort((a, b) => {
      const dateCmp = b.e.date.localeCompare(a.e.date);
      if (dateCmp !== 0) return dateCmp;
      return b.idx - a.idx;
    })
    .map((item) => item.e);

  const listEl = document.getElementById('ledger-entries-list');
  const emptyEl = document.getElementById('empty-entries-state');
  listEl.innerHTML = '';

  if (customerEntries.length === 0) {
    emptyEl.classList.remove('hidden');
    return;
  }

  emptyEl.classList.add('hidden');
  const fragment = document.createDocumentFragment();

  for (const entry of customerEntries) {
    const row = document.createElement('div');
    row.className = 'entry-row';

    const top = document.createElement('div');
    top.className = 'entry-top';

    const left = document.createElement('div');
    const typeLabel = document.createElement('div');
    typeLabel.className = `entry-type-label ${entry.type === 'credit' ? 'entry-type-credit' : 'entry-type-payment'}`;
    typeLabel.textContent = entry.type === 'credit' ? t('creditGiven') : t('paymentReceived');

    const dateEl = document.createElement('div');
    dateEl.className = 'entry-date tabular-nums';
    dateEl.textContent = `${formatDisplayDate(entry.date)} (${entry.date})`;

    left.appendChild(typeLabel);
    left.appendChild(dateEl);

    const amountEl = document.createElement('div');
    amountEl.className = `entry-amount tabular-nums ${entry.type === 'credit' ? 'text-credit' : 'text-payment'}`;
    amountEl.textContent = `${entry.type === 'credit' ? '+' : '−'} ${formatRupees(entry.amountPaise)}`;

    top.appendChild(left);
    top.appendChild(amountEl);
    row.appendChild(top);

    if (entry.note) {
      const noteEl = document.createElement('p');
      noteEl.className = 'entry-note';
      noteEl.textContent = entry.note;
      row.appendChild(noteEl);
    }

    const bottom = document.createElement('div');
    bottom.className = 'entry-bottom';

    if (entry.shotDataUrl) {
      const img = document.createElement('img');
      img.className = 'entry-shot-thumb';
      img.setAttribute('data-shot', '');
      img.src = entry.shotDataUrl;
      img.alt = `Payment screenshot on ${entry.date}`;
      img.addEventListener('click', () => openImageModal(entry.shotDataUrl, `${formatRupees(entry.amountPaise)} · ${entry.date}`));
      bottom.appendChild(img);
    }

    const actions = document.createElement('div');
    actions.className = 'entry-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'text-link-btn';
    editBtn.textContent = t('editBtn');
    editBtn.addEventListener('click', () => startEditingEntry(entry));

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'text-link-btn danger-link';
    delBtn.textContent = t('deleteBtn');
    delBtn.addEventListener('click', () => confirmDeleteEntry(entry.id));

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    bottom.appendChild(actions);

    row.appendChild(bottom);
    fragment.appendChild(row);
  }

  listEl.appendChild(fragment);
}

/* ==========================================================================
   10. Navigation & Form Helpers
   ========================================================================== */

function openCustomerLedger(phone) {
  uiState.selectedPhone = phone;
  resetEntryForm();
  renderApp();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function goBackToDashboard() {
  uiState.selectedPhone = null;
  resetEntryForm();
  renderApp();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function resetEntryForm() {
  const form = document.getElementById('entry-form');
  form.reset();
  document.getElementById('editing-entry-id').value = '';
  document.getElementById('entry-date').value = getAppToday();
  document.getElementById('entry-form-title').textContent = t('addEntryTitle');
  document.getElementById('save-entry-btn').textContent = t('saveEntryBtn');
  document.getElementById('cancel-edit-btn').classList.add('hidden');
  document.getElementById('entry-form-error').classList.add('hidden');

  uiState.pendingShotDataUrl = null;
  document.getElementById('shot-input').value = '';
  document.getElementById('shot-preview-wrap').classList.add('hidden');
  document.getElementById('shot-preview-img').src = '';
  document.getElementById('ocr-suggestion-box').classList.add('hidden');
  document.getElementById('ocr-apply-btn').classList.add('hidden');

  syncEntryTypeVisibility();
}

function syncEntryTypeVisibility() {
  const selectedType = document.querySelector('input[name="entry-type"]:checked')?.value || 'credit';
  const shotGroup = document.getElementById('screenshot-field-group');
  if (selectedType === 'payment') {
    shotGroup.classList.remove('hidden');
  } else {
    shotGroup.classList.add('hidden');
  }
}

function startEditingEntry(entry) {
  document.getElementById('editing-entry-id').value = entry.id;
  const radio = document.querySelector(`input[name="entry-type"][value="${entry.type}"]`);
  if (radio) radio.checked = true;
  document.getElementById('entry-amount').value = paiseToRupeesNumber(entry.amountPaise);
  document.getElementById('entry-date').value = entry.date;
  document.getElementById('entry-note').value = entry.note || '';

  uiState.pendingShotDataUrl = entry.shotDataUrl || null;
  const previewWrap = document.getElementById('shot-preview-wrap');
  const previewImg = document.getElementById('shot-preview-img');
  if (entry.type === 'payment' && uiState.pendingShotDataUrl) {
    previewImg.src = uiState.pendingShotDataUrl;
    previewWrap.classList.remove('hidden');
  } else {
    previewImg.src = '';
    previewWrap.classList.add('hidden');
  }

  document.getElementById('entry-form-title').textContent = t('editEntryTitle');
  document.getElementById('save-entry-btn').textContent = t('updateEntryBtn');
  document.getElementById('cancel-edit-btn').classList.remove('hidden');
  document.getElementById('entry-form-error').classList.add('hidden');
  syncEntryTypeVisibility();

  document.getElementById('entry-form').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function confirmDeleteEntry(entryId) {
  openConfirmModal(t('confirmDeleteEntryTitle'), t('confirmDeleteEntryMsg'), () => {
    const saved = commitStateChange(() => {
      state.entries = state.entries.filter((e) => e.id !== entryId);
    });
    if (!saved) return;
    if (document.getElementById('editing-entry-id').value === entryId) {
      resetEntryForm();
    }
    renderApp();
    showToast(t('toastEntryDeleted'));
  });
}

/* ==========================================================================
   10B. Light / Dark Theme Management
   ========================================================================== */

function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme, persist = false) {
  const normalized = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', normalized);
  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, normalized);
    } catch {}
  }
  syncThemeIcons();
}

function syncThemeIcons() {
  const isDark = getCurrentTheme() === 'dark';
  const moon = document.getElementById('theme-icon-moon');
  const sun = document.getElementById('theme-icon-sun');
  if (moon && sun) {
    moon.classList.toggle('hidden', isDark);
    sun.classList.toggle('hidden', !isDark);
  }
}

function updateBottomNavState() {
  document.querySelectorAll('.bottom-nav-item').forEach((btn) => {
    const target = btn.dataset.nav;
    const active =
      (!uiState.selectedPhone && target === 'customers' && uiState.activeTab === 'all') ||
      (!uiState.selectedPhone && target === 'overdue' && uiState.activeTab === 'overdue');
    btn.classList.toggle('active', active);
  });
}

/* ==========================================================================
   11. Modals & Toast Notifications (Zero window.alert / window.confirm)
   ========================================================================== */

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.add('hidden');
  }, 2800);
}

function openConfirmModal(title, message, onConfirm) {
  uiState.confirmCallback = onConfirm;
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-message').textContent = message;
  document.getElementById('confirm-modal').classList.remove('hidden');
}

function closeConfirmModal() {
  uiState.confirmCallback = null;
  document.getElementById('confirm-modal').classList.add('hidden');
}

function openImageModal(src, caption) {
  document.getElementById('image-modal-img').src = src;
  document.getElementById('image-modal-caption').textContent = caption || 'Payment Screenshot';
  document.getElementById('image-modal').classList.remove('hidden');
}

function closeImageModal() {
  document.getElementById('image-modal').classList.add('hidden');
  document.getElementById('image-modal-img').src = '';
}

/* ==========================================================================
   12. Event Wiring
   ========================================================================== */

function bindEvents() {
  // Brand home click
  document.getElementById('brand-home-btn').addEventListener('click', () => {
    goBackToDashboard();
  });

  // Language switcher
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (I18N[lang]) {
        uiState.lang = lang;
        try {
          localStorage.setItem(LANG_KEY, lang);
        } catch {}
        renderApp();
      }
    });
  });

  // Theme toggle
  document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  });

  // Quick scroll to Add Customer form
  document.getElementById('open-add-customer-btn').addEventListener('click', () => {
    const section = document.getElementById('add-customer-section');
    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => document.getElementById('cust-name').focus(), 200);
  });

  // Search input
  document.getElementById('customer-search').addEventListener('input', (e) => {
    uiState.searchQuery = e.target.value;
    renderCustomerList(computeAllCustomerMetrics());
  });

  // View tabs
  document.getElementById('tab-all-customers').addEventListener('click', () => {
    uiState.activeTab = 'all';
    renderApp();
  });

  document.getElementById('tab-overdue-list').addEventListener('click', () => {
    uiState.activeTab = 'overdue';
    renderApp();
  });

  // Add Customer form
  document.getElementById('add-customer-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const errEl = document.getElementById('add-customer-error');
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.replace(/\D/g, '').trim();

    if (!name) {
      errEl.textContent = t('errNameRequired');
      errEl.classList.remove('hidden');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      errEl.textContent = t('errPhoneInvalid');
      errEl.classList.remove('hidden');
      return;
    }
    if (state.customers.some((c) => c.phone === phone)) {
      errEl.textContent = t('errPhoneDuplicate');
      errEl.classList.remove('hidden');
      return;
    }

    errEl.classList.add('hidden');
    const saved = commitStateChange(() => {
      state.customers.push({ name, phone });
    });
    if (!saved) {
      errEl.textContent = t('errStorageFull');
      errEl.classList.remove('hidden');
      return;
    }
    document.getElementById('add-customer-form').reset();
    renderApp();
    showToast(t('toastCustomerAdded'));
  });

  // JSON Import button (#import-go)
  document.getElementById('import-go').addEventListener('click', () => {
    const errEl = document.getElementById('import-error');
    const raw = document.getElementById('import-box').value;
    const result = importShopJson(raw);

    if (!result.ok) {
      errEl.textContent = result.error;
      errEl.classList.remove('hidden');
      return;
    }

    errEl.classList.add('hidden');
    uiState.selectedPhone = null;
    uiState.searchQuery = '';
    document.getElementById('customer-search').value = '';
    renderApp();
    showToast(t('toastImported', result.shop, result.customerCount));
  });

  // JSON File upload helper (FileReader API)
  document.getElementById('import-file-input').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById('import-box').value = typeof reader.result === 'string' ? reader.result : '';
      document.getElementById('import-go').click();
    };
    reader.onerror = () => {
      const errEl = document.getElementById('import-error');
      errEl.textContent = 'Could not read the selected file.';
      errEl.classList.remove('hidden');
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // Load Sample Shop button
  document.getElementById('load-sample-btn').addEventListener('click', async () => {
    const errEl = document.getElementById('import-error');
    try {
      const resp = await fetch(SAMPLE_DATA_URL);
      if (!resp.ok) throw new Error('Sample data not found');
      const text = await resp.text();
      document.getElementById('import-box').value = text;
      document.getElementById('import-go').click();
    } catch {
      errEl.textContent = 'Could not load sample shop file.';
      errEl.classList.remove('hidden');
    }
  });

  // Shop Settings form
  document.getElementById('shop-settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const shopName = document.getElementById('shop-name-input').value.trim();
    const upiId = document.getElementById('shop-upi-input').value.trim();
    const saved = commitStateChange(() => {
      state.shop = shopName || t('defaultShopName');
      state.upiId = upiId;
    });
    if (!saved) return;
    renderApp();
    showToast(t('toastSettingsSaved'));
  });

  // CSV Export
  document.getElementById('export-csv-btn').addEventListener('click', exportLedgerCsv);

  // Clear Shop Data
  document.getElementById('clear-data-btn').addEventListener('click', () => {
    openConfirmModal(t('confirmClearTitle'), t('confirmClearMsg'), () => {
      state = {
        shop: t('defaultShopName'),
        upiId: '',
        customers: [],
        entries: [],
      };
      uiState.selectedPhone = null;
      uiState.searchQuery = '';
      document.getElementById('customer-search').value = '';
      document.getElementById('import-box').value = '';
      saveToStorage();
      renderApp();
      showToast(t('toastCleared'));
    });
  });

  // Ledger Back button
  document.getElementById('back-to-dashboard-btn').addEventListener('click', goBackToDashboard);

  // Entry type radio toggle
  document.querySelectorAll('input[name="entry-type"]').forEach((radio) => {
    radio.addEventListener('change', syncEntryTypeVisibility);
  });

  // Payment screenshot input (#shot-input)
  document.getElementById('shot-input').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readAndCompressScreenshot(file);
      uiState.pendingShotDataUrl = dataUrl;
      document.getElementById('shot-preview-img').src = dataUrl;
      document.getElementById('shot-preview-wrap').classList.remove('hidden');
      document.getElementById('ocr-suggestion-box').classList.add('hidden');
      document.getElementById('ocr-apply-btn').classList.add('hidden');
    } catch {
      showToast('Could not read screenshot.');
    }
  });

  // Optional OCR amount detection button
  document.getElementById('ocr-read-btn').addEventListener('click', runOcrOnPendingScreenshot);

  // Apply OCR suggested amount into input (user still confirms & saves manually)
  document.getElementById('ocr-apply-btn').addEventListener('click', (e) => {
    const amt = e.currentTarget.dataset.amount;
    if (amt) {
      const input = document.getElementById('entry-amount');
      input.value = amt;
      input.focus();
    }
  });

  // Remove staged screenshot
  document.getElementById('remove-shot-btn').addEventListener('click', () => {
    uiState.pendingShotDataUrl = null;
    document.getElementById('shot-input').value = '';
    document.getElementById('shot-preview-img').src = '';
    document.getElementById('shot-preview-wrap').classList.add('hidden');
    document.getElementById('ocr-suggestion-box').classList.add('hidden');
    document.getElementById('ocr-apply-btn').classList.add('hidden');
  });

  // Cancel editing entry
  document.getElementById('cancel-edit-btn').addEventListener('click', resetEntryForm);

  // Add / Edit Entry form submission
  document.getElementById('entry-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!uiState.selectedPhone) return;

    const errEl = document.getElementById('entry-form-error');
    const editingId = document.getElementById('editing-entry-id').value;
    const type = document.querySelector('input[name="entry-type"]:checked')?.value || 'credit';
    const amountPaise = rupeesToPaise(document.getElementById('entry-amount').value);
    const date = document.getElementById('entry-date').value;
    const note = document.getElementById('entry-note').value.trim();

    if (!Number.isFinite(amountPaise) || amountPaise <= 0) {
      errEl.textContent = t('errAmountInvalid');
      errEl.classList.remove('hidden');
      return;
    }
    if (!isValidIsoDate(date)) {
      errEl.textContent = t('errDateInvalid');
      errEl.classList.remove('hidden');
      return;
    }

    // If a file is sitting in #shot-input and wasn't processed yet (e.g. fast automated submit), read it now
    const shotInput = document.getElementById('shot-input');
    if (type === 'payment' && !uiState.pendingShotDataUrl && shotInput.files?.[0]) {
      try {
        uiState.pendingShotDataUrl = await readAndCompressScreenshot(shotInput.files[0]);
      } catch {
        // Proceed without screenshot if unreadable
      }
    }

    const shotDataUrl = type === 'payment' ? uiState.pendingShotDataUrl || '' : '';
    errEl.classList.add('hidden');

    if (editingId) {
      const saved = commitStateChange(() => {
        const idx = state.entries.findIndex((item) => item.id === editingId);
        if (idx !== -1) {
          state.entries[idx] = {
            ...state.entries[idx],
            type,
            amountPaise,
            date,
            note,
            shotDataUrl,
          };
        }
      });
      if (!saved) {
        errEl.textContent = t('errStorageFull');
        errEl.classList.remove('hidden');
        return;
      }
      resetEntryForm();
      renderApp();
      showToast(t('toastEntryUpdated'));
    } else {
      const saved = commitStateChange(() => {
        state.entries.push({
          id: generateId(),
          phone: uiState.selectedPhone,
          type,
          amountPaise,
          date,
          note,
          shotDataUrl,
        });
      });
      if (!saved) {
        errEl.textContent = t('errStorageFull');
        errEl.classList.remove('hidden');
        return;
      }
      resetEntryForm();
      renderApp();
      showToast(t('toastEntrySaved'));
    }
  });

  // Mobile Bottom Nav
  document.querySelectorAll('.bottom-nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.nav;
      if (target === 'customers') {
        uiState.selectedPhone = null;
        uiState.activeTab = 'all';
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (target === 'overdue') {
        uiState.selectedPhone = null;
        uiState.activeTab = 'overdue';
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (target === 'add') {
        if (uiState.selectedPhone) {
          document.getElementById('entry-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
          document.getElementById('entry-amount').focus();
        } else {
          document.getElementById('add-customer-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
          document.getElementById('cust-name').focus();
        }
      } else if (target === 'tools') {
        uiState.selectedPhone = null;
        renderApp();
        setTimeout(() => {
          document.getElementById('import-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });
  });

  // Confirmation modal
  document.getElementById('confirm-cancel-btn').addEventListener('click', closeConfirmModal);
  document.getElementById('confirm-ok-btn').addEventListener('click', () => {
    const cb = uiState.confirmCallback;
    closeConfirmModal();
    if (cb) cb();
  });
  document.getElementById('confirm-modal').addEventListener('click', (e) => {
    if (e.target.id === 'confirm-modal') closeConfirmModal();
  });

  // Image lightbox modal
  document.getElementById('close-image-modal-btn').addEventListener('click', closeImageModal);
  document.getElementById('image-modal').addEventListener('click', (e) => {
    if (e.target.id === 'image-modal') closeImageModal();
  });

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeConfirmModal();
      closeImageModal();
    }
  });
}

/* ==========================================================================
   13. Bootstrap
   ========================================================================== */

function init() {
  loadFromStorage();
  bindEvents();
  document.getElementById('entry-date').value = getAppToday();
  renderApp();
}

init();
