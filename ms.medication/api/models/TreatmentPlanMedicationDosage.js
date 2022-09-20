/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "treatment_plan_medication_set_id": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "name": {
      "type": "string",
      "required": true
    },
    "dosage": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "type": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "duration": {
      "type": "ref",
      "columnType": "string",
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
  "tableName": "treatment_plan_medication_dosage"
};
