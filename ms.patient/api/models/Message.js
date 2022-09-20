/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "sender_id": {
      "model": "UserAccount"
    },
    "recipient": {
      "collection": "MessageRecipient",
      "via": "message_id"
    },
    "attachment": {
      "collection": "MessageAttachment",
      "via": "message_id"
    },
    "subject": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "body": {
      "type": "string",
      "required": true
    },
    "sent_date": {
      "type": "ref",
      "columnType": "timestamptz",
      "required": true
    },
    "parent_id": {
      "type": "ref",
      "columnType": "bigint",
      "required": false
    },
    "patient_id": {
      "type": "ref",
      "columnType": "bigint",
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
  "tableName": "message"
};
