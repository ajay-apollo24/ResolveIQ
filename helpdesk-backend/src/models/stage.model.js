// models/stage.model.js
const StageSchema = new mongoose.Schema({
    name: String,
    order: Number,
    type: String
  }, { timestamps: true });
  
  module.exports = mongoose.model('Stage', StageSchema);