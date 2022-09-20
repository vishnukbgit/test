/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "initiation_parameter_id": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "reporting_state": {
      "type": "string",
      "required": true
    },
    "parameter_value": {
      "type": "number",
      "columnType": "float",
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
  "tableName": "etl_new_initiations_parameter_values"
};
