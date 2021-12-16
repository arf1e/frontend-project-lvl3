import i18next from 'i18next';
import ru from './locales/ru';

// prettier-ignore
const init = () => i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});

export default init;
