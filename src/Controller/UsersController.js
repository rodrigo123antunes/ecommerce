/* eslint-disable max-statements */
"use strict";

const AppController = require("./AppController");

class UsersController extends AppController {

    init() {
        this.model("User");
        this.appUtil = this.component("AppUtil");
    }

    /**
     * This method authenticate user from email and password.
     * @param {function} callback Usado para responder o usuário.
     * @return {Void} .
     */
    async authenticate(callback) {
        let response = null;
        try {
            if (!this.query.email) {
                this.statusCode = 406;
                throw new Error("Field email cannot be null");
            } else if (!this.query.password) {
                this.statusCode = 406;
                throw new Error("Field password cannot be null");
            }
            const params = {
                "fields" : [
                    "id",
                    "name",
                    "password",
                    "perfil"
                ],
                "conditions" : [
                    {
                        "email": this.query.email
                    },
                    {
                        "password": this.appUtil.md5(`${this.query.email}${this.query.password}`)
                    }
                ]
            };
            const find = await this.User.findAll(params);

            if (find.rows.length === 0) {
                this.statusCode = 400;
                throw new Error("User not found.");
            }

            response = this.responseSuccess(find.rows);
            this.logger.success(response);
        } catch (err) {
            if (!this.statusCode) {
                this.statusCode = 500;
            }
            response = this.responseError("Erro", err.message, this.statusCode);
            this.logger.error(response);
        }

        callback(response);
    }

    /**
     * Retorna os usuários de acordo com o filtro do usuário.
     * @param {function} callback responde para o frontend.
     * @returns {Void} .
     */
    async get(callback) {
        let response = {};
        try {
            if (!this.query.offset) {
                this.statusCode = 406;
                throw new Error("Field offset cannot be null.");
            }

            const params = {
                "conditions": [
                    {
                        "name": `%${this.query.search}%`,
                        "operation": "ILIKE"
                    }
                ],
                "limit": `10 offset ${this.query.offset}`
            };

            const res = await this.User.findAll(params);
            response = this.responseSuccess(res.rows);
        } catch (err) {
            if (!this.statusCode) {
                this.statusCode = 500;
            }
            response = this.responseError('Erro', err.message, this.statusCode);
            this.logger.error(response);
        }

        callback(response);
    }

    /**
     * Cria um novo usuário.
     * @param {function} callback Usado para responder o usuário.
     * @return {Void} .
     */
    async post(callback) {
        let response = null;

        try {
            if (!this.payload.name) {
                this.statusCode = 406;
                throw new Error("Field name cannot be null");
            } else if (!this.payload.email) {
                this.statusCode = 406;
                throw new Error("Field email cannot be null");
            } else if (!this.payload.password) {
                this.statusCode = 406;
                throw new Error("Field password cannot be null");
            } else if (!this.payload.perfil) {
                this.statusCode = 406;
                throw new Error("Field perfil cannot be null");
            }

            this.payload.password = this.appUtil.md5(`${this.payload.email}${this.payload.password}`);

            const save = await this.User.save(this.payload);
            response = this.responseSuccess(save.rows[0]);
        } catch (err) {
            if (!this.statusCode) {
                this.statusCode = 500;
            }
            this.logger.error(err.message);
            response = this.responseError("Erro", err.message, this.statusCode);
        }

        callback(response);
    }

    /**
     * Edita um usuário.
     * @param {function} callback Usado para responder o usuários.
     * @return {Void} .
     */
    async put(callback) {
        let response = {};
        try {
            if (!this.id) {
                this.statusCode = 406;
                throw new Error("Field id cannot be null");
            } else if (!this.payload.name) {
                this.statusCode = 406;
                throw new Error("Field name cannot be null");
            } else if (!this.payload.email) {
                this.statusCode = 406;
                throw new Error("Field email cannot be null");
            } else if (!this.payload.password) {
                this.statusCode = 406;
                throw new Error("Field password cannot be null");
            } else if (!this.payload.perfil) {
                this.statusCode = 406;
                throw new Error("Field perfil cannot be null");
            }

            const res = await this.User.update(this.payload, {"id": this.id});
            response = this.responseSuccess(res.rows);
        } catch (err) {
            if (!this.statusCode) {
                this.statusCode = 500;
            }
            this.logger.error(err.message);
            response = this.responseError('Erro', err.message, this.statusCode);
        }
    
        callback(response);
    
    }
}

module.exports = UsersController;
