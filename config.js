const env = process.env.NODE_ENV || 'production';

//insert your API Key & Secret for each environment, keep this file local and never push it to a public repo for security purposes.
const config = {
  development: {
    APIKey: 'jmP6DqemQjay1XcJpll1vg',
    APISecret: 'zmqEqGdjst5mL4dDYRctq1ZIbQWULQF9SoO7',
  },
  production: {
    APIKey: 'jmP6DqemQjay1XcJpll1vg',
    APISecret: 'zmqEqGdjst5mL4dDYRctq1ZIbQWULQF9SoO7',
  },
};

module.exports = config[env];
