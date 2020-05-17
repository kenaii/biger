import axios from 'axios';

export const getAddressAsync = param => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
          param.latitude
        },${param.longitude}&key=AIzaSyCI3BZksHt5cAluvGAyKChO4MY4dHSj5GE`,
      )
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
