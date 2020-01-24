vMagic Framework
------------
vMagic is a RESTFul framework for NodeJS applications.
The goal about this framework is simplify the connection between nodejs and the most popular databases improving the development production of team.

**Getting Started**
1. Run npm install -g vmagic-cli
2. To create a new project execute vmagic-cli new NameProject
3. Execute cd NameProject && npm install
4. Set your ip and port on your file init.js
5. Execute node init.js to start server.

**OBS:** The vmagic-cli requires the GIT software.

## Helpdesk: diego.vargas@emvtech.com.br
The documentation is incomplete, if you have some doubts send me an e-mail.

**Project structure**
src
    |_ Component
    |_ Config
    |_ Controller
    |_ Model

Summary
------------

**Component**
1. [ Create my own component ](#own_components)
2. [ Defaults components ](#default_components)

**Config**
1. [ Setup MySQL connection ](#config_mysql)
2. [ Setup PostgreSQL connection ](#config_pgsql)

**Controller**
1. [ Instantiate components ](#ctrl_components)
2. [ Instantiate one or more models ](#ctrl_models)
3. [ Create the database transaction with MySQL ](#ctrl_mysql_transaction)
4. [ Create the database transaction with PostgreSQL ](#ctrl_pgsql_transaction)
5. [ Get the payload from http request ](#ctrl_payload)
6. [ Get the query string from http request ](#ctrl_querystring)

**Model**
1. [ Validation fields ](#model_validation_fields)
2. [ Custom MySQL query ](#model_custom_mysql_query)
3. [ Custom PostgreSQL query ](#model_custom_pgsql_query)
4. [ Default methods ](#model_default_methods)

## Component

<a id="own_components"></a>
## 1. Create my own component
Just create the component in /Component folder that you can use the this.component from Controller to call the object.

<a id="default_components"></a>
## 2. Defaults components
```javascript
const mysql = this.component("MySQL");
const pgsql = this.component("PgSQL");
const email = this.component("E-mail");
const logger = this.component("Logger");
const request = this.component("Request");
```

**OBS:** this.component can be used from Controller and Model.

## Config

<a id="config_mysql"></a>
## Setup MySQL connection
Edit the file src/Config/core.json
```json
{
    "dataSources" : {
		"default" : {
			"dataSource" : "MySQL",
			"host" : "localhost",
			"port" : 3306,
			"user" : "root",
			"password" : "",
			"database" : "",
            "connectionLimit" : 50
		},
		"test" : {
			"dataSource" : "MySQL",
			"host" : "localhost",
			"port" : 3306,
			"user" : "root",
			"password" : "",
			"database" : "",
            "connectionLimit" : 50
		}
	}
}
```
**OBS:**
- On Windows sometimes is necessary to add permission in firewall to allow connect vMagic in MySQL.
- If property connectionLimit is removed, by default it is 10.

<a id="config_pgsql"></a>
## Setup PostgreSQL connection
Edit the file src/Config/core.json
```json
{
    "dataSources" : {
		"default" : {
            "dataSource" : "PgSQL",
			"host" : "localhost",
			"port" : 5432,
			"user" : "postgres",
			"password" : "",
			"database" : "",
            "connectionLimit" : 50
		},
		"test" : {
            "dataSource" : "PgSQL",
			"host" : "localhost",
			"port" : 5432,
			"user" : "postgres",
			"password" : "",
			"database" : "",
            "connectionLimit" : 50
		}
	}
}
```
**OBS:**
The connectionLimit property is optional, by default is 10

## Controller

<a id="ctrl_components"></a>
## 1. Instantiate components
```javascript
//Call this into init() method.
this.myComponentName = this.component("MyComponentName");
```

<a id="ctrl_models"></a>
## 2. Instantiate one or more models
```javascript
//Call this into init() method.
this.model("MyModelName"); //One model
this.model(["UserModel", "CustomerModel"]); //Many models

//this.model doesn't returns an object, each model instantiated already is saved in the memory of the controller and can be used for example as:
this.MyModelName.save({"name" : "vMagic Framework"});
this.UserModel.save({"name" : "vMagic Framework"});
this.CustomerModel.save({"name" : "vMagic Framework"});
```

<a id="ctrl_mysql_transaction"></a>
## 3. Create the database transaction with MySQL
- vMagic use this library: https://github.com/mysqljs/mysql.
```javascript
"use strict";

const AppController = require("./AppController");

class UsersController extends AppController {

    init() {
        this.model(["User", "Permission"]);
        this.mysql = this.component("MySQL");
        this.logger = this.component("Logger");
    }

    post(callback) {
        const that = this; //Maybe is necessary.

        //Open connection.
        that.mysql.connect().
            then(connection => {
                //Start transaction.
                connection.beginTransaction(err => {
                    if (err) {
                        this.statusCode = 500;
                        callback({"message" : "MySQL transaction failed."});

                        return;
                    }

                    //Save user
                    that.User.save({"username" : "vMagic", "password" : "password123"}, connection).
                        then(res => {
                            //Save permission
                            return that.Permission.save({"user_id" : resUser[0].id}, connection);
                        }).
                        then(res => {
                            connection.commit(commitError => {
                                //Close connection.
                                that.mysql.close(connection);

                                if (commitError) {
                                    that.statusCode = 500;
                                    return connection.rollback(function () {
                                        that.logger.error(commitError);

                                        //response to the client.
                                        callback(err);
                                    });
                                }

                                this.logger.success("User saved successfully.");
                                //response to the client.
                                callback(res);
                            });         
                        }).
                        catch(err => {
                            this.statusCode = 500;

                            connection.rollback(function () {
                                this.logger.error(err.message);

                                //response to the client.
                                callback({"message" : err.message});
                            });
                        })
                });                
            }).
            catch(err => {
                if (!this.statusCode) {
                    this.statusCode = 500;
                }

                this.logger.error(err.message);
                return callback({"message" : "Failed to connect."});
            });
    }
}

module.exports = UsersController;
```

<a id="ctrl_pgsql_transaction"></a>
## 4. Create the database transaction with PostgreSQL
- vMagic use this library: https://github.com/brianc/node-postgres.
```javascript
"use strict";

const AppController = require("./AppController");

class UsersController extends AppController {

    init() {
        this.model(["User", "Permission"]);
        this.pgsql = this.component("PgSQL");
        this.logger = this.component("Logger");
    }

    async post(callback) {
        let connection = null;
        try {
            //Open connection.
            connection = await this.pgsql.connect();
            //Start transaction.
            await connection.query("BEGIN");
            //Save user.
            const resUser = await that.User.save({"username" : "vMagic", "password" : "password123"}, connection);
            //Save permission.
            await that.Permission.save({"user_id" : resUser.rows[0].id}, connection);
            //Commit transaction.
            await connection.query('COMMIT');
            //Close connection.
            this.pgsql.close(connection);

            this.logger.success("User saved successfully.");
            callback({"message" : "User saved successfully."}); //Response to the client.

            return;
        } catch (err) {
            //Roollback if error.
            await connection.query("ROLLBACK");
            if (!this.statusCode) {
                this.statusCode = 500;
            }

            this.logger.error(err.message);
            callback(err.message);

            return;
        }
    }
}

module.exports = UsersController;
```

<a id="ctrl_payload"></a>
## 5. Get the payload from http request
```javascript
//Use this:
this.payload

//Example
async put(callback) {
    const res = await this.Model.update({"name" : "vMagic updated"}, {"id" : this.payload.id});
    callback(res);
}
```

<a id="ctrl_querystring"></a>
## 6. Get the query string from http request
```javascript
//Use this:
this.query

//Example
async get(callback) {
    const findByUser = await this.Model.findBy({"id" : this.query.id});
    callback(findByUser);
}
```

## Model

<a id="model_validation_fields"></a>
## 1. Validation fields
```javascript
"use strict";

const AppModel = require("vmagic/AppModel");

class User extends AppModel {

    init() {
        this.useTable = "tb_user";

        this.validate([
            {"name" : {"rule" : "notEmpty", "message" : "Field name cannot be null."}},
            {"email" : {"rule" : "notEmpty", "message" : "Field email cannot be null."}},
            {"password" : {"rule" : "notEmpty", "message" : "Field password cannot be null."}}
        ]);
    }
}

module.exports = User;
```

<a id="model_custom_mysql_query"></a>
## 2. Custom MySQL query
```javascript
"use strict";

const AppModel = require("vmagic/AppModel");

class User extends AppModel {

    init() {
        this.useTable = "tb_user";
        this.mysql = this.component("MySQL");
    }

    example() {
        const that = this;

        return new Promise((resolve, reject) => {
            that.mysql.connect().
                then(connection => {
                    connection.query("SELECT * FROM tb_user WHERE name = ?",["vMagic"], (err, rows) => {
                        that.mysql.close(connection);
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve(rows)
                    });
                }).
                catch(err => {
                    reject(err);
                });
        });
    }
}

module.exports = User;
```

<a id="model_custom_pgsql_query"></a>
## 3. Custom PostgreSQL query
```javascript
"use strict";

const AppModel = require("vmagic/AppModel");

class User extends AppModel {

    init() {
        this.useTable = "tb_user";
        this.pgsql = this.component("PgSQL");
    }

    example() {
        const that = this;

        return new Promise((resolve,reject) => {
            this.pgsql.connect().
                then(connection => {
                    connection.query("SELECT * FROM tb_user WHERE name = $1 and permission = $2",["vMagic", "ADMINISTRATOR"], (err,res) => {
                        that.pgsql.close(connection);
                        if (err) {
                            reject(err);

                            return;
                        }

                        resolve(res);
                    });
                }).
                catch(err => {
                    reject(err);
                });
        });
    }
}

module.exports = User;
```

<a id="model_default_methods"></a>
## 4. Default methods
```javascript

const resSave = await this.Model.save({"name" : "vMagic", "perfil" : "ADMINISTRATOR"});
const resSaveMany = await this.Model.saveMany([
    {"name" : "vMagic 1", "perfil" : "ADMINISTRATOR"},
    {"name" : "vMagic 2", "perfil" : "USER"},
]);
const resUpdate = await this.Model.update({"name" : "vMagic Update", "perfil" : "USER"}, {"id" : 1});
const resDelete = await this.Model.delete({"id" : 1});
const findByIdAndName = await this.Model.findBy({"id" : 1, "name" : "vMagic"});
const findAll = await this.Model.findAll();

```
