'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    var esLint = 'node_modules/eslint/bin/eslint.js src/**/*.js > eslint.out || (cat eslint.out && exit 1)';
    var mocha = 'node_modules/istanbul/lib/cli.js cover node_modules/mocha/bin/_mocha test/**/*.js';

    grunt.initConfig({
        "exec": {
            'eslint' : esLint,
            'test': mocha
        },
        "watch": {
            "src": {
                "files": [
                    'src/**/*.js',
                    'test/**/*.js'
                ],
                "tasks": [
                    'eslint',
                    'test'
                ]
            },
            "gruntfile": {
                "files": ['Gruntfile.js']
            }
        }
    });

    grunt.registerTask('default','Watch files',function () {
        grunt.task.run(['watch']);
    });

    grunt.registerTask('eslint','ESLint','exec:eslint');
    grunt.registerTask('test','Testing...','exec:test');
};
