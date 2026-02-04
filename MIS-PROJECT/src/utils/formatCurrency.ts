const LOCALE_BY_LANGUAGE: Record<string, string> = {
  en: 'en-GB',
  fa: 'fa-IR',
  es: 'es-ES',
  de: 'de-DE',
  fr: 'fr-FR'
};

export const resolveLocale = (localeOrLanguage?: string): string => {
  if (!localeOrLanguage) return 'en-GB';
  if (LOCALE_BY_LANGUAGE[localeOrLanguage]) return LOCALE_BY_LANGUAGE[localeOrLanguage];
  return localeOrLanguage;
};

export const formatCurrency = (
  amount: number,
  currency: string = 'EUR',
  locale: string = 'en-GB',
): string => {
  const resolvedLocale = resolveLocale(locale);
  try {
    return new Intl.NumberFormat(resolvedLocale, {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
};

export const getTranslation = (key: string, language: string): string => {
  const resolvedLanguage = language;

  const translations: Record<string, Record<string, string>> = {
    en: {
      welcome: 'Welcome',
      dashboard: 'Dashboard',
      totalSales: 'Total Sales',
      dailySales: 'Daily Sales',
      todaysOrders: 'Today\'s Orders',
      monthlyRevenue: 'Monthly Revenue',
      customerSatisfaction: 'Customer Satisfaction',
      branchPerformance: 'Branch Performance',
      quickStats: 'Quick Stats',
      recentActivity: 'Recent Activity',
      viewAll: 'View All',
      generateReport: 'Generate Report',
      settings: 'Settings',
      logout: 'Logout'
    },
    fa: {
      welcome: 'خوش آمدید',
      dashboard: 'داشبورد',
      totalSales: 'مجموع فروش',
      dailySales: 'فروش روزانه',
      todaysOrders: 'سفارش‌های امروز',
      monthlyRevenue: 'درآمد ماهانه',
      customerSatisfaction: 'رضایت مشتری',
      branchPerformance: 'عملکرد شعبه',
      quickStats: 'آمار سریع',
      recentActivity: 'فعالیت‌های اخیر',
      viewAll: 'مشاهده همه',
      generateReport: 'تولید گزارش',
      settings: 'تنظیمات',
      logout: 'خروج'
    },
    es: {
      welcome: 'Bienvenido',
      dashboard: 'Panel de control',
      totalSales: 'Ventas totales',
      dailySales: 'Ventas diarias',
      todaysOrders: 'Pedidos de hoy',
      monthlyRevenue: 'Ingresos mensuales',
      customerSatisfaction: 'Satisfacción del cliente',
      branchPerformance: 'Rendimiento de la sucursal',
      quickStats: 'Estadísticas rápidas',
      recentActivity: 'Actividad reciente',
      viewAll: 'Ver todo',
      generateReport: 'Generar informe',
      settings: 'Configuración',
      logout: 'Cerrar sesión'
    },
    de: {
      welcome: 'Willkommen',
      dashboard: 'Dashboard',
      totalSales: 'Gesamtumsatz',
      dailySales: 'Täglicher Umsatz',
      todaysOrders: 'Heutige Bestellungen',
      monthlyRevenue: 'Monatsumsatz',
      customerSatisfaction: 'Kundenzufriedenheit',
      branchPerformance: 'Filialleistung',
      quickStats: 'Schnellstatistiken',
      recentActivity: 'Letzte Aktivität',
      viewAll: 'Alle anzeigen',
      generateReport: 'Bericht erstellen',
      settings: 'Einstellungen',
      logout: 'Abmelden'
    },
    fr: {
      welcome: 'Bienvenue',
      dashboard: 'Tableau de bord',
      totalSales: 'Ventes totales',
      dailySales: 'Ventes quotidiennes',
      todaysOrders: 'Commandes d\'aujourd\'hui',
      monthlyRevenue: 'Revenus mensuels',
      customerSatisfaction: 'Satisfaction client',
      branchPerformance: 'Performance de la succursale',
      quickStats: 'Statistiques rapides',
      recentActivity: 'Activité récente',
      viewAll: 'Voir tout',
      generateReport: 'Générer un rapport',
      settings: 'Paramètres',
      logout: 'Se déconnecter'
    }
  };

  return translations[resolvedLanguage]?.[key] || translations.en[key] || key;
};