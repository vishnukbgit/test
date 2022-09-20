//AllMyPatients.js
/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "primarykey": "patient_id",
  "attributes": {
    "patient_id": {
    	"type": "number"
    },
    "practitioner_id": {
    	"type": "number"
    },
    "role": {
      "type": "string"
    },
    "fullname": {
      "type": "string"
    },
    "care_unit_id": {
    	"type": "number"
    },
    "care_unit_name": {
      "type": "string"
    },
    "user_account_id": {
      "type": "number"
    }
  },
  "tableName": "patient_practitioners"
};
