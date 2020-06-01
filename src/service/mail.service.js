import axios from '../utils/axios';

export const sendMailAsync = (param = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .post('mail', {
        recievePhoneNumber: param.recievePhoneNumber,
        deliveryPhoneNumber: param.deliveryPhoneNumber,
        recieveAddress: param.recieveAddress,
        deliveryAddress: param.deliveryAddress,
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
