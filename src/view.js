import onChange from 'on-change';
import i18next from 'i18next';
import FORM_STAGES from './constants';
import domHelpers, {
  setList,
  setFormError,
  setIsFormValid,
  setMessage,
  resetAndFocusOnInput,
  setPostVisited,
} from './dom';

const setStageChange = (stage, prevStage, elements) => {
  const { input, submitBtn } = elements;
  if (stage === prevStage) return;
  switch (stage) {
    case FORM_STAGES.errored:
      [input, submitBtn].forEach((elt) => {
        elt.removeAttribute('disabled');
        elt.removeAttribute('readonly');
      });
      break;
    case FORM_STAGES.submitting:
      [input, submitBtn].forEach((elt) => {
        elt.setAttribute('disabled', 'disabled');
        elt.setAttribute('readonly', 'true');
      });
      break;
    default:
      [input, submitBtn].forEach((elt) => {
        elt.removeAttribute('disabled');
        elt.removeAttribute('readonly');
      });
      input.focus();
  }
};

const createWatchedState = (state, elements) => {
  // prettier-ignore
  const {
    feedsContainer,
    postsContainer,
  } = elements;

  const watchedState = onChange(state, (path, value, prevValue) => {
    switch (path) {
      case 'form.stage':
        setStageChange(value, prevValue, elements);
        break;
      case 'form.error':
        setFormError(value, elements);
        break;
      case 'form.isValid':
        setIsFormValid(value, prevValue, elements);
        break;
      case 'message':
        setMessage(value, elements);
        break;
      case 'feeds':
        setList(value, prevValue, i18next.t('titles.feeds'), feedsContainer, domHelpers.composeFeedElement);
        resetAndFocusOnInput(elements);
        break;
      case 'posts':
        setList(
          value,
          prevValue,
          i18next.t('titles.posts'),
          postsContainer,
          domHelpers.composePostElement,
          watchedState,
        );
        break;
      case 'ui.visitedPosts':
        setPostVisited(value);
        break;
      default:
        console.error(i18next.t('errors.noSuchPath', { path }));
    }
  });

  return watchedState;
};
export default createWatchedState;
