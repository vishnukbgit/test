/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = 
{
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "treatment_id": {
      "model": "TreatmentPlan"
    },
    "event_type_id": {
      "model": "TaskEventType"
    },
    "responsibility_id": {
      "model": "TaskResponsibility"
    },
    "owner_id": {
      "model": "UserAccount"
    },
    "description": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "due_days": {
      "type": "ref",
      "columnType": "number",
      "required": false
    },
    "commencement_milestone_flag": {
      "type": "boolean",
      "required": true
    },
    "completion_milestone_flag": {
      "type": "boolean",
      "required": true
    },
    "recurring": {
      "type": "ref",
      "columnType": "boolean",
      "required": false
    },
    "drug_details": {
      "type": "ref",
      "columnType": "string",
      "required": false
    },
    "sort_order": {
      "type": "number",
      "required": true
    },
    "due_date": {
      "type": "ref",
      "columnType": "timestamptz",
      "required": false
    },
    "task_completion_date": {
      "type": "ref",
      "columnType": "timestamptz",
      "required": false
    },
    "completed_flag": {
      "type": "ref",
      "columnType": "boolean",
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
  "tableName": "treatment_task"
};
