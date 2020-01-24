"use strict";
var AppModel = require("vmagic/AppModel");

class Products extends AppModel {
    init() {
        //Table name
        this.useTable = "products";
    }
}
module.exports = Products;
