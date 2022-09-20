/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "lu_drug_interaction_id": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "interaction_status": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "lu_comedication_drug_collection_id": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "lu_primary_drug_collection_id": {
      "type": "ref",
      "columnType": "bigint",
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
  "tableName": "lu_drug_interactions"
};
