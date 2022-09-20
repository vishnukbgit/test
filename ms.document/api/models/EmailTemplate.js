/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "subject": {
      "type": "string",
      "required": true
    },
    "html_body": {
      "type": "string",
      "required": true
    },
    "text_body": {
      "type": "string",
      "required": true
    },
    "created_by": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "updated_by": {
      "type": "ref",
      "columnType": "bigint",
      "required": false
    }
  },
  "tableName": "email_template"
};
