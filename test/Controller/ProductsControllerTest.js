"use strict";

var MagicTest = require("vmagic/test/MagicTest");
var magicTest = new MagicTest();
const {assert} = require("chai");

let productsControllerMock = null;
let userModelMock = null;

let resUser = null;
const random = Math.floor(Math.random() * 10000);

before(async function () {
    productsControllerMock = magicTest.controllerTest("Products");
    userModelMock = magicTest.modelTest("User");
    //Save user.
    resUser = await userModelMock.save({"name" : `User-${random}`, "email" : `email${random}@south.com.br`, "password" : `${random}`, "perfil" : "ADMINISTRATOR"});
});

describe("ProductsController", function () {
    it("should creates a new product.", async function () {
        function call() {
            return new Promise((resolve, reject) => {
                productsControllerMock.payload = {
                    "name" : `Tenis-${random}`,
                    "price" : "55.99",
                    "description" : "Tenis de cor amarela",
                    "user_id": resUser.rows[0].id
                };
                productsControllerMock.post(response => {
                    if (response.error) {
                        return reject(new Error(response.error.detail));
                    }

                    return resolve(response);
                });
            });
        }

        try {
            const response = await call();
            assert.isOk(true, response.data.length > 0);
        } catch (err) {
            assert.fail(err.message);
        }
    });

    it("should get all products.", async function () {
        function call() {
            return new Promise((resolve, reject) => {
                productsControllerMock.query = {
                    "search" : "",
                    "offset" : "0"
                };
                productsControllerMock.get(response => {
                    if (response.error) {
                        return reject(new Error(response.error.detail));
                    }

                    return resolve(response);
                });
            });
        }

        try {
            const response = await call();
            assert.isOk(true, response.data.length > 0);
        } catch (err) {
            assert.fail(err.message);
        }
    });

    it("should get product by id.", async function () {
        function call() {
            return new Promise((resolve, reject) => {
                productsControllerMock.query = {
                    "id" : resUser.rows[0].id
                };
                productsControllerMock.findBy(response => {
                    if (response.error) {
                        return reject(new Error(response.error.detail));
                    }

                    return resolve(response);
                });
            });
        }

        try {
            const response = await call();
            assert.isOk(true, response.data.length > 0);
        } catch (err) {
            assert.fail(err.message);
        }
    });
});
