const azt_contract = {
  CONTRACT_ADDRESS: "5HdR36n7w6iMmLRiVPCbTNLAbRUih6D1JNY52eG4Bh8ipJ7r",
  CONTRACT_ABI: {
	  "source": {
		"hash": "0x8db9eb00850e98e3c6e2bfceead5ab25471268d0fb8df258f8b5c28f20f74d98",
		"language": "ink! 3.4.0",
		"compiler": "rustc 1.68.0-nightly"
	  },
	  "contract": {
		"name": "my_psp22_sale",
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
					"type": 2
				  }
				},
				{
				  "label": "cap",
				  "type": {
					"displayName": [
					  "Balance"
					],
					"type": 0
				  }
				},
				{
				  "label": "minting_fee",
				  "type": {
					"displayName": [
					  "Balance"
					],
					"type": 0
				  }
				},
				{
				  "label": "minting_cap",
				  "type": {
					"displayName": [
					  "Balance"
					],
					"type": 0
				  }
				},
				{
				  "label": "name",
				  "type": {
					"displayName": [
					  "String"
					],
					"type": 12
				  }
				},
				{
				  "label": "symbol",
				  "type": {
					"displayName": [
					  "String"
					],
					"type": 12
				  }
				},
				{
				  "label": "decimal",
				  "type": {
					"displayName": [
					  "u8"
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
				  "label": "spender",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "IncreaseAllowanceInput1"
					],
					"type": 2
				  }
				},
				{
				  "label": "delta_value",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "IncreaseAllowanceInput2"
					],
					"type": 0
				  }
				}
			  ],
			  "docs": [
				" Atomically increases the allowance granted to `spender` by the caller.",
				"",
				" An `Approval` event is emitted.",
				"",
				" # Errors",
				"",
				" Returns `ZeroSenderAddress` error if sender's address is zero.",
				"",
				" Returns `ZeroRecipientAddress` error if recipient's address is zero."
			  ],
			  "label": "PSP22::increase_allowance",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "psp22_external",
				  "IncreaseAllowanceOutput"
				],
				"type": 13
			  },
			  "selector": "0x96d6b57a"
			},
			{
			  "args": [
				{
				  "label": "owner",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "BalanceOfInput1"
					],
					"type": 2
				  }
				}
			  ],
			  "docs": [
				" Returns the account Balance for the specified `owner`.",
				"",
				" Returns `0` if the account is non-existent."
			  ],
			  "label": "PSP22::balance_of",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "psp22_external",
				  "BalanceOfOutput"
				],
				"type": 0
			  },
			  "selector": "0x6568382f"
			},
			{
			  "args": [
				{
				  "label": "spender",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "DecreaseAllowanceInput1"
					],
					"type": 2
				  }
				},
				{
				  "label": "delta_value",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "DecreaseAllowanceInput2"
					],
					"type": 0
				  }
				}
			  ],
			  "docs": [
				" Atomically decreases the allowance granted to `spender` by the caller.",
				"",
				" An `Approval` event is emitted.",
				"",
				" # Errors",
				"",
				" Returns `InsufficientAllowance` error if there are not enough tokens allowed",
				" by owner for `spender`.",
				"",
				" Returns `ZeroSenderAddress` error if sender's address is zero.",
				"",
				" Returns `ZeroRecipientAddress` error if recipient's address is zero."
			  ],
			  "label": "PSP22::decrease_allowance",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "psp22_external",
				  "DecreaseAllowanceOutput"
				],
				"type": 13
			  },
			  "selector": "0xfecb57d5"
			},
			{
			  "args": [
				{
				  "label": "from",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "TransferFromInput1"
					],
					"type": 2
				  }
				},
				{
				  "label": "to",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "TransferFromInput2"
					],
					"type": 2
				  }
				},
				{
				  "label": "value",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "TransferFromInput3"
					],
					"type": 0
				  }
				},
				{
				  "label": "data",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "TransferFromInput4"
					],
					"type": 12
				  }
				}
			  ],
			  "docs": [
				" Transfers `value` tokens on the behalf of `from` to the account `to`",
				" with additional `data` in unspecified format.",
				"",
				" This can be used to allow a contract to transfer tokens on ones behalf and/or",
				" to charge fees in sub-currencies, for example.",
				"",
				" On success a `Transfer` and `Approval` events are emitted.",
				"",
				" # Errors",
				"",
				" Returns `InsufficientAllowance` error if there are not enough tokens allowed",
				" for the caller to withdraw from `from`.",
				"",
				" Returns `InsufficientBalance` error if there are not enough tokens on",
				" the the account Balance of `from`.",
				"",
				" Returns `ZeroSenderAddress` error if sender's address is zero.",
				"",
				" Returns `ZeroRecipientAddress` error if recipient's address is zero."
			  ],
			  "label": "PSP22::transfer_from",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "psp22_external",
				  "TransferFromOutput"
				],
				"type": 13
			  },
			  "selector": "0x54b3c76e"
			},
			{
			  "args": [
				{
				  "label": "spender",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "ApproveInput1"
					],
					"type": 2
				  }
				},
				{
				  "label": "value",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "ApproveInput2"
					],
					"type": 0
				  }
				}
			  ],
			  "docs": [
				" Allows `spender` to withdraw from the caller's account multiple times, up to",
				" the `value` amount.",
				"",
				" If this function is called again it overwrites the current allowance with `value`.",
				"",
				" An `Approval` event is emitted.",
				"",
				" # Errors",
				"",
				" Returns `ZeroSenderAddress` error if sender's address is zero.",
				"",
				" Returns `ZeroRecipientAddress` error if recipient's address is zero."
			  ],
			  "label": "PSP22::approve",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "psp22_external",
				  "ApproveOutput"
				],
				"type": 13
			  },
			  "selector": "0xb20f1bbd"
			},
			{
			  "args": [],
			  "docs": [
				" Returns the total token supply."
			  ],
			  "label": "PSP22::total_supply",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "psp22_external",
				  "TotalSupplyOutput"
				],
				"type": 0
			  },
			  "selector": "0x162df8c2"
			},
			{
			  "args": [
				{
				  "label": "owner",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "AllowanceInput1"
					],
					"type": 2
				  }
				},
				{
				  "label": "spender",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "AllowanceInput2"
					],
					"type": 2
				  }
				}
			  ],
			  "docs": [
				" Returns the amount which `spender` is still allowed to withdraw from `owner`.",
				"",
				" Returns `0` if no allowance has been set `0`."
			  ],
			  "label": "PSP22::allowance",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "psp22_external",
				  "AllowanceOutput"
				],
				"type": 0
			  },
			  "selector": "0x4d47d921"
			},
			{
			  "args": [
				{
				  "label": "to",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "TransferInput1"
					],
					"type": 2
				  }
				},
				{
				  "label": "value",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "TransferInput2"
					],
					"type": 0
				  }
				},
				{
				  "label": "data",
				  "type": {
					"displayName": [
					  "psp22_external",
					  "TransferInput3"
					],
					"type": 12
				  }
				}
			  ],
			  "docs": [
				" Transfers `value` amount of tokens from the caller's account to account `to`",
				" with additional `data` in unspecified format.",
				"",
				" On success a `Transfer` event is emitted.",
				"",
				" # Errors",
				"",
				" Returns `InsufficientBalance` error if there are not enough tokens on",
				" the caller's account Balance.",
				"",
				" Returns `ZeroSenderAddress` error if sender's address is zero.",
				"",
				" Returns `ZeroRecipientAddress` error if recipient's address is zero."
			  ],
			  "label": "PSP22::transfer",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "psp22_external",
				  "TransferOutput"
				],
				"type": 13
			  },
			  "selector": "0xdb20f9f5"
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
				"type": 15
			  },
			  "selector": "0x5e228753"
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
				"type": 2
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
					"type": 2
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
				"type": 15
			  },
			  "selector": "0x11f43efd"
			},
			{
			  "args": [],
			  "docs": [
				" Returns the token decimals."
			  ],
			  "label": "PSP22Metadata::token_decimals",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "psp22metadata_external",
				  "TokenDecimalsOutput"
				],
				"type": 4
			  },
			  "selector": "0x7271b782"
			},
			{
			  "args": [],
			  "docs": [
				" Returns the token name."
			  ],
			  "label": "PSP22Metadata::token_name",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "psp22metadata_external",
				  "TokenNameOutput"
				],
				"type": 17
			  },
			  "selector": "0x3d261bd4"
			},
			{
			  "args": [],
			  "docs": [
				" Returns the token symbol."
			  ],
			  "label": "PSP22Metadata::token_symbol",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "psp22metadata_external",
				  "TokenSymbolOutput"
				],
				"type": 17
			  },
			  "selector": "0x34205be5"
			},
			{
			  "args": [
				{
				  "label": "account",
				  "type": {
					"displayName": [
					  "psp22burnable_external",
					  "BurnInput1"
					],
					"type": 2
				  }
				},
				{
				  "label": "amount",
				  "type": {
					"displayName": [
					  "psp22burnable_external",
					  "BurnInput2"
					],
					"type": 0
				  }
				}
			  ],
			  "docs": [
				" Destroys `amount` tokens from `account`, deducting from the caller's",
				" allowance.",
				"",
				" See [`PSP22::_burn_from`]."
			  ],
			  "label": "PSP22Burnable::burn",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "psp22burnable_external",
				  "BurnOutput"
				],
				"type": 13
			  },
			  "selector": "0x7a9da510"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "TokenMintCapTrait::cap",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "tokenmintcaptrait_external",
				  "CapOutput"
				],
				"type": 0
			  },
			  "selector": "0xad78cc2e"
			},
			{
			  "args": [
				{
				  "label": "amount",
				  "type": {
					"displayName": [
					  "tokenmintcaptrait_external",
					  "PublicMintInput1"
					],
					"type": 0
				  }
				}
			  ],
			  "docs": [],
			  "label": "TokenMintCapTrait::public_mint",
			  "mutates": true,
			  "payable": true,
			  "returnType": {
				"displayName": [
				  "tokenmintcaptrait_external",
				  "PublicMintOutput"
				],
				"type": 13
			  },
			  "selector": "0x49e5f576"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "TokenMintCapTrait::total_minted",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "tokenmintcaptrait_external",
				  "TotalMintedOutput"
				],
				"type": 0
			  },
			  "selector": "0x950dee6e"
			},
			{
			  "args": [
				{
				  "label": "minting_fee",
				  "type": {
					"displayName": [
					  "tokenmintcaptrait_external",
					  "SetMintingFeeInput1"
					],
					"type": 0
				  }
				}
			  ],
			  "docs": [],
			  "label": "TokenMintCapTrait::set_minting_fee",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "tokenmintcaptrait_external",
				  "SetMintingFeeOutput"
				],
				"type": 13
			  },
			  "selector": "0x58f9c527"
			},
			{
			  "args": [
				{
				  "label": "mint_to",
				  "type": {
					"displayName": [
					  "tokenmintcaptrait_external",
					  "OwnerMintInput1"
					],
					"type": 2
				  }
				},
				{
				  "label": "amount",
				  "type": {
					"displayName": [
					  "tokenmintcaptrait_external",
					  "OwnerMintInput2"
					],
					"type": 0
				  }
				}
			  ],
			  "docs": [],
			  "label": "TokenMintCapTrait::owner_mint",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "tokenmintcaptrait_external",
				  "OwnerMintOutput"
				],
				"type": 13
			  },
			  "selector": "0x57102ff8"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "TokenMintCapTrait::minting_fee",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "tokenmintcaptrait_external",
				  "MintingFeeOutput"
				],
				"type": 0
			  },
			  "selector": "0x9a581b7a"
			},
			{
			  "args": [
				{
				  "label": "value",
				  "type": {
					"displayName": [
					  "tokenmintcaptrait_external",
					  "WithdrawFeeInput1"
					],
					"type": 0
				  }
				}
			  ],
			  "docs": [
				" Withdraw Fees - only Owner"
			  ],
			  "label": "TokenMintCapTrait::withdraw_fee",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "tokenmintcaptrait_external",
				  "WithdrawFeeOutput"
				],
				"type": 18
			  },
			  "selector": "0x8e723dd2"
			},
			{
			  "args": [],
			  "docs": [],
			  "label": "TokenMintCapTrait::minting_cap",
			  "mutates": false,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "tokenmintcaptrait_external",
				  "MintingCapOutput"
				],
				"type": 0
			  },
			  "selector": "0x73a46329"
			},
			{
			  "args": [
				{
				  "label": "cap",
				  "type": {
					"displayName": [
					  "tokenmintcaptrait_external",
					  "SetCapInput1"
					],
					"type": 0
				  }
				}
			  ],
			  "docs": [],
			  "label": "TokenMintCapTrait::set_cap",
			  "mutates": true,
			  "payable": false,
			  "returnType": {
				"displayName": [
				  "tokenmintcaptrait_external",
				  "SetCapOutput"
				],
				"type": 13
			  },
			  "selector": "0xef31e5bb"
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
							"key": "0xf232311200000000000000000000000000000000000000000000000000000000",
							"ty": 0
						  }
						},
						"name": "supply"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xf332311200000000000000000000000000000000000000000000000000000000",
							"ty": 1
						  }
						},
						"name": "balances"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xf432311200000000000000000000000000000000000000000000000000000000",
							"ty": 7
						  }
						},
						"name": "allowances"
					  },
					  {
						"layout": {
						  "enum": {
							"dispatchKey": "0xf532311200000000000000000000000000000000000000000000000000000000",
							"variants": {
							  "0": {
								"fields": [
								  {
									"layout": {
									  "cell": {
										"key": "0xf632311200000000000000000000000000000000000000000000000000000000",
										"ty": 11
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
				"name": "psp22"
			  },
			  {
				"layout": {
				  "struct": {
					"fields": [
					  {
						"layout": {
						  "cell": {
							"key": "0xb36ee29c00000000000000000000000000000000000000000000000000000000",
							"ty": 2
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
										"ty": 11
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
						  "enum": {
							"dispatchKey": "0x89ae8e4b00000000000000000000000000000000000000000000000000000000",
							"variants": {
							  "0": {
								"fields": [
								  {
									"layout": {
									  "cell": {
										"key": "0x8aae8e4b00000000000000000000000000000000000000000000000000000000",
										"ty": 12
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
						"name": "name"
					  },
					  {
						"layout": {
						  "enum": {
							"dispatchKey": "0x8aae8e4b00000000000000000000000000000000000000000000000000000000",
							"variants": {
							  "0": {
								"fields": [
								  {
									"layout": {
									  "cell": {
										"key": "0x8bae8e4b00000000000000000000000000000000000000000000000000000000",
										"ty": 12
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
						"name": "symbol"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0x8bae8e4b00000000000000000000000000000000000000000000000000000000",
							"ty": 4
						  }
						},
						"name": "decimals"
					  },
					  {
						"layout": {
						  "enum": {
							"dispatchKey": "0x8cae8e4b00000000000000000000000000000000000000000000000000000000",
							"variants": {
							  "0": {
								"fields": [
								  {
									"layout": {
									  "cell": {
										"key": "0x8dae8e4b00000000000000000000000000000000000000000000000000000000",
										"ty": 11
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
				"name": "metadata"
			  },
			  {
				"layout": {
				  "struct": {
					"fields": [
					  {
						"layout": {
						  "cell": {
							"key": "0xfcd453b300000000000000000000000000000000000000000000000000000000",
							"ty": 0
						  }
						},
						"name": "cap"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xfdd453b300000000000000000000000000000000000000000000000000000000",
							"ty": 0
						  }
						},
						"name": "minting_fee"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xfed453b300000000000000000000000000000000000000000000000000000000",
							"ty": 0
						  }
						},
						"name": "minting_cap"
					  },
					  {
						"layout": {
						  "cell": {
							"key": "0xffd453b300000000000000000000000000000000000000000000000000000000",
							"ty": 0
						  }
						},
						"name": "total_minted"
					  },
					  {
						"layout": {
						  "enum": {
							"dispatchKey": "0x00d553b300000000000000000000000000000000000000000000000000000000",
							"variants": {
							  "0": {
								"fields": [
								  {
									"layout": {
									  "cell": {
										"key": "0x01d553b300000000000000000000000000000000000000000000000000000000",
										"ty": 11
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
				"name": "token_mint_cap"
			  }
			]
		  }
		},
		"types": [
		  {
			"id": 0,
			"type": {
			  "def": {
				"primitive": "u128"
			  }
			}
		  },
		  {
			"id": 1,
			"type": {
			  "def": {
				"composite": {
				  "fields": [
					{
					  "type": 5
					}
				  ]
				}
			  },
			  "params": [
				{
				  "name": "K",
				  "type": 2
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
			"id": 2,
			"type": {
			  "def": {
				"composite": {
				  "fields": [
					{
					  "type": 3,
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
			"id": 3,
			"type": {
			  "def": {
				"array": {
				  "len": 32,
				  "type": 4
				}
			  }
			}
		  },
		  {
			"id": 4,
			"type": {
			  "def": {
				"primitive": "u8"
			  }
			}
		  },
		  {
			"id": 5,
			"type": {
			  "def": {
				"sequence": {
				  "type": 6
				}
			  }
			}
		  },
		  {
			"id": 6,
			"type": {
			  "def": {
				"tuple": [
				  2,
				  0
				]
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
					  "type": 9
					}
				  ]
				}
			  },
			  "params": [
				{
				  "name": "K",
				  "type": 8
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
				"tuple": [
				  2,
				  2
				]
			  }
			}
		  },
		  {
			"id": 9,
			"type": {
			  "def": {
				"sequence": {
				  "type": 10
				}
			  }
			}
		  },
		  {
			"id": 10,
			"type": {
			  "def": {
				"tuple": [
				  8,
				  0
				]
			  }
			}
		  },
		  {
			"id": 11,
			"type": {
			  "def": {
				"tuple": []
			  }
			}
		  },
		  {
			"id": 12,
			"type": {
			  "def": {
				"sequence": {
				  "type": 4
				}
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
					  "fields": [
						{
						  "type": 11
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 14
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
				  "type": 11
				},
				{
				  "name": "E",
				  "type": 14
				}
			  ],
			  "path": [
				"Result"
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
			"id": 15,
			"type": {
			  "def": {
				"variant": {
				  "variants": [
					{
					  "fields": [
						{
						  "type": 11
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 16
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
				  "type": 11
				},
				{
				  "name": "E",
				  "type": 16
				}
			  ],
			  "path": [
				"Result"
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
			"id": 17,
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
						  "type": 12
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
				  "type": 12
				}
			  ],
			  "path": [
				"Option"
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
						  "type": 11
						}
					  ],
					  "index": 0,
					  "name": "Ok"
					},
					{
					  "fields": [
						{
						  "type": 19
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
				  "type": 11
				},
				{
				  "name": "E",
				  "type": 19
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
			"id": 20,
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
		  }
		]
	  }
	}
};

export default azt_contract;