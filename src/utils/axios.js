import axios from 'axios';

// Шинэ axios client үүсгэж байгаа хэсэг
const instance = axios.create({
  baseURL: 'https://biger.herokuapp.com',
  // timeout хугацаа өгөхийг санал болгож байна.
  // timeout: 20000,
});
// POST request хийх үед нэг том query string хэлбэртэй болгож явуулах
instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

instance.defaults.headers.post['Content-Type'] = 'application/json';

// Request бүрд TOKEN байвал token той Authorization key явуулах
instance.interceptors.request.use(async request => {
  return request;
});
// Response бүрээс хамааран өөрчлөх шаардлагатай тохируулж болно.
// Default -оороо response.status >= 200 && response.status < 300

instance.interceptors.response.use(response => response);

export default instance;
