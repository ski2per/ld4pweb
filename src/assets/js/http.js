import Vue from 'vue'
import axios from 'axios'
import store from '@/store'

const httpCli = axios.create({
  baseURL: process.env.VUE_APP_API_HOST,
  timeout: 10000,
})

// Logout when getting 401 code
httpCli.interceptors.response.use(undefined, function (err) {
  return new Promise(function (resolve, reject) {
    console.log("Caught by axios response interceptor")
    if (err.response.status === 401) {
      let currentURL = err.response.config.url
      if ( ! (currentURL.endsWith('/login') || currentURL.endsWith('/password')) ) {
        store.dispatch('logout')
        .then(() => {
          window.location.href="#/login"
        })
      }
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
