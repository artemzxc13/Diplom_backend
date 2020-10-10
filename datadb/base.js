const {
  PORT = '3000',
  HOST = 'http://localhost',
  data = 'mongodb://localhost:27017/newsdb',
} = process.env;

const db = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  connectTimeoutMS: 0,
};
const urlValidationOptions = {
  protocols: ['http', 'https'],
  require_protocol: true,
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: true,
  allow_trailing_dot: false,
};
const emailValidation = {
  require_tld: true,
};

module.exports = {
  db,
  urlValidationOptions,
  emailValidation,
  data,
  PORT,
  HOST,
};
