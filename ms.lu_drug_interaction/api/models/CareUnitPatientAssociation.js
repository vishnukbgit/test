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
    "care_unit_id": {
      "model": "CareUnit"
    },
    "primary_practitioner_id": {
      "model": "HealthPractitionerCarer"
    },
    "primary_care_unit_flag": {
      "type": "ref",
      "columnType": "boolean",
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
  "tableName": "care_unit_patient_association"
};
