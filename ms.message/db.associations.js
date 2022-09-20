/* eslint camelcase: 0 */  // --> OFF
/* eslint max-lines: 0 */  // --> OFF
// Need to add in relationships... ideally can work out from FK references, but this is a quick fix
//
module.exports = 
	{
		treatment_template: [
	    {
	    	name: 'tasks',
	    	data: {
		      collection: 'treatment_template_task',
		      via: 'treatment_template_id'
	      }
	    },
	    {
	    	name: 'med_sets',
	    	data: {
		      collection: 'treatment_template_medication_set',
		      via: 'treatment_template_id'
	      }
	    },
	    {
	    	name: 'diagnosis_id',
	    	data: {model: 'diagnosis'}
		  }
		],
		treatment_exit_survey: [
	    {
	    	name: 'diagnosis_id',
	    	data: {model: 'diagnosis'}
		  }
		],
		treatment_exit_survey_parameter: [
	    {
	    	name: 'survey_id',
	    	data: {model: 'treatment_exit_survey'}
		  }
		],
		treatment_template_task: [
	    {
	    	name: 'treatment_template_id',
	    	data: {model: 'treatment_template'}
		  },
	    {
	    	name: 'event_type_id',
	    	data: {model: 'task_event_type'}
		  },
	    {
	    	name: 'responsibility_id',
	    	data: {model: 'task_responsibility'}
		  }
		],
		treatment_template_medication: [
			{
				name: 'treatment_template_id',			
	    	data: {model: 'treatment_template'}
			},
			{
				name: 'medication_id',
				data: {model: 'snomed'}
			}
		],
		treatment_template_medication_set: [
	    {
	    	name: 'med_dosages',
	    	data: {
		      collection: 'treatment_template_medication_dosage',
		      via: 'treatment_template_medication_set_id'
	      }
	    },
	    {
	    	name: 'med_prescriptions',
	    	data: {
		      collection: 'treatment_template_medication_prescription',
		      via: 'treatment_template_medication_set_id'
	      }
	    },
	    {
	    	name: 'treatment_template_id',
	    	data: {model: 'treatment_template'}
		  }
	   ],
	   treatment_template_medication_dosage: [
	    {
	    	name: 'treatment_template_medication_set_id',
	    	data: {model: 'treatment_template_medication_set'}
		  }
	   ],
	   treatment_template_medication_prescription: [
	    {
	    	name: 'treatment_template_medication_set_id',
	    	data: {model: 'treatment_template_medication_set'}
		  }
	   ],
     treatment_template_rules: [
	    {
	    	name: 'diagnosis_id',
	    	data: {model: 'diagnosis'}
	    }
	   ],
     treatment_template_ignore_rules: [
	    {
	    	name: 'diagnosis_id',
	    	data: {model: 'diagnosis'}
	    }
	   ],

// Patient treatment (instance of plan template)
		treatment_plan: [
	    {
	    	name: 'tasks',
	    	data: {
		      collection: 'treatment_task',
		      via: 'treatment_id'
	      }
	    },
	    {
	    	name: 'med_sets',
	    	data: {
		      collection: 'treatment_plan_medication_set',
		      via: 'treatment_id'
	      }
	    },
			{
				name: 'patient_id',
				data: {model: 'patient'}
			},
			{
				name: 'status_id',
				data: {model: 'treatment_plan_status'}
			},
			{
				name: 'initiator_id',
				data: {model: 'health_practitioner_carer'}
			},
			{
				name: 'approver_id',
				data: {model: 'health_practitioner_carer'}
			},
			{
				name: 'assessment_id',
				data: {model: 'disease_assessment'}
			}
		],
		treatment_plan_medication_set: [
			{
				name: 'treatment_id',
				data: {model: 'treatment_plan'}
			}
		],
		treatment_task: [
	    {
	    	name: 'treatment_id',
	    	data: {model: 'treatment_plan'}
		  },
	    {
	    	name: 'event_type_id',
	    	data: {model: 'task_event_type'}
		  },
      {
        name: 'responsibility_id',
        data: {model: 'task_responsibility'}
      },
	    {
	    	name: 'owner_id',
	    	data: {model: 'user_account'}
		  }
		],
		task: [
			{
	    	name: 'owner_id',
	    	data: {model: 'user_account'}
		  },
			{
	    	name: 'type_id',
	    	data: {model: 'task_type'}
		  },
			{
	    	name: 'status_id',
	    	data: {model: 'task_status'}
		  }
		],
		// treatment_plan_medication: [
		// 	{
		// 		name: 'treatment',			
	  //   	data: {model: 'treatment_plan'}
		// 	}
		// ],

// Diagnosis stuff (reference data)
		diagnosis: [
  		{
  			name: 'assessment',
  			data: {
		      collection: 'diagnosis_assessment',
		      via: 'diagnosis_id'
		    }
		  }
	  ],
		diagnosis_assessment: [
  		{
  			name: 'parameters',
  			data: {
		      collection: 'disease_assessment_parameters',
		      via: 'diagnosis_assessment_id'
		    }
		  },
			{
				name: 'diagnosis_id',
				data: {model: 'diagnosis'}
			}
	  ],
		disease_assessment_parameters: [
  		{
  			name: 'options',
  			data: {
		      collection: 'disease_assessment_options',
		      via: 'assessment_parameter_id'
		    }
		  },
			{
				name: 'diagnosis_assessment_id',
				data: {model: 'diagnosis_assessment'}
			}
 		],
		disease_assessment_options: [
			{
				name: 'assessment_parameter_id',
				data: {model: 'disease_assessment_parameters'}
			}
		],
		user_account: [
			{
				name: 'user_role_id',
				data: {model: 'user_role'}
			},
			{
				name: 'status_id',
				data: {model: 'user_status'}
			}
		],
		care_unit_practitioner_association: [
			{
				name: 'practitioner_id',
				data: {model: 'health_practitioner_carer'}
			},
			{
				name: 'care_unit_id',
				data: {model: 'care_unit'}
			}
		],
		care_unit_patient_association: [
			{
				name: 'patient_id',
				data: {model: 'patient'}
			},
			{
				name: 'care_unit_id',
				data: {model: 'care_unit'}
			},
			{
				name: 'primary_practitioner_id',
				data: {model: 'health_practitioner_carer'}
			}
		],
		health_practitioner_carer: [
			{
				name: 'health_practitioner_type_id',
				data: {model: 'health_practitioner_type'}
			},
			{
				name: 'user_account_id',
				data: {model: 'user_account'}
			},
			{
				name: 'title_id',
				data: {model: 'user_title'}
			}
		],
		health_practitioner_type: [
  		{
  			name: 'practitioner_type',
  			data: {
		      collection: 'health_practitioner_carer',
		      via: 'health_practitioner_type_id'
		    }
		  }
	  ],
	  message: [
  		{
  			name: 'recipient',
  			data: {
		      collection: 'message_recipient',
		      via: 'message_id'
		    }
		  },
  		{
  			name: 'attachment',
  			data: {
		      collection: 'message_attachment',
		      via: 'message_id'
		    }
		  },
			{
				name: 'sender_id',
				data: {model: 'user_account'}
			}
	  ],
	  message_recipient: [
			{
				name: 'message_id',
				data: {model: 'message'}
			},
			{
				name: 'recipient_id',
				data: {model: 'user_account'}
			}
	  ],
	  message_attachment: [
			{
				name: 'message_id',
				data: {model: 'message'}
			},
			{
				name: 'attachment_id',
				data: {model: 'attachment'}
			}
	  ],
		patient: [
			{
				name: 'user_account_id',
				data: {model: 'user_account'}
			},
  		{
  			name: 'biometric',
  			data: {
		      collection: 'patient_biometric',
		      via: 'patient_id'
		    }
		  },
  		{
  			name: 'history',
  			data: {
		      collection: 'patient_history',
		      via: 'patient_id'
		    }
		  },
  		{
  			name: 'encounter',
  			data: {
		      collection: 'encounter',
		      via: 'patient_id'
		    }
		  },
  		{
  			name: 'disease_assessment',
  			data: {
		      collection: 'disease_assessment',
		      via: 'patient_id'
		    }
		  },
  		{
  			name: 'treatment_plan',
  			data: {
		      collection: 'treatment_plan',
		      via: 'patient_id'
		    }
		  },
  		{
  			name: 'diagnosis',
  			data: {
		      collection: 'patient_diagnosis',
		      via: 'patient_id'
		    }
		  }
 		],
		patient_biometric: [
			{
				name: 'patient_id',
				data: {model: 'patient'}
			}
		],
		encounter: [
			{
				name: 'patient_id',
				data: {model: 'patient'}
			}
		],
		snomed: [
  		{
  			name: 'snomed_medicinal_product_name_code',
  			data: {
		      collection: 'treatment_template_medication',
		      via: 'medication_id'
		    }
		  }
 		],
		patient_diagnosis: [
			{
				name: 'patient_id',
				data: {model: 'patient'}
			},
			{
				name: 'diagnosis_id',
				data: {model: 'diagnosis'}
			}
		],
		patient_history: [
			{
				name: 'patient_id',
				data: {model: 'patient'}
			},
			{
				name: 'medical_condition_id',
				data: {model: 'medical_condition'}
			}
		],
		medical_condition: [
  		{
  			name: 'history',
  			data: {
		      collection: 'patient_history',
		      via: 'medical_condition_id'
		    }
		  }
		],
		disease_assessment: [
			{
				name: 'patient_id',
				data: {model: 'patient'}
			},
			{
				name: 'gp_id',
				data: {model: 'health_practitioner_carer'}
			},
			{
				name: 'specialist_id',
				data: {model: 'health_practitioner_carer'}
			},
  		{
  			name: 'data',
  			data: {
		      collection: 'disease_assessment_data',
		      via: 'assessment_id'
		    }
		  }
		],
		disease_assessment_data: [
			{
				name: 'assessment_id',
				data: {model: 'disease_assessment'}
			}
		],
		patient_medication: [
			{
				name: 'patient_id',
				data: {model: 'patient'}
			}
		]
	}
