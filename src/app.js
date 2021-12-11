import createWatchedState from './view';
import validate from './validate';
import FORM_STAGES from './utils';

const app = () => {
  const state = {
    feeds: [],
    posts: [],
    message: null,
    form: {
      isValid: true,
      stage: FORM_STAGES.idle,
      error: null,
    },
  };

  const form = document.querySelector('.rss-form');
  const input = form.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  const submitBtn = form.querySelector('button[type="submit"]');

  const watchedState = createWatchedState(state, {
    form,
    input,
    feedback,
    submitBtn,
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.stage = FORM_STAGES.submitting;
    const url = e.target.url.value;
    validate(url, watchedState.feeds)
      .then((data) => {
        // Success
        watchedState.feeds = [...watchedState.feeds, data.url];
        watchedState.form.isValid = true;
        watchedState.form.stage = FORM_STAGES.success;
        watchedState.form.error = null;
        watchedState.message = 'RSS Успешно загружен';
      })
      .catch((error) => {
        watchedState.message = null;
        watchedState.form.error = error.message;
        watchedState.form.isValid = false;
        watchedState.form.stage = FORM_STAGES.errored;
      });
  });
};

export default app;
