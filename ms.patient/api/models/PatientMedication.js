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
    "medication_dosage": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "medication_frequency": {
      "type": "string",
      "required": true
    },
    "prescription_due": {
      "type": "ref",
      "columnType": "timestamptz",
      "required": false
    },
    "prescribing_doctor": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "medication_id": {
      "model": "Snomed"
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
  "tableName": "patient_medication"
};
