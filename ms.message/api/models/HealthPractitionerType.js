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
    "practitioner_type": {
      "collection": "HealthPractitionerCarer",
      "via": "health_practitioner_type_id"
    },
    "description": {
      "type": "string",
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
  "tableName": "health_practitioner_type"
};
