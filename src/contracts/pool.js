const pool_contract = {
  CONTRACT_ADDRESS: "5EDjQuif7kLBMSzE9AzuzdWSVEvTazBPtsAcfj5kdXYZwFyy",
  CONTRACT_ABI: {
	  "source": {
		"hash": "0x9f511c522cb21ca946a78ffcf5be80eb4467baeda7641198b1df4b3d48456482",
		"language": "ink! 3.4.0",
		"compiler": "rustc 1.68.0-nightly"
	  },
	  "contract": {
		"name": "my_pool",
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
				  "label": "contract_owner",
				  "type": {
					"displayName": [
					  "AccountId"
					],
					"type": 0
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
					"type": 10
				  }
				},
				{
				  "label": "duration",
				  "type": {
					"displayName": [
					  "u64"
					],
					"type": 7
				  }
				},
				{
				  "label": "start_time",
				  "type": {
					"displayName": [
					  "u64"
					],
					"type": 7
				  }
				},
				{
				  "label": "unstake_fee",
				  "type": {
					"displayName": [
					  "Balance"
					],
					"type": 4
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
				  "label": "amount",
				  "type": {
					"displayName": [
					  "Balance"
					],
					"type": 4
				  }
				}
			  ],
			  "docs": [],
			  "label": "stake",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "Result"
				],
				"type": 11
			  },
			  "selector": "0x5adb38de"
			},
			{
			  "args": [
				{
				  "label": "amount",
				  "type": {
					"displayName": [
					  "Balance"
					],
					"type": 4
				  }
				}
			  ],
			  "docs": [],
			  "label": "unstake",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "Result"
				],
				"type": 11
			  },
			  "selector": "0x82364901"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "claim_reward",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "Result"
				],
				"type": 11
			  },
			  "selector": "0x9a8353a7"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "apy",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "u32"
				],
				"type": 10
			  },
			  "selector": "0x51564730"
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
				"type": 16
			  },
			  "selector": "0x5e228753"
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
				"type": 16
			  },
			  "selector": "0x11f43efd"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "GenericPoolContractTrait::multiplier",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolcontracttrait_external",
				  "MultiplierOutput"
				],
				"type": 4
			  },
			  "selector": "0xfb1ecf6a"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "GenericPoolContractTrait::duration",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolcontracttrait_external",
				  "DurationOutput"
				],
				"type": 7
			  },
			  "selector": "0xec96d641"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "GenericPoolContractTrait::psp22_contract_address",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolcontracttrait_external",
				  "Psp22ContractAddressOutput"
				],
				"type": 0
			  },
			  "selector": "0x0da3be06"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "GenericPoolContractTrait::staking_contract_address",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolcontracttrait_external",
				  "StakingContractAddressOutput"
				],
				"type": 0
			  },
			  "selector": "0xb22a7a83"
			},
			{
			  "args": [
				{
				  "label": "amount",
				  "type": {
					"displayName": [
					  "genericpoolcontracttrait_external",
					  "TopupRewardPoolInput1"
					],
					"type": 4
				  }
				}
			  ],
			  "docs": [],
			  "label": "GenericPoolContractTrait::topup_reward_pool",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolcontracttrait_external",
				  "TopupRewardPoolOutput"
				],
				"type": 11
			  },
			  "selector": "0xaaa53e1a"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "GenericPoolContractTrait::unstake_fee",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolcontracttrait_external",
				  "UnstakeFeeOutput"
				],
				"type": 4
			  },
			  "selector": "0xc74b547f"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "GenericPoolContractTrait::wal_contract",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolcontracttrait_external",
				  "WalContractOutput"
				],
				"type": 0
			  },
			  "selector": "0x497e56f2"
			},
			{
			  "args": [
				{
				  "label": "staker",
				  "type": {
					"displayName": [
					  "genericpoolcontracttrait_external",
					  "GetStakeInfoInput1"
					],
					"type": 0
				  }
				}
			  ],
			  "docs": [],
			  "label": "GenericPoolContractTrait::get_stake_info",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolcontracttrait_external",
				  "GetStakeInfoOutput"
				],
				"type": 18
			  },
			  "selector": "0x7d91f5c8"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "GenericPoolContractTrait::start_time",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolcontracttrait_external",
				  "StartTimeOutput"
				],
				"type": 7
			  },
			  "selector": "0xc48cf63e"
			},
			{
			  "args": [
				{
				  "label": "amount",
				  "type": {
					"displayName": [
					  "genericpoolcontracttrait_external",
					  "WithdrawRewardPoolInput1"
					],
					"type": 4
				  }
				}
			  ],
			  "docs": [],
			  "label": "GenericPoolContractTrait::withdraw_reward_pool",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolcontracttrait_external",
				  "WithdrawRewardPoolOutput"
				],
				"type": 11
			  },
			  "selector": "0x7be928b9"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "GenericPoolContractTrait::reward_pool",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolcontracttrait_external",
				  "RewardPoolOutput"
				],
				"type": 4
			  },
			  "selector": "0xfc6c3a08"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "GenericPoolContractTrait::total_staked",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "genericpoolcontracttrait_external",
				  "TotalStakedOutput"
				],
				"type": 4
			  },
			  "selector": "0x6d230adf"
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
							"key": "0xb3a59cfd00000000000000000000000000000000000000000000000000000000",
							"ty": 0
						  }
						},
						"name": "staking_contract_address"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xb4a59cfd00000000000000000000000000000000000000000000000000000000",
							"ty": 0
						  }
						},
						"name": "psp22_contract_address"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xb5a59cfd00000000000000000000000000000000000000000000000000000000",
							"ty": 0
						  }
						},
						"name": "wal_contract"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xb6a59cfd00000000000000000000000000000000000000000000000000000000",
							"ty": 4
						  }
						},
						"name": "multiplier"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xb7a59cfd00000000000000000000000000000000000000000000000000000000",
							"ty": 5
						  }
						},
						"name": "stakers"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xb8a59cfd00000000000000000000000000000000000000000000000000000000",
							"ty": 4
						  }
						},
						"name": "reward_pool"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xb9a59cfd00000000000000000000000000000000000000000000000000000000",
							"ty": 4
						  }
						},
						"name": "total_staked"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xbaa59cfd00000000000000000000000000000000000000000000000000000000",
							"ty": 7
						  }
						},
						"name": "duration"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xbba59cfd00000000000000000000000000000000000000000000000000000000",
							"ty": 7
						  }
						},
						"name": "start_time"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xbca59cfd00000000000000000000000000000000000000000000000000000000",
							"ty": 4
						  }
						},
						"name": "unstake_fee"
					  },
					  {
						"layout": {
						  "enum": {
							"dispatchKey": "0xbda59cfd00000000000000000000000000000000000000000000000000000000",
							"variants": {
							  "0": {
								"fields": [
								  {
									"layout": {
									  "cell": {
										"key": "0xbea59cfd00000000000000000000000000000000000000000000000000000000",
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
				"name": "data"
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
				"primitive": "u128"
			  }
			}
		  },
		  {
			"id": 5,
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
				  "type": 0
				},
				{
				  "name": "V",
				  "type": 6
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
			"id": 6,
			"type": {
			  "def": {
				"composite": {
				  "fields": [
					{
					  "name": "last_reward_update",
					  "type": 7,
					  "typeName": "u64"
					},
					{
					  "name": "staked_value",
					  "type": 4,
					  "typeName": "Balance"
					},
					{
					  "name": "unclaimed_reward",
					  "type": 4,
					  "typeName": "Balance"
					}
				  ]
				}
			  },
			  "path": [
				"inkwhale_project",
				"impls",
				"generic_pool_contract",
				"data",
				"StakeInformation"
			  ]
			}
		  },
		  {
			"id": 7,
			"type": {
			  "def": {
				"primitive": "u64"
			  }
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
				  0,
				  6
				]
			  }
			}
		  },
		  {
			"id": 10,
			"type": {
			  "def": {
				"primitive": "u32"
			  }
			}
		  },
		  {
			"id": 11,
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
						  "type": 12
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
				  "type": 12
				}
			  ],
			  "path": [
				"Result"
			  ]
			}
		  },
		  {
			"id": 12,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 13,
						  "typeName": "String"
						}
					  ],
					  "index": 0,
					  "name": "Custom"
					},
					{
					  "fields": [
						{
						  "type": 14,
						  "typeName": "PSP22Error"
						}
					  ],
					  "index": 1,
					  "name": "PSP22Error"
					},
					{
					  "fields": [
						{
						  "type": 15,
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
			"id": 13,
			"type": {
			  "def": {
				"sequence": {
				  "type": 2
				}
			  }
			}
		  },
		  {
			"id": 14,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 13,
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
						  "type": 13,
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
			"id": 15,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 13,
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
						  "type": 13,
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
		  },
		  {
			"id": 18,
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
						  "type": 6
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
				  "type": 6
				}
			  ],
			  "path": [
				"Option"
			  ]
			}
		  }
		]
	  }
	}
};

export default pool_contract;