const pool_generator_contract = {
  CONTRACT_ADDRESS: "5GnFoT8g8Qf58jGxWouUmmAkeeMAQM8dT9maxGjkrpN9Zxya",
  CONTRACT_ABI: {
	  "source": {
		"hash": "0x724a316fe102468ae27767298c2f0b0e64fcf40dd43cf0a18f0e54f07a039650",
		"language": "ink! 3.4.0",
		"compiler": "rustc 1.68.0-nightly"
	  },
	  "contract": {
		"name": "pool_generator",
		"version": "2.3.0",
		"authors": [
		  "Support <contact@artzero.io>"
		]
	  },
	  "V3": {
		"spec": {
		  "constructors": [
			{
			  "args": [
				{
				  "label": "pool_hash",
				  "type": {
					"displayName": [
					  "Hash"
					],
					"type": 4
				  }
				},
				{
				  "label": "wal_contract",
				  "type": {
					"displayName": [
					  "AccountId"
					],
					"type": 0
				  }
				},
				{
				  "label": "creation_fee",
				  "type": {
					"displayName": [
					  "Balance"
					],
					"type": 6
				  }
				},
				{
				  "label": "unstake_fee",
				  "type": {
					"displayName": [
					  "Balance"
					],
					"type": 6
				  }
				},
				{
				  "label": "owner_address",
				  "type": {
					"displayName": [
					  "AccountId"
					],
					"type": 0
				  }
				}
			  ],
			  "docs": [],
			  "label": "new",
			  "payable": false,
			  "selector": "0x9bae9d5e"
			}
		  ],
		  "docs": [],
		  "events": [],
		  "messages": [
			{
			  "args": [
				{
				  "label": "contract_owner",
				  "type": {
					"displayName": [
					  "AccountId"
					],
					"type": 0
				  }
				},
				{
				  "label": "psp22_contract_address",
				  "type": {
					"displayName": [
					  "AccountId"
					],
					"type": 0
				  }
				},
				{
				  "label": "apy",
				  "type": {
					"displayName": [
					  "u32"
					],
					"type": 15
				  }
				},
				{
				  "label": "duration",
				  "type": {
					"displayName": [
					  "u64"
					],
					"type": 5
				  }
				},
				{
				  "label": "start_time",
				  "type": {
					"displayName": [
					  "u64"
					],
					"type": 5
				  }
				}
			  ],
			  "docs": [],
			  "label": "new_pool",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "Result"
				],
				"type": 16
			  },
			  "selector": "0x2393fe3a"
			},
			{
			  "args": [],
			  "docs": [
				" Returns the address of the current owner."
			  ],
			  "label": "Ownable::owner",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ownable_external",
				  "OwnerOutput"
				],
				"type": 0
			  },
			  "selector": "0x4fa43c8c"
			},
			{
			  "args": [
				{
				  "label": "new_owner",
				  "type": {
					"displayName": [
					  "ownable_external",
					  "TransferOwnershipInput1"
					],
					"type": 0
				  }
				}
			  ],
			  "docs": [
				" Transfers ownership of the contract to a `new_owner`.",
				" Can only be called by the current owner.",
				"",
				" On success a `OwnershipTransferred` event is emitted.",
				"",
				" # Errors",
				"",
				" Panics with `CallerIsNotOwner` error if caller is not owner.",
				"",
				" Panics with `NewOwnerIsZero` error if new owner's address is zero."
			  ],
			  "label": "Ownable::transfer_ownership",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ownable_external",
				  "TransferOwnershipOutput"
				],
				"type": 21
			  },
			  "selector": "0x11f43efd"
			},
			{
			  "args": [],
			  "docs": [
				" Leaves the contract without owner. It will not be possible to call",
				" owner's functions anymore. Can only be called by the current owner.",
				"",
				" NOTE: Renouncing ownership will leave the contract without an owner,",
				" thereby removing any functionality that is only available to the owner.",
				"",
				" On success a `OwnershipTransferred` event is emitted.",
				"",
				" # Errors",
				"",
				" Panics with `CallerIsNotOwner` error if caller is not owner"
			  ],
			  "label": "Ownable::renounce_ownership",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ownable_external",
				  "RenounceOwnershipOutput"
				],
				"type": 21
			  },
			  "selector": "0x5e228753"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_wal_contract",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolgeneratortrait_external",
				  "GetWalContractOutput"
				],
				"type": 0
			  },
			  "selector": "0x7b7280e9"
			},
			{
			  "args": [
				{
				  "label": "value",
				  "type": {
					"displayName": [
					  "genericpoolgeneratortrait_external",
					  "WithdrawWalInput1"
					],
					"type": 6
				  }
				}
			  ],
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::withdraw_wal",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolgeneratortrait_external",
				  "WithdrawWalOutput"
				],
				"type": 16
			  },
			  "selector": "0x795fbbfb"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_pool_count",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolgeneratortrait_external",
				  "GetPoolCountOutput"
				],
				"type": 5
			  },
			  "selector": "0x38b09ecb"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_creation_fee",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolgeneratortrait_external",
				  "GetCreationFeeOutput"
				],
				"type": 6
			  },
			  "selector": "0xea416566"
			},
			{
			  "args": [
				{
				  "label": "wal_contract",
				  "type": {
					"displayName": [
					  "genericpoolgeneratortrait_external",
					  "SetWalContractInput1"
					],
					"type": 0
				  }
				}
			  ],
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::set_wal_contract",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolgeneratortrait_external",
				  "SetWalContractOutput"
				],
				"type": 16
			  },
			  "selector": "0xe36f3db4"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_unstake_fee",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolgeneratortrait_external",
				  "GetUnstakeFeeOutput"
				],
				"type": 6
			  },
			  "selector": "0xa4395f88"
			},
			{
			  "args": [
				{
				  "label": "contract_owner",
				  "type": {
					"displayName": [
					  "genericpoolgeneratortrait_external",
					  "GetPoolCountByOwnerInput1"
					],
					"type": 0
				  }
				}
			  ],
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_pool_count_by_owner",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolgeneratortrait_external",
				  "GetPoolCountByOwnerOutput"
				],
				"type": 5
			  },
			  "selector": "0xa4cef8cd"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_pool_hash",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolgeneratortrait_external",
				  "GetPoolHashOutput"
				],
				"type": 4
			  },
			  "selector": "0x79f903bb"
			},
			{
			  "args": [
				{
				  "label": "index",
				  "type": {
					"displayName": [
					  "genericpoolgeneratortrait_external",
					  "GetPoolInput1"
					],
					"type": 5
				  }
				}
			  ],
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_pool",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolgeneratortrait_external",
				  "GetPoolOutput"
				],
				"type": 11
			  },
			  "selector": "0xd8207f36"
			},
			{
			  "args": [
				{
				  "label": "creation_fee",
				  "type": {
					"displayName": [
					  "genericpoolgeneratortrait_external",
					  "SetCreationFeeInput1"
					],
					"type": 6
				  }
				}
			  ],
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::set_creation_fee",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolgeneratortrait_external",
				  "SetCreationFeeOutput"
				],
				"type": 16
			  },
			  "selector": "0x3cd3873c"
			},
			{
			  "args": [
				{
				  "label": "pool_hash",
				  "type": {
					"displayName": [
					  "genericpoolgeneratortrait_external",
					  "SetPoolHashInput1"
					],
					"type": 4
				  }
				}
			  ],
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::set_pool_hash",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolgeneratortrait_external",
				  "SetPoolHashOutput"
				],
				"type": 16
			  },
			  "selector": "0xc49c451f"
			},
			{
			  "args": [
				{
				  "label": "unstake_fee",
				  "type": {
					"displayName": [
					  "genericpoolgeneratortrait_external",
					  "SetUnstakeFeeInput1"
					],
					"type": 6
				  }
				}
			  ],
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::set_unstake_fee",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolgeneratortrait_external",
				  "SetUnstakeFeeOutput"
				],
				"type": 16
			  },
			  "selector": "0xfd8d8fda"
			},
			{
			  "args": [
				{
				  "label": "contract_owner",
				  "type": {
					"displayName": [
					  "genericpoolgeneratortrait_external",
					  "GetPoolByOwnerInput1"
					],
					"type": 0
				  }
				},
				{
				  "label": "index",
				  "type": {
					"displayName": [
					  "genericpoolgeneratortrait_external",
					  "GetPoolByOwnerInput2"
					],
					"type": 5
				  }
				}
			  ],
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_pool_by_owner",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolgeneratortrait_external",
				  "GetPoolByOwnerOutput"
				],
				"type": 5
			  },
			  "selector": "0x476bc739"
			},
			{
			  "args": [
				{
				  "label": "value",
				  "type": {
					"displayName": [
					  "genericpoolgeneratortrait_external",
					  "WithdrawFeeInput1"
					],
					"type": 6
				  }
				}
			  ],
			  "docs": [
				" Withdraw Fees - only Owner"
			  ],
			  "label": "GenericPoolGeneratorTrait::withdraw_fee",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolgeneratortrait_external",
				  "WithdrawFeeOutput"
				],
				"type": 16
			  },
			  "selector": "0xe386c676"
			}
		  ]
		},
		"storage": {
		  "struct": {
			"fields": [
			  {
				"layout": {
				  "struct": {
					"fields": [
					  {
						"layout": {
						  "cell": {
							"key": "0xb36ee29c00000000000000000000000000000000000000000000000000000000",
							"ty": 0
						  }
						},
						"name": "owner"
					  },
					  {
						"layout": {
						  "enum": {
							"dispatchKey": "0xb46ee29c00000000000000000000000000000000000000000000000000000000",
							"variants": {
							  "0": {
								"fields": [
								  {
									"layout": {
									  "cell": {
										"key": "0xb56ee29c00000000000000000000000000000000000000000000000000000000",
										"ty": 3
									  }
									},
									"name": null
								  }
								]
							  },
							  "1": {
								"fields": []
							  }
							}
						  }
						},
						"name": "_reserved"
					  }
					]
				  }
				},
				"name": "ownable"
			  },
			  {
				"layout": {
				  "struct": {
					"fields": [
					  {
						"layout": {
						  "cell": {
							"key": "0xeb96a6af00000000000000000000000000000000000000000000000000000000",
							"ty": 4
						  }
						},
						"name": "pool_hash"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xec96a6af00000000000000000000000000000000000000000000000000000000",
							"ty": 0
						  }
						},
						"name": "admin_address"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xed96a6af00000000000000000000000000000000000000000000000000000000",
							"ty": 5
						  }
						},
						"name": "pool_count"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xee96a6af00000000000000000000000000000000000000000000000000000000",
							"ty": 0
						  }
						},
						"name": "wal_contract"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xef96a6af00000000000000000000000000000000000000000000000000000000",
							"ty": 6
						  }
						},
						"name": "creation_fee"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xf096a6af00000000000000000000000000000000000000000000000000000000",
							"ty": 6
						  }
						},
						"name": "unstake_fee"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xf196a6af00000000000000000000000000000000000000000000000000000000",
							"ty": 7
						  }
						},
						"name": "pool_list"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xf296a6af00000000000000000000000000000000000000000000000000000000",
							"ty": 10
						  }
						},
						"name": "pool_ids"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xf396a6af00000000000000000000000000000000000000000000000000000000",
							"ty": 14
						  }
						},
						"name": "pool_ids_last_index"
					  },
					  {
						"layout": {
						  "enum": {
							"dispatchKey": "0xf496a6af00000000000000000000000000000000000000000000000000000000",
							"variants": {
							  "0": {
								"fields": [
								  {
									"layout": {
									  "cell": {
										"key": "0xf596a6af00000000000000000000000000000000000000000000000000000000",
										"ty": 3
									  }
									},
									"name": null
								  }
								]
							  },
							  "1": {
								"fields": []
							  }
							}
						  }
						},
						"name": "_reserved"
					  }
					]
				  }
				},
				"name": "manager"
			  }
			]
		  }
		},
		"types": [
		  {
			"id": 0,
			"type": {
			  "def": {
				"composite": {
				  "fields": [
					{
					  "type": 1,
					  "typeName": "[u8; 32]"
					}
				  ]
				}
			  },
			  "path": [
				"ink_env",
				"types",
				"AccountId"
			  ]
			}
		  },
		  {
			"id": 1,
			"type": {
			  "def": {
				"array": {
				  "len": 32,
				  "type": 2
				}
			  }
			}
		  },
		  {
			"id": 2,
			"type": {
			  "def": {
				"primitive": "u8"
			  }
			}
		  },
		  {
			"id": 3,
			"type": {
			  "def": {
				"tuple": []
			  }
			}
		  },
		  {
			"id": 4,
			"type": {
			  "def": {
				"composite": {
				  "fields": [
					{
					  "type": 1,
					  "typeName": "[u8; 32]"
					}
				  ]
				}
			  },
			  "path": [
				"ink_env",
				"types",
				"Hash"
			  ]
			}
		  },
		  {
			"id": 5,
			"type": {
			  "def": {
				"primitive": "u64"
			  }
			}
		  },
		  {
			"id": 6,
			"type": {
			  "def": {
				"primitive": "u128"
			  }
			}
		  },
		  {
			"id": 7,
			"type": {
			  "def": {
				"composite": {
				  "fields": [
					{
					  "type": 8
					}
				  ]
				}
			  },
			  "params": [
				{
				  "name": "K",
				  "type": 5
				},
				{
				  "name": "V",
				  "type": 0
				}
			  ],
			  "path": [
				"openbrush_lang",
				"storage",
				"mapping",
				"Mapping"
			  ]
			}
		  },
		  {
			"id": 8,
			"type": {
			  "def": {
				"sequence": {
				  "type": 9
				}
			  }
			}
		  },
		  {
			"id": 9,
			"type": {
			  "def": {
				"tuple": [
				  5,
				  0
				]
			  }
			}
		  },
		  {
			"id": 10,
			"type": {
			  "def": {
				"composite": {
				  "fields": [
					{
					  "type": 12
					}
				  ]
				}
			  },
			  "params": [
				{
				  "name": "K",
				  "type": 11
				},
				{
				  "name": "V",
				  "type": 5
				}
			  ],
			  "path": [
				"openbrush_lang",
				"storage",
				"multi_mapping",
				"MultiMapping"
			  ]
			}
		  },
		  {
			"id": 11,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "index": 0,
					  "name": "None"
					},
					{
					  "fields": [
						{
						  "type": 0
						}
					  ],
					  "index": 1,
					  "name": "Some"
					}
				  ]
				}
			  },
			  "params": [
				{
				  "name": "T",
				  "type": 0
				}
			  ],
			  "path": [
				"Option"
			  ]
			}
		  },
		  {
			"id": 12,
			"type": {
			  "def": {
				"sequence": {
				  "type": 13
				}
			  }
			}
		  },
		  {
			"id": 13,
			"type": {
			  "def": {
				"tuple": [
				  11,
				  5
				]
			  }
			}
		  },
		  {
			"id": 14,
			"type": {
			  "def": {
				"composite": {
				  "fields": [
					{
					  "type": 12
					}
				  ]
				}
			  },
			  "params": [
				{
				  "name": "K",
				  "type": 11
				},
				{
				  "name": "V",
				  "type": 5
				}
			  ],
			  "path": [
				"openbrush_lang",
				"storage",
				"mapping",
				"Mapping"
			  ]
			}
		  },
		  {
			"id": 15,
			"type": {
			  "def": {
				"primitive": "u32"
			  }
			}
		  },
		  {
			"id": 16,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 3
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 17
						}
					  ],
					  "index": 1,
					  "name": "Err"
					}
				  ]
				}
			  },
			  "params": [
				{
				  "name": "T",
				  "type": 3
				},
				{
				  "name": "E",
				  "type": 17
				}
			  ],
			  "path": [
				"Result"
			  ]
			}
		  },
		  {
			"id": 17,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 18,
						  "typeName": "String"
						}
					  ],
					  "index": 0,
					  "name": "Custom"
					},
					{
					  "fields": [
						{
						  "type": 19,
						  "typeName": "PSP22Error"
						}
					  ],
					  "index": 1,
					  "name": "PSP22Error"
					},
					{
					  "fields": [
						{
						  "type": 20,
						  "typeName": "PSP34Error"
						}
					  ],
					  "index": 2,
					  "name": "PSP34Error"
					},
					{
					  "index": 3,
					  "name": "CannotTransfer"
					}
				  ]
				}
			  },
			  "path": [
				"inkwhale_project",
				"traits",
				"error",
				"Error"
			  ]
			}
		  },
		  {
			"id": 18,
			"type": {
			  "def": {
				"sequence": {
				  "type": 2
				}
			  }
			}
		  },
		  {
			"id": 19,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 18,
						  "typeName": "String"
						}
					  ],
					  "index": 0,
					  "name": "Custom"
					},
					{
					  "index": 1,
					  "name": "InsufficientBalance"
					},
					{
					  "index": 2,
					  "name": "InsufficientAllowance"
					},
					{
					  "index": 3,
					  "name": "ZeroRecipientAddress"
					},
					{
					  "index": 4,
					  "name": "ZeroSenderAddress"
					},
					{
					  "fields": [
						{
						  "type": 18,
						  "typeName": "String"
						}
					  ],
					  "index": 5,
					  "name": "SafeTransferCheckFailed"
					}
				  ]
				}
			  },
			  "path": [
				"openbrush_contracts",
				"traits",
				"errors",
				"psp22",
				"PSP22Error"
			  ]
			}
		  },
		  {
			"id": 20,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 18,
						  "typeName": "String"
						}
					  ],
					  "index": 0,
					  "name": "Custom"
					},
					{
					  "index": 1,
					  "name": "SelfApprove"
					},
					{
					  "index": 2,
					  "name": "NotApproved"
					},
					{
					  "index": 3,
					  "name": "TokenExists"
					},
					{
					  "index": 4,
					  "name": "TokenNotExists"
					},
					{
					  "fields": [
						{
						  "type": 18,
						  "typeName": "String"
						}
					  ],
					  "index": 5,
					  "name": "SafeTransferCheckFailed"
					}
				  ]
				}
			  },
			  "path": [
				"openbrush_contracts",
				"traits",
				"errors",
				"psp34",
				"PSP34Error"
			  ]
			}
		  },
		  {
			"id": 21,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 3
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 22
						}
					  ],
					  "index": 1,
					  "name": "Err"
					}
				  ]
				}
			  },
			  "params": [
				{
				  "name": "T",
				  "type": 3
				},
				{
				  "name": "E",
				  "type": 22
				}
			  ],
			  "path": [
				"Result"
			  ]
			}
		  },
		  {
			"id": 22,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "index": 0,
					  "name": "CallerIsNotOwner"
					},
					{
					  "index": 1,
					  "name": "NewOwnerIsZero"
					}
				  ]
				}
			  },
			  "path": [
				"openbrush_contracts",
				"traits",
				"errors",
				"ownable",
				"OwnableError"
			  ]
			}
		  }
		]
	  }
	}
};

export default pool_generator_contract;