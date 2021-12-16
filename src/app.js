import i18next from 'i18next';
import createWatchedState from './view';
import validate from './validate';
import FORM_STAGES from './constants';
import ru from './locales/ru';
import handleAddFeed, { handleFeedUpdate } from './handlers';

const getElements = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    submitBtn: document.querySelector('button[type="submit"]'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modal: document.querySelector('.modal'),
  };

  return elements;
};

const app = (state) => {
  const elements = getElements();
  const watchedState = createWatchedState(state, elements);

  const setState = {
    formValid: (valid) => {
      watchedState.form.isValid = valid;
    },
    formStage: (stage) => {
      watchedState.form.stage = stage;
    },
    formError: (error) => {
      watchedState.form.error = error;
    },
    feeds: (feeds) => {
      watchedState.feeds = feeds;
    },
    posts: (posts) => {
      watchedState.posts = posts;
    },
    message: (message) => {
      watchedState.message = message;
    },
    error: (error) => {
      watchedState.message = null;
      watchedState.form.error = error;
      watchedState.form.isValid = false;
      watchedState.form.stage = FORM_STAGES.errored;
    },
  };

  handleFeedUpdate(watchedState, setState.posts, setState.error);

  const { form } = elements;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = e.target.url.value;
    setState.formStage(FORM_STAGES.submitting);
    validate(url, watchedState.feeds)
      .then((data) => handleAddFeed(data, watchedState, setState, url))
      .catch((error) => {
        setState.error(error.message);
      });
  });
};

// prettier-ignore
export default (state) => i18next
  .init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  })
  .then(() => app(state));
