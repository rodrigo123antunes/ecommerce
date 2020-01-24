'use strict';
var Magic = require('vmagic');
var magic = new Magic();

/**
 * Set address and port.
 * Ex:
 *  magic.start('192.168...', 5555);
 *  magic.start('www.mydomain.com', 5555);
 */
magic.start('0.0.0.0', 5555);
