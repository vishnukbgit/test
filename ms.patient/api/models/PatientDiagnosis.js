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
    "diagnosis_id": {
      "model": "Diagnosis"
    },
    "effective_start_date": {
      "type": "ref",
      "columnType": "timestamptz",
      "required": true
    },
    "effective_end_date": {
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
  "tableName": "patient_diagnosis"
};
