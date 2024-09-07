const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const mongourl="mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(mongourl);
}

main().then(()=>{
    console.log("Connected to WanderLust");
})
.catch(()=>{
    console.log("Error");
})

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"66d702d67f198bd62b8743e7"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was Initilized")
};

initDB();