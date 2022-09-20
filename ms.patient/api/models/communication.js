/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports = 
 {
   "attributes": {
     "subject_line": {
       "type": "string",
       "required": true
     },
     "from_address": {
       "type": "string",
       "required": true
     },
     "to_address": {
       "type": "string",
       "required": true
     },
     "cc": {
       "type": "string",
       "required": false
     },
     "bcc": {
       "type": "string",
       "required": false
     },
     "attachment_id": {
       "type": "number",
       "required": false
     },
     "comms_body": {
       "type": "string",
       "required": true
     },
     "patient_id": {
       "type": "number",
       "required": false
     },
     "hcn_id": {
       "type": "number",
       "required": false
     },
     "user_account_id": {
       "type": "number",
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
   "tableName": "communication"
 }