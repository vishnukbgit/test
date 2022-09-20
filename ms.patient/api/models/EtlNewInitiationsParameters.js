/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "parameter_name": {
      "type": "string",
      "required": true
    },
    "initiation_id": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "group_id": {
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
  "tableName": "etl_new_initiations_parameters"
};
