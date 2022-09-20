/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "practitioner_id": {
	  "type": "number",
	  "required": true
    },
    "care_unit_id": {
      "model": "CareUnit"
    },
    "provider_number": {
      "type": "string",
      "required": true
    },
    "created_by": {
      "type": "number",
      "required": true
    },
    "updated_by": {
      "type": "number",
      "required": false
    }
  },
  "tableName": "care_unit_practitioner_association"
};
