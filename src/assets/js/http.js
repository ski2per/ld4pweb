import axios from 'axios'

const httpCli = axios.create({
  baseURL: process.env.VUE_APP_API_HOST,
  timeout: 10000,
})

// Logout when getting 401 code
httpCli.interceptors.response.use(undefined, function (err) {
  return new Promise(function (resolve, reject) {
    console.log("Caught by axios response interceptor")
    if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
      this.$store.dispatch(logout)
    }
    throw err;
  });
});

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
