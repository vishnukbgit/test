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
    "tasks": {
      "collection": "TreatmentTask",
      "via": "treatment_id"
    },
    "med_sets": {
      "collection": "TreatmentPlanMedicationSet",
      "via": "treatment_id"
    },
    "status_id": {
      "model": "TreatmentPlanStatus"
    },
    "initiator_id": {
      "model": "HealthPractitionerCarer"
    },
    "approver_id": {
      "model": "HealthPractitionerCarer"
    },
    "assessment_id": {
      "model": "DiseaseAssessment"
    },
    "name": {
      "type": "string",
      "required": true
    },
    "start_date": {
      "type": "ref",
      "columnType": "timestamptz",
      "required": false
    },
    "approval_date": {
      "type": "ref",
      "columnType": "timestamptz",
      "required": false
    },
    "review_due_date": {
      "type": "ref",
      "columnType": "timestamptz",
      "required": false
    },
    "drug_interaction_status_id": {
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
  "tableName": "treatment_plan"
};
