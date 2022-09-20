/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "diagnosis_assessment_id": {
      "model": "DiagnosisAssessment"
    },
    "options": {
      "collection": "DiseaseAssessmentOptions",
      "via": "assessment_parameter_id"
    },
    "code": {
      "type": "string",
      "required": true
    },
    "name": {
      "type": "string",
      "required": true
    },
    "datatype": {
      "type": "string",
      "required": true
    },
    "presentation": {
      "type": "string",
      "required": true
    },
    "calculated": {
      "type": "number",
      "required": true
    },
    "required": {
      "type": "number",
      "required": true
    },
    "sort_order": {
      "type": "number",
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
  "tableName": "disease_assessment_parameters"
};
