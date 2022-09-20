/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "survey_id": {
      "model": "TreatmentExitSurvey"
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
  "tableName": "treatment_exit_survey_parameter"
};
