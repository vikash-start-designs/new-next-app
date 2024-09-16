const mongoose = require('mongoose');

export const connection = async()=>{
await mongoose.connect('mongodb://127.0.0.1:27017/invoice')
  .then(() => console.log('Connected!')).catch((err)=>{console.log("Database is not connected!", err)});
}
// module.exports= connection;