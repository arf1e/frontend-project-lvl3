import axios from 'axios';
import i18next from 'i18next';

export default {
  client: axios.create({
    baseURL: 'https://hexlet-allorigins.herokuapp.com/',
    timeout: 3000,
    timeoutErrorMessage: i18next.t('errors.networkError'),
  }),

  get(url) {
    return this.client.get(`get?url=${encodeURIComponent(url)}`).catch(() => {
      throw new Error(i18next.t('errors.networkError'));
    });
  },
};
