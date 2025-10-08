import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
const locales = ['en', 'ar'] as const;
type Locale = typeof locales[number];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) notFound();

  let messages;
  try {
    if (locale === 'en') {
      messages = (await import('../../locales/en.json')).default;
    } else if (locale === 'ar') {
      messages = (await import('../../locales/ar.json')).default;
    } else {
      notFound();
    }
  } catch (error) {
    console.error('Failed to load messages for locale:', locale, error);
    notFound();
  }

  return {
    locale: locale as Locale,
    messages
  };
});
