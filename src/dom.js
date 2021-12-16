import i18next from 'i18next';
import _ from 'lodash';

export const resetAndFocusOnInput = (elements) => {
  const { input } = elements;
  input.value = '';
  input.focus();
};

export const setPostVisited = (value) => {
  const id = _.last(value);
  const container = document.querySelector(`.posts .${id}`);
  const a = container.querySelector('a');
  a.classList.add('fw-normal');
  a.classList.remove('fw-bold');
};

export const setMessage = (value, elements) => {
  const { feedback } = elements;
  if (value === null) {
    feedback.classList.remove('text-success');
    feedback.textContent = '';
    return;
  }
  feedback.classList.add('text-success');
  feedback.textContent = value;
};

export const setIsFormValid = (isValid, prevIsValid, elements) => {
  const { input } = elements;
  if (isValid === prevIsValid) return;
  if (!isValid) {
    input.classList.add('is-invalid');
    return;
  }
  input.classList.remove('is-invalid');
};

export const setFormError = (error, elements) => {
  const { feedback } = elements;
  if (error === null) {
    feedback.textContent = '';
    feedback.classList.remove('text-danger');
    return;
  }
  feedback.textContent = error;
  feedback.classList.add('text-danger');
};

const initializeBasicSectionStructure = (title, section) => {
  const h2 = document.createElement('h2');
  const innerDiv = document.createElement('div');
  const outerDiv = document.createElement('div');
  const ul = document.createElement('ul');
  outerDiv.classList.add('card', 'border-0');
  innerDiv.classList.add('card-body');
  h2.textContent = title;
  h2.classList.add('card-title', 'h4');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  innerDiv.append(h2);
  outerDiv.append(innerDiv);
  outerDiv.append(ul);
  section.append(outerDiv);
};

export const setList = (value, prevValue, title, container, composeFn, state) => {
  if (prevValue.length === 0) {
    initializeBasicSectionStructure(title, container);
  }

  const list = container.querySelector('ul');
  list.innerHTML = '';
  value.forEach((element) => {
    const node = composeFn(element, state);
    list.append(node);
  });
};

const composeFeedElement = (feed) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');
  const h3 = document.createElement('h3');
  h3.classList.add('h6', 'm-0');
  h3.textContent = feed.title;
  li.append(h3);
  const p = document.createElement('p');
  p.classList.add('m-0', 'small', 'text-black-50');
  p.textContent = feed.description;
  li.append(p);
  return li;
};

const composePostElement = (post, state) => {
  const li = document.createElement('li');
  li.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
    `${post.id}`,
  );
  const a = document.createElement('a');
  const isVisited = state.ui.visitedPosts.includes(post.id);
  if (isVisited) {
    a.classList.add('fw-normal');
  } else {
    a.classList.add('fw-bold');
    a.addEventListener('click', () => {
      state.ui.visitedPosts.push(post.id);
    });
  }
  a.setAttribute('href', post.link);
  a.textContent = post.title;
  a.setAttribute('target', '_blank');
  li.append(a);
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.dataset.id = post.id;
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#modal';
  button.textContent = i18next.t('titles.openPost');
  button.addEventListener('click', () => {
    const modal = document.querySelector('.modal');
    const body = modal.querySelector('.modal-body');
    const title = modal.querySelector('.modal-header > h5');
    const link = modal.querySelector('.btn-primary');
    if (!isVisited) {
      state.ui.visitedPosts.push(post.id);
    }
    body.textContent = post.description;
    title.textContent = post.title;
    link.setAttribute('href', post.link);
  });
  li.append(button);
  return li;
};

export default { initializeBasicSectionStructure, composeFeedElement, composePostElement };
