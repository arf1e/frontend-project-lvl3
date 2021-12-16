import FORM_STAGES from './constants';
import app from './app';

const init = () => {
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

  app(state);
};

export default init;
