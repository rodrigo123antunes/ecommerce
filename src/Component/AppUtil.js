'use strict';
const crypto = require('crypto');

class AppUtil {

    /**
     * @param {string} text password
     * @return {string} should returns a new hash.
     */
    md5(text) {
        this.method = "md5";
        const hashMD5 = crypto.createHash('md5');

        return hashMD5.update(text).digest('hex');
    }
}
module.exports = AppUtil;
