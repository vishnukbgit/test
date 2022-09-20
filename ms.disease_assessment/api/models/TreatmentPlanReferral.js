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
    "refer_liver_clinic": {
      "type": "ref",
      "columnType": "boolean",
      "required": false
    },
    "refer_chronic_care": {
      "type": "ref",
      "columnType": "boolean",
      "required": false
    },
    "refer_chronic_care_response_flag": {
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
  "tableName": "treatment_plan_referral"
};
