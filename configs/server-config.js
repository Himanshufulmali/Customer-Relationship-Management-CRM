if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
exports.PORT = process.env.PORT