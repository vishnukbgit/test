/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "address_1": {
      "type": "string",
      "required": true
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
      "type": "string",
      "required": true
    },
    "postcode": {
      "type": "string",
      "required": true
    },
    "state": {
      "type": "string",
      "required": true
    },
    "contact_number": {
      "type": "string",
      "required": true
    },
    "contact_email": {
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
  "tableName": "care_unit"
};
