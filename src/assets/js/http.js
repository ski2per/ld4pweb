import axios from 'axios'

const httpCli = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 2000,
})

httpCli.interceptors.request.use(function (config) {
// http.interceptors.request.use(function (config) {
  // Do something before request is sent
  const token = localStorage.getItem('token')
  if(token) {
    config.headers.common['Authorization'] = `Bearer ${token}`
    // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


export default httpCli