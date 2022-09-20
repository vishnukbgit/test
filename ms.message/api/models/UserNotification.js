/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "recipient_id": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "notification_type": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "notification_sent_id": {
      "type": "ref",
      "columnType": "bigint,",
      "required": false
    },
    "notification_sent": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "notification_purpose": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "response": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "reference_id": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "reference_table": {
      "type": "string",
      "required": true
    },
    "success_flag": {
      "type": "ref",
      "columnType": "boolean,",
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
  "tableName": "user_notification"
};
