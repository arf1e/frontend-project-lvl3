import * as yup from 'yup';
import i18next from 'i18next';

export default (url, links) => {
  const schema = yup.object().shape({
    url: yup
      .string()
      .required()
      .url(i18next.t('errors.urlIncorrect'))
      .notOneOf(links, i18next.t('errors.urlAlreadyExists')),
  });

  return schema.validate({ url });
};
