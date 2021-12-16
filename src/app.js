import createWatchedState from './view';
import validate from './validate';
import FORM_STAGES from './constants';
import handleAddFeed, { handleFeedUpdate } from './handlers';

const app = (state, elements) => {
  const { form } = elements;

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

export default app;
