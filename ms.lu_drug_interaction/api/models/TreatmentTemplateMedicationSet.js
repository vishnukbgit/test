/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "medication_code": {
      "type": "string",
      "required": true
    },
    "med_dosages": {
      "collection": "TreatmentTemplateMedicationDosage",
      "via": "treatment_template_medication_set_id"
    },
    "med_prescriptions": {
      "collection": "TreatmentTemplateMedicationPrescription",
      "via": "treatment_template_medication_set_id"
    },
    "treatment_template_id": {
      "model": "TreatmentTemplate"
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
  "tableName": "treatment_template_medication_set"
};
