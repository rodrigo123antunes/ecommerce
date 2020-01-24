'use strict';
var Magic = require('vmagic');
var magic = new Magic();
let port = null;
if (process.env.PORT) {
  port = process.env.PORT
} else {
  port = 5555
}

magic.start("https://south-commerce.herokuapp.com", port);
