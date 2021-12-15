import i18next from 'i18next';
import _ from 'lodash';

const parsePost = (item, feedId) => {
  const title = item.querySelector('title').textContent;
  const description = item.querySelector('description').textContent;
  const link = item.querySelector('link').textContent;
  const id = _.uniqueId('post_');
  return {
    title,
    description,
    link,
    feedId,
    id,
  };
};

export default (rss, url) => {
  const domParser = new DOMParser();
  const rssDocument = domParser.parseFromString(rss, 'text/xml');
  const hasError = rssDocument.querySelector('parsererror');
  if (hasError) throw new Error(i18next.t('errors.parserError'));
  const title = rssDocument.querySelector('channel > title').textContent;
  const description = rssDocument.querySelector('channel > description').textContent;
  const postNodes = rssDocument.querySelectorAll('channel > item');
  const id = _.uniqueId('feed_');
  const posts = [...postNodes].map((node) => parsePost(node, id));
  return {
    feed: {
      title,
      description,
      url,
      id,
    },
    posts,
  };
};
