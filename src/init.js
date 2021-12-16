import i18next from 'i18next';
import ru from './locales/ru';

const init = () => {
  console.log('init');
  return i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });
};

export default init;
