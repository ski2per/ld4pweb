import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
   options: {
     customProperties: true,
   },  
   themes: {
     light: {
       primary: '#ee44aa',
       secondary: '#424242',
       accent: '#82B1FF',
       error: '#E91E63',
       info: '#2196F3',
       success: '#4CAF50',
       warning: '#FF9800'
     },  
   },  
  },  
});
