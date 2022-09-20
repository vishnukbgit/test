/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports = 
 {
   "attributes": {
     "patient_id": {
       "type": "number",
       "required": true
     },
     "attachment_id": {
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
   "tableName": "patient_attachment"
 };
 