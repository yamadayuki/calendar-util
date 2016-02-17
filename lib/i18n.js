'use strict';

import path from 'path';
import i18n from 'i18n';

export const locales = ['en', 'fr'];

i18n.configure({
  locales: locales,
  directory: path.join(__dirname, 'locales')
});

export default i18n;
