/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "patient_id": {
      "model": "Patient"
    },
    "encounter_date": {
      "type": "ref",
      "columnType": "timestamptz",
      "required": true
    },
    "health_practitioner_carer_id": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "title": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "notes": {
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
  "tableName": "encounter"
};
