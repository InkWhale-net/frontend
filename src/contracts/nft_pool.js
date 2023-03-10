const nft_pool_contract = {
  CONTRACT_ADDRESS: "5GnSVjWkh7wCrMDEEVipZGzJJm3RUqXz8DFUtJd4gXAfPS5w",
  CONTRACT_ABI: {
	  "source": {
		"hash": "0x24b04d61a74554b377a59845e92c8877a591801bbbbcb501bb21107d1b19e798",
		"language": "ink! 3.4.0",
		"compiler": "rustc 1.68.0-nightly"
	  },
	  "contract": {
		"name": "my_nft_pool",
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
				  "label": "psp34_contract_address",
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
				  "label": "multiplier",
				  "type": {
					"displayName": [
					  "Balance"
					],
					"type": 4
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
				  "label": "token_id",
				  "type": {
					"displayName": [
					  "Id"
					],
					"type": 11
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
				"type": 17
			  },
			  "selector": "0x5adb38de"
			},
			{
			  "args": [
				{
				  "label": "token_id",
				  "type": {
					"displayName": [
					  "Id"
					],
					"type": 11
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
				"type": 17
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
				"type": 17
			  },
			  "selector": "0x9a8353a7"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "psp34_contract_address",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "AccountId"
				],
				"type": 0
			  },
			  "selector": "0x82c1595f"
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
				"type": 21
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
				"type": 21
			  },
			  "selector": "0x11f43efd"
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
				"type": 17
			  },
			  "selector": "0xaaa53e1a"
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
				"type": 17
			  },
			  "selector": "0x7be928b9"
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
				"type": 23
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
			  "args": [
				{
				  "label": "account",
				  "type": {
					"displayName": [
					  "nftstakinglisttrait_external",
					  "GetStakedIdInput1"
					],
					"type": 0
				  }
				},
				{
				  "label": "index",
				  "type": {
					"displayName": [
					  "nftstakinglisttrait_external",
					  "GetStakedIdInput2"
					],
					"type": 7
				  }
				}
			  ],
			  "docs": [],
			  "label": "NftStakingListTrait::get_staked_id",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "nftstakinglisttrait_external",
				  "GetStakedIdOutput"
				],
				"type": 24
			  },
			  "selector": "0x0e238861"
			},
			{
			  "args": [
				{
				  "label": "account",
				  "type": {
					"displayName": [
					  "nftstakinglisttrait_external",
					  "GetTotalStakedByAccountInput1"
					],
					"type": 0
				  }
				}
			  ],
			  "docs": [],
			  "label": "NftStakingListTrait::get_total_staked_by_account",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "nftstakinglisttrait_external",
				  "GetTotalStakedByAccountOutput"
				],
				"type": 7
			  },
			  "selector": "0x2a30e9be"
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
			  },
			  {
				"layout": {
				  "struct": {
					"fields": [
					  {
						"layout": {
						  "cell": {
							"key": "0x9a08418500000000000000000000000000000000000000000000000000000000",
							"ty": 10
						  }
						},
						"name": "staking_list"
					  },
					  {
						"layout": {
						  "enum": {
							"dispatchKey": "0x9b08418500000000000000000000000000000000000000000000000000000000",
							"variants": {
							  "0": {
								"fields": [
								  {
									"layout": {
									  "cell": {
										"key": "0x9c08418500000000000000000000000000000000000000000000000000000000",
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
				"name": "staking_list_data"
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
				"composite": {
				  "fields": [
					{
					  "type": 15
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
				  "type": 11
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
					  "fields": [
						{
						  "type": 2,
						  "typeName": "u8"
						}
					  ],
					  "index": 0,
					  "name": "U8"
					},
					{
					  "fields": [
						{
						  "type": 12,
						  "typeName": "u16"
						}
					  ],
					  "index": 1,
					  "name": "U16"
					},
					{
					  "fields": [
						{
						  "type": 13,
						  "typeName": "u32"
						}
					  ],
					  "index": 2,
					  "name": "U32"
					},
					{
					  "fields": [
						{
						  "type": 7,
						  "typeName": "u64"
						}
					  ],
					  "index": 3,
					  "name": "U64"
					},
					{
					  "fields": [
						{
						  "type": 4,
						  "typeName": "u128"
						}
					  ],
					  "index": 4,
					  "name": "U128"
					},
					{
					  "fields": [
						{
						  "type": 14,
						  "typeName": "Vec<u8>"
						}
					  ],
					  "index": 5,
					  "name": "Bytes"
					}
				  ]
				}
			  },
			  "path": [
				"openbrush_contracts",
				"traits",
				"types",
				"Id"
			  ]
			}
		  },
		  {
			"id": 12,
			"type": {
			  "def": {
				"primitive": "u16"
			  }
			}
		  },
		  {
			"id": 13,
			"type": {
			  "def": {
				"primitive": "u32"
			  }
			}
		  },
		  {
			"id": 14,
			"type": {
			  "def": {
				"sequence": {
				  "type": 2
				}
			  }
			}
		  },
		  {
			"id": 15,
			"type": {
			  "def": {
				"sequence": {
				  "type": 16
				}
			  }
			}
		  },
		  {
			"id": 16,
			"type": {
			  "def": {
				"tuple": [
				  0,
				  11
				]
			  }
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
						  "type": 3
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 18
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
				  "type": 18
				}
			  ],
			  "path": [
				"Result"
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
					  "fields": [
						{
						  "type": 14,
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
			"id": 19,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 14,
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
						  "type": 14,
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
						  "type": 14,
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
						  "type": 14,
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
		  },
		  {
			"id": 23,
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
		  },
		  {
			"id": 24,
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
						  "type": 11
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
				  "type": 11
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

export default nft_pool_contract;