const mongoose = require("mongoose");

const makeDB = async ({config}) => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
};

module.exports = makeDB;
