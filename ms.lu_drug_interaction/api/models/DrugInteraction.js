/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "interaction_status": {
      "type": "number",
      "required": true
    },
    "created_by": {
      "type": "number",
      "required": true
    },
    "lu_comedication_drug_collection_id": {
      "type": "number",
      "required": true
    },
    "lu_primary_drug_collection_id": {
      "type": "number",
      "required": true
    }
  },
  "tableName":"lu_drug_interactions"

}
