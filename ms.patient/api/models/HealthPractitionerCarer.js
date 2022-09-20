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
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "health_practitioner_type_id": {
      "model": "HealthPractitionerType"
    },
    "user_account_id": {
      "model": "UserAccount"
    },
    "title_id": {
      "model": "UserTitle"
    },
    "firstname": {
      "type": "string",
      "required": true
    },
    "family_name": {
      "type": "string",
      "required": true
    },
    "fullname": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "classification": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "effective_start_date": {
      "type": "ref",
      "columnType": "timestamptz",
      "required": false
    },
    "effective_end_date": {
      "type": "ref",
      "columnType": "timestamptz",
      "required": false
    },
    "primary_phone": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "emergency_phone": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "address_1": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "address_2": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "address_3": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "suburb": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "postcode": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "avatar_url": {
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
  "tableName": "health_practitioner_carer"
};
