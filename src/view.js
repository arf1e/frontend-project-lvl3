import onChange from 'on-change';
import FORM_STAGES from './utils';

const setIsFormValid = (isValid, prevIsValid, { input }) => {
  if (isValid === prevIsValid) return;
  if (!isValid) {
    input.classList.add('is-invalid');
    return;
  }
  input.classList.remove('is-invalid');
};

const setStageChange = (stage, prevStage, { input, submitBtn }) => {
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

const setFormError = (error, elements) => {
  const { feedback } = elements;
  if (error === null) {
    feedback.textContent = '';
    feedback.classList.remove('text-danger');
    return;
  }
  feedback.textContent = error;
  feedback.classList.add('text-danger');
};

const setFeeds = (_value, elements) => {
  const { input } = elements;
  input.value = '';
  input.focus();
};

const setMessage = (value, elements) => {
  const { feedback } = elements;
  if (value === null) {
    feedback.classList.remove('text-success');
    feedback.textContent = '';
    return;
  }
  feedback.classList.add('text-success');
  feedback.textContent = value;
};

const createWatchedState = (state, elements) => {
  console.log('created watched state');
  return onChange(state, (path, value, prevValue) => {
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
      case 'feeds':
        setFeeds(value, elements);
        break;
      case 'message':
        setMessage(value, elements);
        break;
      default:
        console.error(`Unknown path ${path}`);
    }
  });
};
export default createWatchedState;
