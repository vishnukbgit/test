/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "survey_parameter_id": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "option_value": {
      "type": "string",
      "required": true
    },
    "option_label": {
      "type": "string",
      "required": true
    },
    "option_sort_order": {
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
  "tableName": "exit_survey_option"
};
