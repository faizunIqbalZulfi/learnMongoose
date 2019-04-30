const mongoose = require("mongoose");
// "mongodb://127.0.0.1:27017/mongooseclass"
mongoose.connect(
  `mongodb+srv://iqbal:empatdan1@cluster0-16npl.mongodb.net/mongooseclass?retryWrites=true`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);
