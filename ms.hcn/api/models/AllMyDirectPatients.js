//AllMyPatients.js
/**
 * models/model.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports =
{
  "migrate": 'safe',
  // "autoCreatedAt": false,
  // "autoUpdatedAt": false,
  // "autoPK": false,
  "attributes": {
    "patient_id": {"type": "number"},
    "fullname": {"type": "string"},
    "medicare_number": {"type": "string"},
    "user_account_id": {"type": "number"}
  },
  "tableName": "my_direct_patients"
};
