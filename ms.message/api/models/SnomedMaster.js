/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "snomed_medicinal_product_name_code": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "medicinal_product_name": {
      "type": "string",
      "required": true
    },
    "snomed_medicinal_product_unit_of_use_code": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "medicinal_product_unit_of_use": {
      "type": "string",
      "required": true
    },
    "snomed_trade_product_name_code": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "trade_product_name": {
      "type": "string",
      "required": true
    },
    "snomed_trade_product_unit_of_use_code": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "trade_product_unit_of_use": {
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
  "tableName": "snomed_master"
};
