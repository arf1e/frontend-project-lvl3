import createWatchedState from './view';
import validate from './validate';
import FORM_STAGES from './constants';
import handleAddFeed, { handleFeedUpdate } from './handlers';
import init from './init';

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

const generateState = () => {
  const state = {
    feeds: [],
    posts: [],
    message: null,
    form: {
      isValid: true,
      stage: FORM_STAGES.idle,
      error: null,
    },
    ui: {
      visitedPosts: [],
    },
  };

  return state;
};

const app = () => {
  const elements = getElements();
  const state = generateState();
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
    const formData = new FormData(form);
    const url = formData.get('url');
    setState.formStage(FORM_STAGES.submitting);
    validate(url, watchedState.feeds)
      .then((data) => handleAddFeed(data, watchedState, setState, url))
      .catch((error) => {
        setState.error(error.message);
      });
  });
};

const handleApp = () => init().then(app);

export default handleApp;
