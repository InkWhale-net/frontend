const azt_contract = {
  CONTRACT_ADDRESS: "5GiYkqRjQ5JXSvHzYwQZh9RHSrpqq6yPhCewPnpNbCBt2Psq",
  CONTRACT_ABI: {
	  "source": {
		"hash": "0x3bec72649462742418fce962a3acfc060015e5dfb7cd69c0a919e6807d44b08b",
		"language": "ink! 4.0.0-beta",
		"compiler": "rustc 1.70.0-nightly",
		"build_info": {
		  "build_mode": "Release",
		  "cargo_contract_version": "2.0.2",
		  "rust_toolchain": "nightly-x86_64-unknown-linux-gnu",
		  "wasm_opt_settings": {
			"keep_debug_symbols": false,
			"optimization_passes": "Z"
		  }
		}
	  },
	  "contract": {
		"name": "my_psp22_sale",
		"version": "0.1.0",
		"authors": [
		  "Support <contact@artzero.io>"
		]
	  },
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
				  "type": 5
				}
			  },
			  {
				"label": "symbol",
				"type": {
				  "displayName": [
					"String"
				  ],
				  "type": 5
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
			"returnType": {
			  "displayName": [
				"ink_primitives",
				"ConstructorResult"
			  ],
			  "type": 6
			},
			"selector": "0x9bae9d5e"
		  }
		],
		"docs": [],
		"events": [],
		"lang_error": {
		  "displayName": [
			"ink",
			"LangError"
		  ],
		  "type": 7
		},
		"messages": [
		  {
			"args": [
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
				  "type": 5
				}
			  },
			  {
				"label": "symbol",
				"type": {
				  "displayName": [
					"String"
				  ],
				  "type": 5
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
			"label": "initialize",
			"mutates": true,
			"payable": false,
			"returnType": {
			  "displayName": [
				"ink",
				"MessageResult"
			  ],
			  "type": 8
			},
			"selector": "0xf2f6dba3"
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
				"ink",
				"MessageResult"
			  ],
			  "type": 14
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
				"ink",
				"MessageResult"
			  ],
			  "type": 15
			},
			"selector": "0x96d6b57a"
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
				  "type": 5
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
				"ink",
				"MessageResult"
			  ],
			  "type": 15
			},
			"selector": "0x54b3c76e"
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
				"ink",
				"MessageResult"
			  ],
			  "type": 14
			},
			"selector": "0x162df8c2"
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
				"ink",
				"MessageResult"
			  ],
			  "type": 15
			},
			"selector": "0xb20f1bbd"
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
				"ink",
				"MessageResult"
			  ],
			  "type": 14
			},
			"selector": "0x4d47d921"
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
				"ink",
				"MessageResult"
			  ],
			  "type": 15
			},
			"selector": "0xfecb57d5"
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
				  "type": 5
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
				"ink",
				"MessageResult"
			  ],
			  "type": 15
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
				"ink",
				"MessageResult"
			  ],
			  "type": 17
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
				"ink",
				"MessageResult"
			  ],
			  "type": 19
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
				"ink",
				"MessageResult"
			  ],
			  "type": 17
			},
			"selector": "0x11f43efd"
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
				"ink",
				"MessageResult"
			  ],
			  "type": 20
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
				"ink",
				"MessageResult"
			  ],
			  "type": 20
			},
			"selector": "0x34205be5"
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
				"ink",
				"MessageResult"
			  ],
			  "type": 22
			},
			"selector": "0x7271b782"
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
			"docs": [],
			"label": "PSP22Burnable::burn",
			"mutates": true,
			"payable": false,
			"returnType": {
			  "displayName": [
				"ink",
				"MessageResult"
			  ],
			  "type": 15
			},
			"selector": "0x7a9da510"
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
				"ink",
				"MessageResult"
			  ],
			  "type": 15
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
				"ink",
				"MessageResult"
			  ],
			  "type": 14
			},
			"selector": "0x9a581b7a"
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
				"ink",
				"MessageResult"
			  ],
			  "type": 15
			},
			"selector": "0xef31e5bb"
		  },
		  {
			"args": [],
			"docs": [],
			"label": "TokenMintCapTrait::minting_cap",
			"mutates": false,
			"payable": false,
			"returnType": {
			  "displayName": [
				"ink",
				"MessageResult"
			  ],
			  "type": 14
			},
			"selector": "0x73a46329"
		  },
		  {
			"args": [],
			"docs": [],
			"label": "TokenMintCapTrait::total_minted",
			"mutates": false,
			"payable": false,
			"returnType": {
			  "displayName": [
				"ink",
				"MessageResult"
			  ],
			  "type": 14
			},
			"selector": "0x950dee6e"
		  },
		  {
			"args": [
			  {
				"label": "minting_cap",
				"type": {
				  "displayName": [
					"tokenmintcaptrait_external",
					"SetMintingCapInput1"
				  ],
				  "type": 0
				}
			  }
			],
			"docs": [],
			"label": "TokenMintCapTrait::set_minting_cap",
			"mutates": true,
			"payable": false,
			"returnType": {
			  "displayName": [
				"ink",
				"MessageResult"
			  ],
			  "type": 15
			},
			"selector": "0x504cffab"
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
				"ink",
				"MessageResult"
			  ],
			  "type": 15
			},
			"selector": "0x49e5f576"
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
				"ink",
				"MessageResult"
			  ],
			  "type": 8
			},
			"selector": "0x8e723dd2"
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
				"ink",
				"MessageResult"
			  ],
			  "type": 15
			},
			"selector": "0x58f9c527"
		  },
		  {
			"args": [],
			"docs": [],
			"label": "TokenMintCapTrait::cap",
			"mutates": false,
			"payable": false,
			"returnType": {
			  "displayName": [
				"ink",
				"MessageResult"
			  ],
			  "type": 14
			},
			"selector": "0xad78cc2e"
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
				  "type": 0
				}
			  },
			  {
				"label": "receiver",
				"type": {
				  "displayName": [
					"admintrait_external",
					"WithdrawFeeInput2"
				  ],
				  "type": 2
				}
			  }
			],
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
			  "type": 8
			},
			"selector": "0x07573e99"
		  },
		  {
			"args": [
			  {
				"label": "nft_contract_address",
				"type": {
				  "displayName": [
					"admintrait_external",
					"TranferNftInput1"
				  ],
				  "type": 2
				}
			  },
			  {
				"label": "token_id",
				"type": {
				  "displayName": [
					"admintrait_external",
					"TranferNftInput2"
				  ],
				  "type": 23
				}
			  },
			  {
				"label": "receiver",
				"type": {
				  "displayName": [
					"admintrait_external",
					"TranferNftInput3"
				  ],
				  "type": 2
				}
			  }
			],
			"docs": [
			  " This function allow contract owner withdraw NFT to an account in case there is any NFT sent to contract by mistake"
			],
			"label": "AdminTrait::tranfer_nft",
			"mutates": true,
			"payable": false,
			"returnType": {
			  "displayName": [
				"ink",
				"MessageResult"
			  ],
			  "type": 8
			},
			"selector": "0xed1e1dfa"
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
				  "type": 2
				}
			  },
			  {
				"label": "amount",
				"type": {
				  "displayName": [
					"admintrait_external",
					"TranferPsp22Input2"
				  ],
				  "type": 0
				}
			  },
			  {
				"label": "receiver",
				"type": {
				  "displayName": [
					"admintrait_external",
					"TranferPsp22Input3"
				  ],
				  "type": 2
				}
			  }
			],
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
			  "type": 8
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
				  "type": 3
				}
			  }
			],
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
			  "type": 8
			},
			"selector": "0x9e32fab2"
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
							"leaf": {
							  "key": "0x00000000",
							  "ty": 0
							}
						  },
						  "name": "supply"
						},
						{
						  "layout": {
							"root": {
							  "layout": {
								"leaf": {
								  "key": "0x1d458d3b",
								  "ty": 0
								}
							  },
							  "root_key": "0x1d458d3b"
							}
						  },
						  "name": "balances"
						},
						{
						  "layout": {
							"root": {
							  "layout": {
								"leaf": {
								  "key": "0x0abd72fb",
								  "ty": 0
								}
							  },
							  "root_key": "0x0abd72fb"
							}
						  },
						  "name": "allowances"
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
										  "ty": 1
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
				  "name": "psp22"
				},
				{
				  "layout": {
					"struct": {
					  "fields": [
						{
						  "layout": {
							"leaf": {
							  "key": "0x00000000",
							  "ty": 2
							}
						  },
						  "name": "owner"
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
										  "ty": 1
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
				  "name": "ownable"
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
										  "ty": 5
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
						  "name": "name"
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
										  "ty": 5
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
						  "name": "symbol"
						},
						{
						  "layout": {
							"leaf": {
							  "key": "0x00000000",
							  "ty": 4
							}
						  },
						  "name": "decimals"
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
										  "ty": 1
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
				  "name": "metadata"
				},
				{
				  "layout": {
					"struct": {
					  "fields": [
						{
						  "layout": {
							"leaf": {
							  "key": "0x00000000",
							  "ty": 0
							}
						  },
						  "name": "cap"
						},
						{
						  "layout": {
							"leaf": {
							  "key": "0x00000000",
							  "ty": 0
							}
						  },
						  "name": "minting_fee"
						},
						{
						  "layout": {
							"leaf": {
							  "key": "0x00000000",
							  "ty": 0
							}
						  },
						  "name": "minting_cap"
						},
						{
						  "layout": {
							"leaf": {
							  "key": "0x00000000",
							  "ty": 0
							}
						  },
						  "name": "total_minted"
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
										  "ty": 1
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
				  "name": "token_mint_cap"
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
										  "ty": 1
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
										  "ty": 1
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
			  "name": "MyPsp22"
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
			  "primitive": "u128"
			}
		  }
		},
		{
		  "id": 1,
		  "type": {
			"def": {
			  "tuple": []
			}
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
			  "ink_primitives",
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
				"type": 4
			  }
			}
		  }
		},
		{
		  "id": 6,
		  "type": {
			"def": {
			  "variant": {
				"variants": [
				  {
					"fields": [
					  {
						"type": 1
					  }
					],
					"index": 0,
					"name": "Ok"
				  },
				  {
					"fields": [
					  {
						"type": 7
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
				"type": 1
			  },
			  {
				"name": "E",
				"type": 7
			  }
			],
			"path": [
			  "Result"
			]
		  }
		},
		{
		  "id": 7,
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
		  "id": 8,
		  "type": {
			"def": {
			  "variant": {
				"variants": [
				  {
					"fields": [
					  {
						"type": 9
					  }
					],
					"index": 0,
					"name": "Ok"
				  },
				  {
					"fields": [
					  {
						"type": 7
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
				"type": 9
			  },
			  {
				"name": "E",
				"type": 7
			  }
			],
			"path": [
			  "Result"
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
						"type": 1
					  }
					],
					"index": 0,
					"name": "Ok"
				  },
				  {
					"fields": [
					  {
						"type": 10
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
				"type": 1
			  },
			  {
				"name": "E",
				"type": 10
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
						"type": 5,
						"typeName": "String"
					  }
					],
					"index": 0,
					"name": "Custom"
				  },
				  {
					"fields": [
					  {
						"type": 11,
						"typeName": "PSP22Error"
					  }
					],
					"index": 1,
					"name": "PSP22Error"
				  },
				  {
					"fields": [
					  {
						"type": 12,
						"typeName": "PSP34Error"
					  }
					],
					"index": 2,
					"name": "PSP34Error"
				  },
				  {
					"fields": [
					  {
						"type": 13,
						"typeName": "OwnableError"
					  }
					],
					"index": 3,
					"name": "OwnableError"
				  },
				  {
					"index": 4,
					"name": "CannotTransfer"
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
					"name": "WithdrawNFTError"
				  },
				  {
					"index": 8,
					"name": "WithdrawPSP22Error"
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
		  "id": 11,
		  "type": {
			"def": {
			  "variant": {
				"variants": [
				  {
					"fields": [
					  {
						"type": 5,
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
						"type": 5,
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
		  "id": 12,
		  "type": {
			"def": {
			  "variant": {
				"variants": [
				  {
					"fields": [
					  {
						"type": 5,
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
						"type": 5,
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
						"type": 7
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
				"type": 7
			  }
			],
			"path": [
			  "Result"
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
						"type": 16
					  }
					],
					"index": 0,
					"name": "Ok"
				  },
				  {
					"fields": [
					  {
						"type": 7
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
				"type": 16
			  },
			  {
				"name": "E",
				"type": 7
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
					"fields": [
					  {
						"type": 1
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
				"type": 1
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
		  "id": 17,
		  "type": {
			"def": {
			  "variant": {
				"variants": [
				  {
					"fields": [
					  {
						"type": 18
					  }
					],
					"index": 0,
					"name": "Ok"
				  },
				  {
					"fields": [
					  {
						"type": 7
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
				"type": 18
			  },
			  {
				"name": "E",
				"type": 7
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
						"type": 1
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
				"type": 1
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
		  "id": 19,
		  "type": {
			"def": {
			  "variant": {
				"variants": [
				  {
					"fields": [
					  {
						"type": 2
					  }
					],
					"index": 0,
					"name": "Ok"
				  },
				  {
					"fields": [
					  {
						"type": 7
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
				"type": 2
			  },
			  {
				"name": "E",
				"type": 7
			  }
			],
			"path": [
			  "Result"
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
						"type": 7
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
				"type": 7
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
						"type": 5
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
				"type": 5
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
						"type": 7
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
				"type": 7
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
						"type": 4,
						"typeName": "u8"
					  }
					],
					"index": 0,
					"name": "U8"
				  },
				  {
					"fields": [
					  {
						"type": 24,
						"typeName": "u16"
					  }
					],
					"index": 1,
					"name": "U16"
				  },
				  {
					"fields": [
					  {
						"type": 25,
						"typeName": "u32"
					  }
					],
					"index": 2,
					"name": "U32"
				  },
				  {
					"fields": [
					  {
						"type": 26,
						"typeName": "u64"
					  }
					],
					"index": 3,
					"name": "U64"
				  },
				  {
					"fields": [
					  {
						"type": 0,
						"typeName": "u128"
					  }
					],
					"index": 4,
					"name": "U128"
				  },
				  {
					"fields": [
					  {
						"type": 5,
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
		  "id": 24,
		  "type": {
			"def": {
			  "primitive": "u16"
			}
		  }
		},
		{
		  "id": 25,
		  "type": {
			"def": {
			  "primitive": "u32"
			}
		  }
		},
		{
		  "id": 26,
		  "type": {
			"def": {
			  "primitive": "u64"
			}
		  }
		}
	  ],
	  "version": "4"
	}
};

export default azt_contract;