import onChange from 'on-change';
import i18next from 'i18next';
import FORM_STAGES from './utils';

const createWatchedState = (state, elements) => {
  const { input, feedback, submitBtn } = elements;

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

  const setFeeds = () => {
    input.value = '';
    input.focus();
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

  return onChange(state, (path, value, prevValue) => {
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
      case 'feeds':
        setFeeds(value);
        break;
      case 'message':
        setMessage(value);
        break;
      default:
        console.error(i18next.t('errors.noSuchPath', { path }));
    }
  });
};
export default createWatchedState;
