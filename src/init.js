import FORM_STAGES from './constants';

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

  return state;
};

export default init;
