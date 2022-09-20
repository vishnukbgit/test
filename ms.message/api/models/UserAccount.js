/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
let bcrypt = require('bcryptjs');
const logger = require('../services/LoggerService');
// NB: This file was originally generated, but as it has custom extensions it doesn't get automatically replaced
module.exports =
{
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "email": {
      "type": "string"
    },
    "password": {
      "type": "string",
      "required": true
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
      "model": "UserRole"
    },
    "created_by": {
      "type": "number",
      "required": true
    },
    "updated_by": {
      "type": "number",
      "required": false
    }
  },
  beforeCreate: function(user, cb) {
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
  },
  "tableName": "user_account"
}
