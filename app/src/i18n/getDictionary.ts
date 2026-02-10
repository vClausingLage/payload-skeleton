import { defaultLocale, type Locale } from './config'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((mod) => mod.default),
  de: () => import('./dictionaries/de.json').then((mod) => mod.default),
}

export const getDictionary = async (locale: Locale) => {
  const loader = dictionaries[locale] ?? dictionaries[defaultLocale]
  return loader()
}
