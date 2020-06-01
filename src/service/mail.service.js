import axios from '../utils/axios';

export const sendMailAsync = (param = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .post('mail', {...param})
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
