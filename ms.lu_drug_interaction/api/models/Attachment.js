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
    "type": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "filename": {
      "type": "string",
      "required": true
    },
    "s3_bucket": {
      "type": "string",
      "required": true
    },
    "content_type": {
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
  "tableName": "attachment"
};
