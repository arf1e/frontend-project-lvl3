import i18next from 'i18next';
import ru from './locales/ru';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './app';
import init from './init';

const state = init();
i18next
  .init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  })
  .then(() => app(state));
