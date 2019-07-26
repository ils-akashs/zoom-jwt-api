//include required modules
const jwt = require('jsonwebtoken');
const config = require('./config');
const rp = require('request-promise');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
const Meeting = require('./models/Meeting');
const cors = require('cors');
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
var email, userid, resp, topic, teacher_email, student_email;
const port = process.env.PORT || 8000;
const uri = 'mongodb://admin:admin321@ds153947.mlab.com:53947/zoom-meetings';

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(uri, {useNewUrlParser: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//Use the ApiKey and APISecret from config.js
const payload = {
  iss: config.APIKey,
  exp: new Date().getTime() + 5000,
};
const token = jwt.sign(payload, config.APISecret);

app.get('/meetings', (req, res) => {
  Meeting.find().then(meetings => res.json(meetings));
});

app.get('/joinmeeting', (req, res) => {
  email = req.params.email;
  Meeting.find()
    .then(meetings => {
      if (!meetings) {
        errors.noprofile = 'There are no meetings';
        return res.status(404).json({errors: 'No meetings'});
      }

      res.json(meetings);
    })
    .catch(err => res.status(404).json({profile: 'There are no meeting'}));
});

//use userinfo from the form and make a post request to /userinfo
app.post('/createmeeting', (req, res) => {
  teacher_email = req.body.teacher_email;
  student_email = req.body.student_email;

  // let startTime = new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString();
  var options = {
    uri: `https://api.zoom.us/v2/users/a.sawant@thesynapses.com/meetings`,
    method: 'POST',
    body: {
      topic: '',
      type: 1,
      settings: {join_before_host: true, approval_type: 0, audio: 'both'},
    },

    headers: {
      'User-Agent': 'Zoom-api-Jwt-Request',
      'content-type': 'application/json',
      'cache-control': 'no-cache',
      authorization: `Bearer ${token}`,
    },
    json: true, //Parse the JSON string in the response
  };

  //Use request-promise module's .then() method to make request calls.
  rp(options)
    .then(function(response) {
      //printing the response on the console
      console.log('User has', response);

      let newMeeting = new Meeting({
        meeting_id: response.id,
        teacher_email: teacher_email,
        student_email: student_email,
        start_url: response.start_url,
        join_url: response.join_url,
      });

      newMeeting
        .save()
        .then(meeting => {
          console.log(meeting);

          res.json(meeting);
          res.end();
        })
        .catch(err => console.log(err));
    })
    .catch(function(err) {
      // API call failed...
      console.log('API call failed, reason ', err);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
