/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "owner_id": {
      "model": "UserAccount"
    },
    "type_id": {
      "model": "TaskType"
    },
    "status_id": {
      "model": "TaskStatus"
    },
    "treatment_id": {
      "type": "ref",
      "columnType": "bigint",
      "required": false
    },
    "due_date": {
      "type": "ref",
      "columnType": "timestamptz",
      "required": false
    },
    "completion_date": {
      "type": "ref",
      "columnType": "timestamptz",
      "required": false
    },
    "title": {
      "type": "string",
      "required": true
    },
    "detail": {
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
  "tableName": "task"
};
