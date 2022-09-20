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
    "gp_id": {
      "model": "HealthPractitionerCarer"
    },
    "specialist_id": {
      "model": "HealthPractitionerCarer"
    },
    "data": {
      "collection": "DiseaseAssessmentData",
      "via": "assessment_id"
    },
    "patient_diagnosis_id": {
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
  "tableName": "disease_assessment"
};
