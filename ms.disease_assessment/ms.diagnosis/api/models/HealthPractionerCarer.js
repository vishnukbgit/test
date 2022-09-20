/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "hcn_id": {
      "type": "number",
      "required": false
    },
    "user_account_id": {
      "type": "number",
      "required": false
    },
    "fullname": {
      "type": "string",
      "required": false
    },
    "classification": {
      "type": "string",
      "required": false
    },
    "effective_start_date": {
      "type": "string",
      "required": false
    },
    "effective_end_date": {
      "type": "string",
      "required": false
    },
    "primary_phone": {
      "type": "string",
      "required": false
    },
    "emergency_phone": {
      "type": "string",
      "required": false
    },
    "address_1": {
      "type": "string",
      "required": false
    },
    "address_2": {
      "type": "string",
      "required": false
    },
    "address_3": {
      "type": "string",
      "required": false
    },
    "suburb": {
      "type": "string",
      "required": false
    },
    "postcode": {
      "type": "string",
      "required": false
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
  "tableName": "health_practioner_carer"
}
