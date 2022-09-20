/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "message_id": {
      "model": "Message"
    },
    "recipient_id": {
      "model": "UserAccount"
    },
    "message_read_flag": {
      "type": "ref",
      "columnType": "boolean",
      "required": false
    },
    "deleted_flag": {
      "type": "ref",
      "columnType": "boolean",
      "required": false
    },
    "read_date": {
      "type": "ref",
      "columnType": "timestamptz",
      "required": false
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
  "tableName": "message_recipient"
};
