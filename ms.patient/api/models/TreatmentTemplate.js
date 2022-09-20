/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "plan_no": {
      "type": "string",
      "required": true
    },
    "tasks": {
      "collection": "TreatmentTemplateTask",
      "via": "treatment_template_id"
    },
    "med_sets": {
      "collection": "TreatmentTemplateMedicationSet",
      "via": "treatment_template_id"
    },
    "diagnosis_id": {
      "model": "Diagnosis"
    },
    "name": {
      "type": "string",
      "required": true
    },
    "duration": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "string",
      "required": true
    },
    "use_instructions": {
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
  "tableName": "treatment_template"
};
