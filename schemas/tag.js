const mongoose = require('mongoose');

const Tag = mongoose.model("tag", new mongoose.Schema({
    tags: { type: Array, required: true },
    user_id: {type: String, required: true}
  })
);

module.exports.Tag = Tag; //because this is a class

// uninclude this schema due to unnecessity