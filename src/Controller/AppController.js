'use strict';
const Application = require('vmagic/AppController');

class AppController extends Application {

    beforeFilter(callback) {
        this.logger = this.component("Logger");
        this.core = this.config("core.json");

        callback();
    }

    responseSuccess(data) {
        this.method = 'responseSuccess';

        return {
            data
        };
    }

    responseError(title, detail, statusCode) {
        this.method = 'responseError';

        return {
            "error" : {
                statusCode,
                title,
                detail
            }
        };
    }
}

module.exports = AppController;
