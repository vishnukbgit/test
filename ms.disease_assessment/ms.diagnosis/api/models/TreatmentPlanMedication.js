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
    "medication_id": {
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
  "tableName": "treatment_plan_medication"
};
