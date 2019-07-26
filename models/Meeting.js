const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MeetingSchema = new Schema({
  meeting_id: {
    type: Number,
  },
  teacher_email: {
    type: String,
  },
  student_email: {
    type: String,
  },
  start_url: {
    type: String,
  },
  join_url: {
    type: String,
  },
});

module.exports = Meeting = mongoose.model('meeting', MeetingSchema);
