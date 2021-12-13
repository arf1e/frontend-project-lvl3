import i18next from 'i18next';
import _ from 'lodash';

const parsePost = (item) => {
  const title = item.querySelector('title').textContent;
  const description = item.querySelector('description').textContent;
  const link = item.querySelector('link').textContent;
  const id = _.uniqueId('post_');
  return {
    title,
    description,
    link,
    id,
  };
};

export default (rss) => {
  const domParser = new DOMParser();
  const rssDocument = domParser.parseFromString(rss, 'text/xml');
  const hasError = rssDocument.querySelector('parsererror');
  if (hasError) throw new Error(i18next.t('errors.parserError'));
  const title = rssDocument.querySelector('channel > title').textContent;
  const description = rssDocument.querySelector('channel > description').textContent;
  const postNodes = rssDocument.querySelectorAll('channel > item');
  const posts = [...postNodes].map((node) => parsePost(node));
  const id = _.uniqueId('feed_');
  return { feed: { title, description, id }, posts };
};
