import _ from 'lodash';
import i18next from 'i18next';
import proxyClient from './client';
import createWatchedState from './view';
import validate from './validate';
import ru from './locales/ru';
import FORM_STAGES, { FEED_UPDATE_TIMER } from './constants';
import parseRssFeed from './parser';
import { getElements } from './dom';

const setFeedUpdater = (watchedState, updatePosts) => {
  const timeoutId = setTimeout(() => {
    const { feeds, posts } = watchedState;

    const feedUrls = feeds.map((feed) => feed.url);
    // prettier-ignore
    const connections = feedUrls.map((url) => proxyClient.get(url).then(({ data }) => {
      const newPosts = parseRssFeed(data.contents, url).posts;
      return newPosts;
    }));

    Promise.all(connections)
      .then((newPosts) => {
        const difference = _.differenceWith(posts, newPosts, (a, b) => a.title !== b.title);
        if (!_.isEmpty(difference)) {
          updatePosts(difference);
        }
      })
      .finally(() => {
        setFeedUpdater(watchedState, updatePosts);
      })
      .catch(() => {
        // TODO: Handle error
        clearTimeout(timeoutId);
      });
  }, FEED_UPDATE_TIMER);
};

const app = () => {
  const state = {
    feeds: [],
    posts: [],
    message: null,
    form: {
      isValid: true,
      stage: FORM_STAGES.idle,
      error: null,
    },
  };
  const elements = getElements();
  const { form } = elements;
  const watchedState = createWatchedState(state, {
    ...elements,
  });

  const updatePosts = (posts) => {
    watchedState.posts = [...posts, ...watchedState.posts];
  };
  setFeedUpdater(watchedState, updatePosts);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = e.target.url.value;
    watchedState.form.stage = FORM_STAGES.submitting;
    validate(url, watchedState.feeds)
      .then((data) => {
        watchedState.form.isValid = true;
        return data.url;
      })
      .then((requestedUrl) => proxyClient.get(requestedUrl))
      .then((res) => {
        if (res.status !== 200) throw new Error(i18next.t('errors.default'));
        const stream = res.data.contents;
        return stream;
      })
      .then((rss) => {
        const { feed, posts } = parseRssFeed(rss, url);
        const feedExists = watchedState.feeds.find((element) => element.title === feed.title);
        if (feedExists) throw new Error(i18next.t('errors.urlAlreadyExists'));
        return { feed, posts };
      })
      .then(({ feed, posts }) => {
        watchedState.feeds = [feed, ...watchedState.feeds];
        watchedState.posts = [...posts, ...watchedState.posts];
        watchedState.form.stage = FORM_STAGES.success;
        watchedState.form.error = null;
        watchedState.message = i18next.t('successMessages.urlLoaded');
      })
      .catch((error) => {
        watchedState.message = null;
        watchedState.form.error = error.message;
        watchedState.form.isValid = false;
        watchedState.form.stage = FORM_STAGES.errored;
      });
  });
};

export default i18next
  .init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  })
  .then(app);
