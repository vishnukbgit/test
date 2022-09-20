/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports = 
 {
   "attributes": {
     "primary_drug_name": {
       "type": "string",
       "required": true
     },
     "snomed_medicinal_product_name_code": {
       "type": "number",
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
   "tableName": "lu_primary_drug_collection"
 };
 