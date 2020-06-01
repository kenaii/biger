import axios from '../utils/axios';

export const getVersionAsync = (param = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .get('version')
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
