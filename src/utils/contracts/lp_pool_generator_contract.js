const lp_pool_generator_contract = {
	CONTRACT_ADDRESS: "5Gq6TYsdAcsKa5q2izk5Q8AtifzMTnDQPjxTBUYcT7NoXMQv",
	CONTRACT_ABI: {
		"source": {
		  "hash": "0xdbdf7d7f4462503b7b8ed17863083099415f5066f4d5864e2520321f23e80327",
		  "language": "ink! 4.3.0",
		  "compiler": "rustc 1.69.0-nightly",
		  "build_info": {
			"build_mode": "Release",
			"cargo_contract_version": "2.0.0-rc",
			"rust_toolchain": "nightly-x86_64-unknown-linux-gnu",
			"wasm_opt_settings": {
			  "keep_debug_symbols": false,
			  "optimization_passes": "Z"
			}
		  }
		},
		"contract": {
		  "name": "lp_pool_generator",
		  "version": "1.0.1",
		  "authors": [
			"Support <contact@artzero.io>"
		  ]
		},
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
					"type": 3
				  }
				},
				{
				  "label": "inw_contract",
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
					"type": 5
				  }
				},
				{
				  "label": "unstake_fee",
				  "type": {
					"displayName": [
					  "Balance"
					],
					"type": 5
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
			  "default": false,
			  "docs": [],
			  "label": "new",
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink_primitives",
				  "ConstructorResult"
				],
				"type": 7
			  },
			  "selector": "0x9bae9d5e"
			}
		  ],
		  "docs": [],
		  "environment": {
			"accountId": {
			  "displayName": [
				"AccountId"
			  ],
			  "type": 0
			},
			"balance": {
			  "displayName": [
				"Balance"
			  ],
			  "type": 5
			},
			"blockNumber": {
			  "displayName": [
				"BlockNumber"
			  ],
			  "type": 29
			},
			"chainExtension": {
			  "displayName": [
				"ChainExtension"
			  ],
			  "type": 30
			},
			"hash": {
			  "displayName": [
				"Hash"
			  ],
			  "type": 3
			},
			"maxEventTopics": 4,
			"timestamp": {
			  "displayName": [
				"Timestamp"
			  ],
			  "type": 4
			}
		  },
		  "events": [],
		  "lang_error": {
			"displayName": [
			  "ink",
			  "LangError"
			],
			"type": 8
		  },
		  "messages": [
			{
			  "args": [
				{
				  "label": "pool_hash",
				  "type": {
					"displayName": [
					  "Hash"
					],
					"type": 3
				  }
				},
				{
				  "label": "inw_contract",
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
					"type": 5
				  }
				},
				{
				  "label": "unstake_fee",
				  "type": {
					"displayName": [
					  "Balance"
					],
					"type": 5
				  }
				}
			  ],
			  "default": false,
			  "docs": [],
			  "label": "initialize",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 9
			  },
			  "selector": "0xf2f6dba3"
			},
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
				  "label": "lp_contract_address",
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
				  "label": "max_staking_amount",
				  "type": {
					"displayName": [
					  "Balance"
					],
					"type": 5
				  }
				},
				{
				  "label": "multiplier",
				  "type": {
					"displayName": [
					  "u128"
					],
					"type": 5
				  }
				},
				{
				  "label": "duration",
				  "type": {
					"displayName": [
					  "u64"
					],
					"type": 4
				  }
				},
				{
				  "label": "start_time",
				  "type": {
					"displayName": [
					  "u64"
					],
					"type": 4
				  }
				}
			  ],
			  "default": false,
			  "docs": [],
			  "label": "new_pool",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 9
			  },
			  "selector": "0x2393fe3a"
			},
			{
			  "args": [],
			  "default": false,
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_inw_contract",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 17
			  },
			  "selector": "0xd6b47e7a"
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
					"type": 3
				  }
				}
			  ],
			  "default": false,
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::set_pool_hash",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 9
			  },
			  "selector": "0xc49c451f"
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
					"type": 4
				  }
				}
			  ],
			  "default": false,
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_pool",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 18
			  },
			  "selector": "0xd8207f36"
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
					"type": 4
				  }
				}
			  ],
			  "default": false,
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_pool_by_owner",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 20
			  },
			  "selector": "0x476bc739"
			},
			{
			  "args": [
				{
				  "label": "inw_contract",
				  "type": {
					"displayName": [
					  "genericpoolgeneratortrait_external",
					  "SetInwContractInput1"
					],
					"type": 0
				  }
				}
			  ],
			  "default": false,
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::set_inw_contract",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 9
			  },
			  "selector": "0xf71a1217"
			},
			{
			  "args": [],
			  "default": false,
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_pool_count",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 22
			  },
			  "selector": "0x38b09ecb"
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
			  "default": false,
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_pool_count_by_owner",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 22
			  },
			  "selector": "0xa4cef8cd"
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
					"type": 5
				  }
				}
			  ],
			  "default": false,
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::set_creation_fee",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 9
			  },
			  "selector": "0x3cd3873c"
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
					"type": 5
				  }
				}
			  ],
			  "default": false,
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::set_unstake_fee",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 9
			  },
			  "selector": "0xfd8d8fda"
			},
			{
			  "args": [],
			  "default": false,
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_unstake_fee",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 23
			  },
			  "selector": "0xa4395f88"
			},
			{
			  "args": [],
			  "default": false,
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_creation_fee",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 23
			  },
			  "selector": "0xea416566"
			},
			{
			  "args": [],
			  "default": false,
			  "docs": [],
			  "label": "GenericPoolGeneratorTrait::get_pool_hash",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 24
			  },
			  "selector": "0x79f903bb"
			},
			{
			  "args": [
				{
				  "label": "value",
				  "type": {
					"displayName": [
					  "admintrait_external",
					  "WithdrawFeeInput1"
					],
					"type": 5
				  }
				},
				{
				  "label": "receiver",
				  "type": {
					"displayName": [
					  "admintrait_external",
					  "WithdrawFeeInput2"
					],
					"type": 0
				  }
				}
			  ],
			  "default": false,
			  "docs": [
				" This function allows contract owner to withdraw contract balance to his account."
			  ],
			  "label": "AdminTrait::withdraw_fee",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 9
			  },
			  "selector": "0x07573e99"
			},
			{
			  "args": [],
			  "default": false,
			  "docs": [
				" Get Azero balance"
			  ],
			  "label": "AdminTrait::get_balance",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 25
			  },
			  "selector": "0xc4360570"
			},
			{
			  "args": [
				{
				  "label": "psp22_contract_address",
				  "type": {
					"displayName": [
					  "admintrait_external",
					  "TranferPsp22Input1"
					],
					"type": 0
				  }
				},
				{
				  "label": "amount",
				  "type": {
					"displayName": [
					  "admintrait_external",
					  "TranferPsp22Input2"
					],
					"type": 5
				  }
				},
				{
				  "label": "receiver",
				  "type": {
					"displayName": [
					  "admintrait_external",
					  "TranferPsp22Input3"
					],
					"type": 0
				  }
				}
			  ],
			  "default": false,
			  "docs": [
				" This function allow contract owner withdraw PSP22 to an account in case there is any token sent to contract by mistake"
			  ],
			  "label": "AdminTrait::tranfer_psp22",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 9
			  },
			  "selector": "0xd9aad284"
			},
			{
			  "args": [
				{
				  "label": "code_hash",
				  "type": {
					"displayName": [
					  "upgradeabletrait_external",
					  "SetCodeInput1"
					],
					"type": 1
				  }
				}
			  ],
			  "default": false,
			  "docs": [
				" This function allow contract owner modifies the code which is used to execute calls to this contract address (`AccountId`)."
			  ],
			  "label": "UpgradeableTrait::set_code",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 9
			  },
			  "selector": "0x9e32fab2"
			},
			{
			  "args": [],
			  "default": false,
			  "docs": [],
			  "label": "Ownable::owner",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 18
			  },
			  "selector": "0x4fa43c8c"
			},
			{
			  "args": [],
			  "default": false,
			  "docs": [],
			  "label": "Ownable::renounce_ownership",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 27
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
			  "default": false,
			  "docs": [],
			  "label": "Ownable::transfer_ownership",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "ink",
				  "MessageResult"
				],
				"type": 27
			  },
			  "selector": "0x11f43efd"
			}
		  ]
		},
		"storage": {
		  "root": {
			"layout": {
			  "struct": {
				"fields": [
				  {
					"layout": {
					  "struct": {
						"fields": [
						  {
							"layout": {
							  "root": {
								"layout": {
								  "enum": {
									"dispatchKey": "0x6f713913",
									"name": "Option",
									"variants": {
									  "0": {
										"fields": [],
										"name": "None"
									  },
									  "1": {
										"fields": [
										  {
											"layout": {
											  "leaf": {
												"key": "0x6f713913",
												"ty": 0
											  }
											},
											"name": "0"
										  }
										],
										"name": "Some"
									  }
									}
								  }
								},
								"root_key": "0x6f713913"
							  }
							},
							"name": "owner"
						  }
						],
						"name": "Data"
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
							  "leaf": {
								"key": "0x00000000",
								"ty": 3
							  }
							},
							"name": "pool_hash"
						  },
						  {
							"layout": {
							  "leaf": {
								"key": "0x00000000",
								"ty": 4
							  }
							},
							"name": "pool_count"
						  },
						  {
							"layout": {
							  "leaf": {
								"key": "0x00000000",
								"ty": 0
							  }
							},
							"name": "inw_contract"
						  },
						  {
							"layout": {
							  "leaf": {
								"key": "0x00000000",
								"ty": 5
							  }
							},
							"name": "creation_fee"
						  },
						  {
							"layout": {
							  "leaf": {
								"key": "0x00000000",
								"ty": 5
							  }
							},
							"name": "unstake_fee"
						  },
						  {
							"layout": {
							  "root": {
								"layout": {
								  "leaf": {
									"key": "0x02691d63",
									"ty": 0
								  }
								},
								"root_key": "0x02691d63"
							  }
							},
							"name": "pool_list"
						  },
						  {
							"layout": {
							  "root": {
								"layout": {
								  "leaf": {
									"key": "0x2f17f942",
									"ty": 4
								  }
								},
								"root_key": "0x2f17f942"
							  }
							},
							"name": "pool_ids"
						  },
						  {
							"layout": {
							  "root": {
								"layout": {
								  "leaf": {
									"key": "0x78f46c9a",
									"ty": 4
								  }
								},
								"root_key": "0x78f46c9a"
							  }
							},
							"name": "pool_ids_last_index"
						  },
						  {
							"layout": {
							  "enum": {
								"dispatchKey": "0x00000000",
								"name": "Option",
								"variants": {
								  "0": {
									"fields": [],
									"name": "None"
								  },
								  "1": {
									"fields": [
									  {
										"layout": {
										  "leaf": {
											"key": "0x00000000",
											"ty": 6
										  }
										},
										"name": "0"
									  }
									],
									"name": "Some"
								  }
								}
							  }
							},
							"name": "_reserved"
						  }
						],
						"name": "Data"
					  }
					},
					"name": "manager"
				  },
				  {
					"layout": {
					  "struct": {
						"fields": [
						  {
							"layout": {
							  "enum": {
								"dispatchKey": "0x00000000",
								"name": "Option",
								"variants": {
								  "0": {
									"fields": [],
									"name": "None"
								  },
								  "1": {
									"fields": [
									  {
										"layout": {
										  "leaf": {
											"key": "0x00000000",
											"ty": 6
										  }
										},
										"name": "0"
									  }
									],
									"name": "Some"
								  }
								}
							  }
							},
							"name": "_reserved"
						  }
						],
						"name": "Data"
					  }
					},
					"name": "admin_data"
				  },
				  {
					"layout": {
					  "struct": {
						"fields": [
						  {
							"layout": {
							  "enum": {
								"dispatchKey": "0x00000000",
								"name": "Option",
								"variants": {
								  "0": {
									"fields": [],
									"name": "None"
								  },
								  "1": {
									"fields": [
									  {
										"layout": {
										  "leaf": {
											"key": "0x00000000",
											"ty": 6
										  }
										},
										"name": "0"
									  }
									],
									"name": "Some"
								  }
								}
							  }
							},
							"name": "_reserved"
						  }
						],
						"name": "Data"
					  }
					},
					"name": "upgradeable_data"
				  }
				],
				"name": "LPPoolGenerator"
			  }
			},
			"root_key": "0x00000000"
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
				"ink_primitives",
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
				"ink_primitives",
				"types",
				"Hash"
			  ]
			}
		  },
		  {
			"id": 4,
			"type": {
			  "def": {
				"primitive": "u64"
			  }
			}
		  },
		  {
			"id": 5,
			"type": {
			  "def": {
				"primitive": "u128"
			  }
			}
		  },
		  {
			"id": 6,
			"type": {
			  "def": {
				"tuple": []
			  }
			}
		  },
		  {
			"id": 7,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 6
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 8
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
				  "type": 6
				},
				{
				  "name": "E",
				  "type": 8
				}
			  ],
			  "path": [
				"Result"
			  ]
			}
		  },
		  {
			"id": 8,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "index": 1,
					  "name": "CouldNotReadInput"
					}
				  ]
				}
			  },
			  "path": [
				"ink_primitives",
				"LangError"
			  ]
			}
		  },
		  {
			"id": 9,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 10
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 8
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
				  "type": 10
				},
				{
				  "name": "E",
				  "type": 8
				}
			  ],
			  "path": [
				"Result"
			  ]
			}
		  },
		  {
			"id": 10,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 6
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 11
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
				  "type": 6
				},
				{
				  "name": "E",
				  "type": 11
				}
			  ],
			  "path": [
				"Result"
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
						  "type": 12,
						  "typeName": "String"
						}
					  ],
					  "index": 0,
					  "name": "Custom"
					},
					{
					  "fields": [
						{
						  "type": 13,
						  "typeName": "OwnableError"
						}
					  ],
					  "index": 1,
					  "name": "OwnableError"
					},
					{
					  "fields": [
						{
						  "type": 14,
						  "typeName": "AccessControlError"
						}
					  ],
					  "index": 2,
					  "name": "AccessControlError"
					},
					{
					  "fields": [
						{
						  "type": 15,
						  "typeName": "PSP22Error"
						}
					  ],
					  "index": 3,
					  "name": "PSP22Error"
					},
					{
					  "fields": [
						{
						  "type": 16,
						  "typeName": "PSP34Error"
						}
					  ],
					  "index": 4,
					  "name": "PSP34Error"
					},
					{
					  "index": 5,
					  "name": "NotEnoughBalance"
					},
					{
					  "index": 6,
					  "name": "WithdrawFeeError"
					},
					{
					  "index": 7,
					  "name": "NotCallable"
					},
					{
					  "index": 8,
					  "name": "CannotTransfer"
					},
					{
					  "index": 9,
					  "name": "CannotBurn"
					},
					{
					  "index": 10,
					  "name": "CheckedOperations"
					},
					{
					  "index": 11,
					  "name": "InvalidBalanceAndAllowance"
					},
					{
					  "index": 12,
					  "name": "AlreadyInit"
					},
					{
					  "index": 13,
					  "name": "InvalidBuyAmount"
					},
					{
					  "index": 14,
					  "name": "InvalidTransferAmount"
					},
					{
					  "index": 15,
					  "name": "CannotCreatePool"
					},
					{
					  "index": 16,
					  "name": "NotTimeToStake"
					},
					{
					  "index": 17,
					  "name": "NoStakerFound"
					},
					{
					  "index": 18,
					  "name": "InvalidUnstakedAmount"
					},
					{
					  "index": 19,
					  "name": "NotEnoughReward"
					},
					{
					  "index": 20,
					  "name": "NotTokenOwner"
					},
					{
					  "index": 21,
					  "name": "AllowanceNotSet"
					},
					{
					  "index": 22,
					  "name": "TokenNotFound"
					},
					{
					  "index": 23,
					  "name": "UserNotStake"
					},
					{
					  "index": 24,
					  "name": "NoTokenOwner"
					},
					{
					  "index": 25,
					  "name": "ExceedTotalStakingAmount"
					},
					{
					  "index": 26,
					  "name": "NoClaimAmount"
					},
					{
					  "index": 27,
					  "name": "NotTimeToWithdraw"
					},
					{
					  "index": 28,
					  "name": "NotEnoughRewardToWithdraw"
					},
					{
					  "index": 29,
					  "name": "NotTopupEnoughReward"
					},
					{
					  "index": 30,
					  "name": "NoAmount"
					},
					{
					  "index": 31,
					  "name": "InvalidTokenBalanceAndAllowance"
					},
					{
					  "index": 32,
					  "name": "CannotApprove"
					},
					{
					  "index": 33,
					  "name": "CannotTopupRewardPool"
					},
					{
					  "index": 34,
					  "name": "NotTimeToPurchase"
					},
					{
					  "index": 35,
					  "name": "NotTimeToClaim"
					},
					{
					  "index": 36,
					  "name": "NotTimeToBurn"
					},
					{
					  "index": 37,
					  "name": "NoTokenPurchased"
					},
					{
					  "index": 38,
					  "name": "AlreadyBurnt"
					},
					{
					  "index": 39,
					  "name": "InvalidTime"
					},
					{
					  "index": 40,
					  "name": "InvalidPercentage"
					},
					{
					  "index": 41,
					  "name": "InvalidDuration"
					},
					{
					  "index": 42,
					  "name": "InvalidTopupAmount"
					},
					{
					  "index": 43,
					  "name": "LaunchpadNotExist"
					},
					{
					  "index": 44,
					  "name": "InvalidIsActiveInput"
					},
					{
					  "index": 45,
					  "name": "InvalidCreationFee"
					},
					{
					  "index": 46,
					  "name": "InvalidTxRate"
					},
					{
					  "index": 47,
					  "name": "InvalidPhaseData"
					},
					{
					  "index": 48,
					  "name": "CannotTopupToken"
					},
					{
					  "index": 49,
					  "name": "InvalidStartTimeAndEndTime"
					},
					{
					  "index": 50,
					  "name": "InvalidPhaseCount"
					},
					{
					  "index": 51,
					  "name": "InvalidMaxStakingAmount"
					},
					{
					  "index": 52,
					  "name": "InvalidApy"
					},
					{
					  "index": 53,
					  "name": "InvalidMultiplier"
					},
					{
					  "index": 54,
					  "name": "InvalidWhitelistData"
					},
					{
					  "index": 55,
					  "name": "PhaseNotExist"
					},
					{
					  "index": 56,
					  "name": "PhaseNotActive"
					},
					{
					  "index": 57,
					  "name": "WhitelistBuyerInfoNotExist"
					},
					{
					  "index": 58,
					  "name": "WhitelistBuyerInfoExist"
					},
					{
					  "index": 59,
					  "name": "WhitelistBuyerPurchased"
					},
					{
					  "index": 60,
					  "name": "WhitelistSaleInfoNotExist"
					},
					{
					  "index": 61,
					  "name": "WhitelistPhaseAccountNotExist"
					},
					{
					  "index": 62,
					  "name": "PublicSaleInfoNotExist"
					},
					{
					  "index": 63,
					  "name": "InvalidSetActive"
					},
					{
					  "index": 64,
					  "name": "InvalidTotalAmount"
					},
					{
					  "index": 65,
					  "name": "CannotTransferTxFee"
					},
					{
					  "index": 66,
					  "name": "ActiveLaunchpadStatusNotFound"
					},
					{
					  "index": 67,
					  "name": "LaunchpadNotActive"
					},
					{
					  "index": 68,
					  "name": "InvalidCaller"
					},
					{
					  "index": 69,
					  "name": "NoPhaseActive"
					},
					{
					  "index": 70,
					  "name": "InvalidTotalSupply"
					},
					{
					  "index": 71,
					  "name": "PhaseNotPublic"
					},
					{
					  "index": 72,
					  "name": "InvalidSetPublic"
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
			"id": 12,
			"type": {
			  "def": {
				"primitive": "str"
			  }
			}
		  },
		  {
			"id": 13,
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
			"id": 14,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "index": 0,
					  "name": "InvalidCaller"
					},
					{
					  "index": 1,
					  "name": "MissingRole"
					},
					{
					  "index": 2,
					  "name": "RoleRedundant"
					}
				  ]
				}
			  },
			  "path": [
				"openbrush_contracts",
				"traits",
				"errors",
				"access_control",
				"AccessControlError"
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
						  "type": 12,
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
						  "type": 12,
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
			"id": 16,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 12,
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
						  "type": 12,
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
			"id": 17,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 0
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 8
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
				  "type": 0
				},
				{
				  "name": "E",
				  "type": 8
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
						  "type": 19
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 8
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
				  "type": 19
				},
				{
				  "name": "E",
				  "type": 8
				}
			  ],
			  "path": [
				"Result"
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
			"id": 20,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 21
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 8
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
				  "type": 21
				},
				{
				  "name": "E",
				  "type": 8
				}
			  ],
			  "path": [
				"Result"
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
					  "index": 0,
					  "name": "None"
					},
					{
					  "fields": [
						{
						  "type": 4
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
				  "type": 4
				}
			  ],
			  "path": [
				"Option"
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
					  "fields": [
						{
						  "type": 4
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 8
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
				  "type": 4
				},
				{
				  "name": "E",
				  "type": 8
				}
			  ],
			  "path": [
				"Result"
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
					  "fields": [
						{
						  "type": 5
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 8
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
				  "type": 5
				},
				{
				  "name": "E",
				  "type": 8
				}
			  ],
			  "path": [
				"Result"
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
						  "type": 8
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
				  "type": 8
				}
			  ],
			  "path": [
				"Result"
			  ]
			}
		  },
		  {
			"id": 25,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 26
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 8
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
				  "type": 26
				},
				{
				  "name": "E",
				  "type": 8
				}
			  ],
			  "path": [
				"Result"
			  ]
			}
		  },
		  {
			"id": 26,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 5
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 11
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
				  "type": 5
				},
				{
				  "name": "E",
				  "type": 11
				}
			  ],
			  "path": [
				"Result"
			  ]
			}
		  },
		  {
			"id": 27,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 28
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 8
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
				  "type": 28
				},
				{
				  "name": "E",
				  "type": 8
				}
			  ],
			  "path": [
				"Result"
			  ]
			}
		  },
		  {
			"id": 28,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 6
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 13
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
				  "type": 6
				},
				{
				  "name": "E",
				  "type": 13
				}
			  ],
			  "path": [
				"Result"
			  ]
			}
		  },
		  {
			"id": 29,
			"type": {
			  "def": {
				"primitive": "u32"
			  }
			}
		  },
		  {
			"id": 30,
			"type": {
			  "def": {
				"variant": {}
			  },
			  "path": [
				"ink_env",
				"types",
				"NoChainExtension"
			  ]
			}
		  }
		],
		"version": "4"
	  }
};

export default lp_pool_generator_contract;