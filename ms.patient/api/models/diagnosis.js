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
    "assessment": {
      "collection": "DiagnosisAssessment",
      "via": "diagnosis_id"
    },
    "name": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "string",
      "required": true
    },
    "details": {
      "type": "ref",
      "columnType": "string",
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
  "tableName": "diagnosis"
};
