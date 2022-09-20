/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "assessment_id": {
      "model": "DiseaseAssessment"
    },
    "assessment_parameter_id": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "assessment_key": {
      "type": "string",
      "required": true
    },
    "assessment_string_value": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "assessment_integer_value": {
      "type": "ref",
      "columnType": "number",
      "required": false
    },
    "assessment_float_value": {
      "type": "ref",
      "columnType": "float",
      "required": false
    },
    "assessment_boolean_value": {
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
  "tableName": "disease_assessment_data"
};
