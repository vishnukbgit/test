/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "treatment_id": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "survey_parameter_id": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "survey_key": {
      "type": "string",
      "required": true
    },
    "survey_string_value": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "survey_integer_value": {
      "type": "ref",
      "columnType": "number",
      "required": false
    },
    "survey_float_value": {
      "type": "number",
      "columnType": "float",
      "required": false
    },
    "survey_boolean_value": {
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
  "tableName": "treatment_exit_survey_data"
};
