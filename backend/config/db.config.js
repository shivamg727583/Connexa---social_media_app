const mongoose = require('mongoose');

const db =  ()=> {
    mongoose.set("strictQuery", true);
     mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("database connected !!")
     }).catch((e)=>{
        console.log("failed database connection : ",e)
     })

}

module.exports = db;
