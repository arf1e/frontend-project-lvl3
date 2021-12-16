import i18next from 'i18next';

export const getElements = () => {
  const form = document.querySelector('.rss-form');
  const input = form.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  const submitBtn = form.querySelector('button[type="submit"]');
  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');
  const modal = document.querySelector('.modal');

  return {
    form,
    input,
    feedback,
    submitBtn,
    feedsContainer,
    postsContainer,
    modal,
  };
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
