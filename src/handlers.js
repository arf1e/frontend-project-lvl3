import i18next from 'i18next';
import _ from 'lodash';
import proxyClient from './client';
import parseRssFeed from './parser';
import FORM_STAGES, { FEED_UPDATE_TIMER } from './constants';

export const handleFeedUpdate = (watchedState, updatePosts, setError) => {
  const ids = [];
  const timeoutId = setTimeout(() => {
    ids.push(timeoutId);
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
          updatePosts([...difference, ...watchedState.posts]);
        }
      })
      .finally(() => {
        handleFeedUpdate(watchedState, updatePosts, setError);
      })
      .catch(() => {
        setError(i18next.t('errors.networkError'));
        ids.forEach((id) => clearTimeout(id));
      });
  }, FEED_UPDATE_TIMER);
};

// prettier-ignore
const handleAddFeed = (data, state, setState, url) => new Promise((resolve) => {
  setState.formValid(true);
  resolve(data.url);
}).then((link) => proxyClient.get(link))
  .then((res) => {
    if (res.status !== 200) throw new Error(i18next.t('errors.networkError'));
    const stream = res.data.contents;
    return stream;
  })
  .then((rss) => {
    const { feed, posts } = parseRssFeed(rss, url);
    const feedExists = state.feeds.find((element) => element.title === feed.title);
    if (feedExists) throw new Error(i18next.t('errors.urlAlreadyExists'));
    return { feed, posts };
  })
  .then(({ feed, posts }) => {
    setState.feeds([feed, ...state.feeds]);
    setState.posts([...posts, ...state.posts]);
    setState.formStage(FORM_STAGES.success);
    setState.formError(null);
    setState.message(i18next.t('successMessages.urlLoaded'));
  });

export default handleAddFeed;
