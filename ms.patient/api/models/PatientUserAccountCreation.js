/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
let bcrypt = require('bcryptjs');
let logger = require('../services/LoggerService');

const pwdregex = /^(?=.*[0-9!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;

// NB: This file was originally generated, but as it has custom extensions it doesn't get automatically replaced
module.exports =
  {
    "attributes": {
      "name": {
        "type": "string",
        "required": true
      },
      "email": {
        "type": "string",
        "required": true,
        "isEmail": true
      },
      "password": {
        "type": "string",
        "required": false
      },
      "user_account_token": {
        "type": "string",
        "required": false
      },
      "status_id": {
        "type": "number",
        "required": true
      },
      "user_role_id": {
        "type": "number",
        "required": true
      },
      "failures": {
        "type": "number"
      },
      "lockout_expiry": {
        "type": "number"
      },
      "created_by": {
        "type": "number",
        "required": true
      },
      "updated_by": {
        "type": "number",
        "required": false
      } ,
      "verify_token": {
        "type": "string",
        "required": true
      } ,
      "verify_expiry": {
        "type": "number",
        "required": true
      }
    },
    beforeCreate: function(user, cb) {
      if(user.password){
        if (!user.password.match(pwdregex))
          return(cb(new Error('Password failed rules check')));
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
              logger.error("Error",err);

              return cb(err);
            } else {
              user.password = hash;

              return cb();
            }
          });
        });
      }
      return cb();
    },
    beforeUpdate: function(user, cb) {
      if (user.password) {
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
              logger.error("Error",err);

              return cb(err);
            } else {
              user.password = hash;

              return cb();
            }
          });
        });
      } else {
        return cb();
      }
    },
    "tableName": "user_account"
  };
