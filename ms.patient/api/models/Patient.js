/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "title_id": {
      "type": "ref",
      "columnType": "number",
      "required": false
    },
    "user_account_id": {
      "model": "UserAccount"
    },
    "biometric": {
      "collection": "PatientBiometric",
      "via": "patient_id"
    },
    "history": {
      "collection": "PatientHistory",
      "via": "patient_id"
    },
    "encounter": {
      "collection": "Encounter",
      "via": "patient_id"
    },
    "disease_assessment": {
      "collection": "DiseaseAssessment",
      "via": "patient_id"
    },
    "treatment_plan": {
      "collection": "TreatmentPlan",
      "via": "patient_id"
    },
    "diagnosis": {
      "collection": "PatientDiagnosis",
      "via": "patient_id"
    },
    "snomed": {
      "collection": "PatientMedication",
      "via": "patient_id"
    },
    "care_unit": {
      "collection": "CareUnitPatientAssociation",
      "via": "patient_id"
    },
    "family_name": {
      "type": "string",
      "required": true
    },
    "firstname": {
      "type": "string",
      "required": true
    },
    "middle_initial": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "postal_address_1": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "postal_address_2": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "postal_address_3": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "postal_address_suburb": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "postal_address_postcode": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "postal_address_state": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "address_1": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "address_2": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "address_3": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "address_suburb": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "address_state": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "address_postcode": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "medicare_number": {
      "type": "string",
      "required": true
    },
    "medicare_position_digit": {
      "type": "ref",
      "columnType": "number",
      "required": false
    },
    "date_of_birth": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "country_of_birth": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "occupation": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "email": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "no_email": {
      "type": "ref",
      "columnType": "boolean",
      "required": false
    },
    "gender_id": {
      "type": "ref",
      "columnType": "bigint",
      "required": true
    },
    "phone": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "secondary_phone": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "postal_as_residential": {
      "type": "ref",
      "columnType": "number",
      "required": false
    },
    "hospital": {
      "type": "ref",
      "columnType": "string",
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
    },
    "is_aboriginal_torres_strait": {
      "type": "boolean",
      "required": true
    },
    "phone_verified": {
      "type":"boolean",
      "defaultsTo": false
    },
    "email_verified": {
      "type":"boolean",
      "defaultsTo": false
    }
  },
  "tableName": "patient"
};
