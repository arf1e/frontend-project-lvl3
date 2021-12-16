import onChange from 'on-change';
import _ from 'lodash';
import i18next from 'i18next';
import FORM_STAGES from './constants';
import domHelpers, { setList } from './dom';

const createWatchedState = (state, elements) => {
  // prettier-ignore
  const {
    input,
    feedback,
    submitBtn,
    feedsContainer,
    postsContainer,
  } = elements;

  const resetAndFocusOnInput = () => {
    input.value = '';
    input.focus();
  };

  const setIsFormValid = (isValid, prevIsValid) => {
    if (isValid === prevIsValid) return;
    if (!isValid) {
      input.classList.add('is-invalid');
      return;
    }
    input.classList.remove('is-invalid');
  };

  const setStageChange = (stage, prevStage) => {
    if (stage === prevStage) return;
    switch (stage) {
      case FORM_STAGES.errored:
        [input, submitBtn].forEach((elt) => elt.removeAttribute('disabled'));
        break;
      case FORM_STAGES.submitting:
        [input, submitBtn].forEach((elt) => elt.setAttribute('disabled', 'disabled'));
        break;
      default:
        [input, submitBtn].forEach((elt) => elt.removeAttribute('disabled'));
        input.focus();
    }
  };

  const setFormError = (error) => {
    if (error === null) {
      feedback.textContent = '';
      feedback.classList.remove('text-danger');
      return;
    }
    feedback.textContent = error;
    feedback.classList.add('text-danger');
  };

  const setMessage = (value) => {
    if (value === null) {
      feedback.classList.remove('text-success');
      feedback.textContent = '';
      return;
    }
    feedback.classList.add('text-success');
    feedback.textContent = value;
  };

  const setPostVisited = (value) => {
    const id = _.last(value);
    const container = document.querySelector(`.posts .${id}`);
    const a = container.querySelector('a');
    a.classList.add('fw-normal');
    a.classList.remove('fw-bold');
  };

  const watchedState = onChange(state, (path, value, prevValue) => {
    switch (path) {
      case 'form.stage':
        setStageChange(value, prevValue);
        break;
      case 'form.error':
        setFormError(value);
        break;
      case 'form.isValid':
        setIsFormValid(value, prevValue);
        break;
      case 'message':
        setMessage(value);
        break;
      case 'feeds':
        setList(value, prevValue, i18next.t('titles.feeds'), feedsContainer, domHelpers.composeFeedElement);
        resetAndFocusOnInput();
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

  elements.input.focus();
  return watchedState;
};
export default createWatchedState;
