/* eslint-disable max-statements */
'use strict';

const AppController = require('./AppController');

class ProductsController extends AppController {
    init() {
        this.model([
            "Product",
            "User"
        ]);
        this.logger = this.component('Logger');
    }

    async validateUserPermission(id) {
        let allowed = false;

        const user = await this.User.findBy({id});

        if (user.rows[0].perfil === "ADMINISTRATOR") {
            allowed = true;
        }

        return allowed;
    }

    /**
     * Cria um novo produto.
     * @param {function} callback responde para o frontend.
     * @returns {Void} .
     */

    async post(callback) {
        let response = {};
        try {
            if (!this.payload.name) {
                this.statusCode = 406;
                throw new Error("Field name cannot be null.");
            } else if (!this.payload.price) {
                this.statusCode = 406;
                throw new Error("Field price cannot be null.");
            } else if (!this.payload.description) {
                this.statusCode = 406;
                throw new Error("Field description cannot be null.");
            } else if (!this.payload.user_id) {
                this.statusCode = 406;
                throw new Error("Field user_id cannot be null.");
            }

            const hasPermission = await this.validateUserPermission(this.payload.user_id);

            if (!hasPermission) {
                this.statusCode = 403;
                throw new Error("User without permission to perform this action.");
            }

            //Faz uma busca na base pelo nome do produto.
            const find = await this.Product.findBy({"name": this.payload.name});

            //Verifica se o produto informado ja existe.
            if (find.rows.length > 0) {
                this.statusCode = 406;
                throw new Error("product already registered.");
            }

            Reflect.deleteProperty(this.payload, "user_id");

            //Salva o produto.
            const res = await this.Product.save(this.payload);
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
     * Retorna os produtos de acordo com o filtro do usuário.
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

            const res = await this.Product.findAll(params);
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
     * Edita um determinado produto.
     * @param {function} callback responde para o frontend.
     * @returns {Void} .
     */
    async put(callback) {
        let response = {};
        try {
            if (!this.id) {
                this.statusCode = 406;
                throw new Error("Field id cannot be null.");
            } else if (!this.payload.name) {
                this.statusCode = 406;
                throw new Error("Field name cannot be null.");
            } else if (!this.payload.price) {
                this.statusCode = 406;
                throw new Error("Field price cannot be null.");
            } else if (!this.payload.description) {
                this.statusCode = 406;
                throw new Error("Field description cannot be null.");
            } else if (!this.payload.user_id) {
                this.statusCode = 406;
                throw new Error("Field user_id cannot be null.");
            }

            const hasPermission = await this.validateUserPermission(this.payload.user_id);

            if (!hasPermission) {
                this.statusCode = 403;
                throw new Error("User without permission to perform this action.");
            }

            //Faz uma busca na base pelo nome do produto.
            const find = await this.Product.findBy({"name": this.payload.name});

            //Verifica se o produto informado ja existe.
            if (find.rows.length > 0 && find.rows[0].id != this.id) {
                this.statusCode = 406;
                throw new Error("product already registered.");
            }

            Reflect.deleteProperty(this.payload, "user_id");

            //Executa o update
            const res = await this.Product.update(this.payload, {"id": this.id});
            response = this.responseSuccess(res.rows);
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
     * Exclui um determinado produto.
     * @param {function} callback responde para o frontend.
     * @returns {Void} .
     */
    async delete(callback) {
        let response = {};
        try {
            if (!this.id) {
                this.statusCode = 406;
                throw new Error("Field id cannot be null.");
            } else if (!this.payload.user_id) {
                this.statusCode = 406;
                throw new Error("Field user_id cannot be null.");
            }

            const hasPermission = await this.validateUserPermission(this.payload.user_id);

            if (!hasPermission) {
                this.statusCode = 403;
                throw new Error("User without permission to perform this action.");
            }

            //Executa o delete
            const res = await this.Product.delete({"id": this.id});
            response = this.responseSuccess(res.rows);
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
     * Busca um determinado produto pelo seu id.
     * @param {function} callback responde para o frontend.
     * @returns {Void} .
     */
    async findBy(callback) {
        let response = {};
        try {
            if (!this.query.id) {
                this.statusCode = 406;
                throw new Error("Field id cannot be null.");
            }

            const res = await this.Product.findBy({"id": this.query.id});
            response = this.responseSuccess(res.rows);
        } catch (err) {
            if (!this.statusCode) {
                this.statusCode = 500;
            }
            response = this.responseError("Erro", err.message, this.statusCode);
            this.logger.error(response);
        }
    
        callback(response);
    
    }
}
module.exports = ProductsController;
