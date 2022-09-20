/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

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
      "required": true
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
  "tableName": "user_account"
}
