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
      "collection": "TreatmentTemplateMedication",
      "via": "medication_id"
    },
    "medicinal_product_name": {
      "type": "string",
      "required": true
    }
  },
  "tableName": "snomed"
};
