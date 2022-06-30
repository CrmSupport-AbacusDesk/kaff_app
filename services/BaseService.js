import axios from 'axios';

export default axios.create({


    // Production
    // baseURL:  'https://ask.abacusdesk.com/askApi/index.php/'
    // Developement
    baseURL:  'http://app.abacusdesk.co.in/kaff/api/index.php/app/'

});