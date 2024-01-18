const mongoose=require("mongoose");



// Define subtopic schema
const subtopicSchema = new mongoose.Schema({
  name: { type: String, required: false },
  text: { type: String, required: false },
  image: { type: Buffer },
});

// Define topic schema
const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subtopics: [subtopicSchema],
});

// Define stage schema
const stageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  topics: [topicSchema],
});

// Define field schema
const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stages: [stageSchema],
});

// Create models
const Subtopic = mongoose.model('Subtopic', subtopicSchema);
const Topic = mongoose.model('Topic', topicSchema);
const Stage = mongoose.model('Stage', stageSchema);
const Field = mongoose.model('Field', fieldSchema);

module.exports = {
  Subtopic,
  Topic,
  Stage,
  Field,
};
