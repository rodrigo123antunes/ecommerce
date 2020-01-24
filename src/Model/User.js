'use strict';

var AppModel = require('vmagic/AppModel');

class User extends AppModel {
    init() {
        this.useTable = "public.user";
        this.logger = this.component('Logger');
    }

}
module.exports = User;
