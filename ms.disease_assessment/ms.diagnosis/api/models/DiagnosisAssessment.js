/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "code": {
      "type": "string",
      "required": true
    },
    "parameters": {
      "collection": "DiseaseAssessmentParameters",
      "via": "diagnosis_assessment_id"
    },
    "diagnosis_id": {
      "model": "Diagnosis"
    },
    "name": {
      "type": "string",
      "required": true
    },
    "active": {
      "type": "boolean",
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
  "tableName": "diagnosis_assessment"
};
