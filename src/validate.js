import * as yup from 'yup';

export default (url, links) => {
  const schema = yup.object().shape({
    url: yup.string().required().url('Ссылка должна быть валидным URL').notOneOf(links, 'RSS уже существует'),
  });

  return schema.validate({ url });
};
