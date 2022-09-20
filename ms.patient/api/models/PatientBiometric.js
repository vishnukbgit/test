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
      "model": "Patient"
    },
    "height": {
      "type": "number",
      "columnType": "float",
      "required": false,
      "allowNull": true

    },
    "weight": {
      "type": "number",
      "columnType": "float",
      "required": false,
      "allowNull": true
    },
    "bmi": {
      "type": "number",
      "columnType": "float",
      "required": false
    },
    "alcohol_consumption_ind": {
      "type": "ref",
      "columnType": "boolean",
      "required": false
    },
    "alcohol_consumption": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "smoker_ind": {
      "type": "ref",
      "columnType": "boolean",
      "required": false
    },
    "cigarettes_daily": {
      "type": "ref",
      "columnType": "number",
      "required": false
    },
    "smoking_years": {
      "type": "ref",
      "columnType": "number",
      "required": false
    },
    "effective_start_date": {
      "type": "ref",
      "columnType": "timestamptz",
      "required": true
    },
    "effective_end_date": {
      "type": "ref",
      "columnType": "timestamptz",
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
  "tableName": "patient_biometric"
};
