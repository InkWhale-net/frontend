const launchpad = {
  CONTRACT_ADDRESS: "5CCqDEGZfPdyR2qYHX9CfdMidxRxzNDcEzb7utmUK7nqZwyV",
  CONTRACT_ABI: {
    "source": {
      "hash": "0x96d2c29d330814d123a0c4144b09a82a9973919d0aad17be9516a0f7f2c2e54c",
      "language": "ink! 4.2.1",
      "compiler": "rustc 1.68.0",
      "build_info": {
        "build_mode": "Debug",
        "cargo_contract_version": "2.1.0",
        "rust_toolchain": "stable-x86_64-unknown-linux-gnu",
        "wasm_opt_settings": {
          "keep_debug_symbols": false,
          "optimization_passes": "Z"
        }
      }
    },
    "contract": {
      "name": "my_launchpad",
      "version": "1.0.0",
      "authors": [
        "InkWhale <admin@artzero.io>"
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
                "type": 0
              }
            },
            {
              "label": "project_info_uri",
              "type": {
                "displayName": [
                  "String"
                ],
                "type": 3
              }
            },
            {
              "label": "token_address",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "label": "total_supply",
              "type": {
                "displayName": [
                  "Balance"
                ],
                "type": 4
              }
            },
            {
              "label": "generator_contract",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "label": "tx_rate",
              "type": {
                "displayName": [
                  "u32"
                ],
                "type": 5
              }
            },
            {
              "label": "phase_name",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 9
              }
            },
            {
              "label": "phase_start_time",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 10
              }
            },
            {
              "label": "phase_end_time",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 10
              }
            },
            {
              "label": "phase_immediate_release_rate",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 11
              }
            },
            {
              "label": "phase_vesting_duration",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 10
              }
            },
            {
              "label": "phase_vesting_unit",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 10
              }
            },
            {
              "label": "phase_is_public",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 12
              }
            },
            {
              "label": "phase_public_amount",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 13
              }
            },
            {
              "label": "phase_public_price",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 13
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
            "type": 14
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
          "type": 4
        },
        "blockNumber": {
          "displayName": [
            "BlockNumber"
          ],
          "type": 5
        },
        "chainExtension": {
          "displayName": [
            "ChainExtension"
          ],
          "type": 65
        },
        "hash": {
          "displayName": [
            "Hash"
          ],
          "type": 64
        },
        "maxEventTopics": 4,
        "timestamp": {
          "displayName": [
            "Timestamp"
          ],
          "type": 6
        }
      },
      "events": [
        {
          "args": [
            {
              "docs": [],
              "indexed": false,
              "label": "launchpad_contract",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "docs": [],
              "indexed": false,
              "label": "token_contract",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "docs": [],
              "indexed": false,
              "label": "buyer",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "docs": [],
              "indexed": false,
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
          "label": "PublicPurchaseEvent"
        },
        {
          "args": [
            {
              "docs": [],
              "indexed": false,
              "label": "launchpad_contract",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "docs": [],
              "indexed": false,
              "label": "token_contract",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "docs": [],
              "indexed": false,
              "label": "buyer",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "docs": [],
              "indexed": false,
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
          "label": "PublicClaimEvent"
        },
        {
          "args": [
            {
              "docs": [],
              "indexed": false,
              "label": "launchpad_contract",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "docs": [],
              "indexed": false,
              "label": "token_contract",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "docs": [],
              "indexed": false,
              "label": "buyer",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "docs": [],
              "indexed": false,
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
          "label": "WhitelistPurchaseEvent"
        },
        {
          "args": [
            {
              "docs": [],
              "indexed": false,
              "label": "launchpad_contract",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "docs": [],
              "indexed": false,
              "label": "token_contract",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "docs": [],
              "indexed": false,
              "label": "buyer",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "docs": [],
              "indexed": false,
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
          "label": "WhitelistClaimEvent"
        }
      ],
      "lang_error": {
        "displayName": [
          "ink",
          "LangError"
        ],
        "type": 21
      },
      "messages": [
        {
          "args": [
            {
              "label": "project_info_uri",
              "type": {
                "displayName": [
                  "String"
                ],
                "type": 3
              }
            },
            {
              "label": "token_address",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "label": "total_supply",
              "type": {
                "displayName": [
                  "Balance"
                ],
                "type": 4
              }
            },
            {
              "label": "generator_contract",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 0
              }
            },
            {
              "label": "tx_rate",
              "type": {
                "displayName": [
                  "u32"
                ],
                "type": 5
              }
            },
            {
              "label": "phase_name",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 9
              }
            },
            {
              "label": "phase_start_time",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 10
              }
            },
            {
              "label": "phase_end_time",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 10
              }
            },
            {
              "label": "phase_immediate_release_rate",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 11
              }
            },
            {
              "label": "phase_vesting_duration",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 10
              }
            },
            {
              "label": "phase_vesting_unit",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 10
              }
            },
            {
              "label": "phase_is_public",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 12
              }
            },
            {
              "label": "phase_public_amount",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 13
              }
            },
            {
              "label": "phase_public_price",
              "type": {
                "displayName": [
                  "Vec"
                ],
                "type": 13
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
            "type": 14
          },
          "selector": "0xf2f6dba3"
        },
        {
          "args": [
            {
              "label": "name",
              "type": {
                "displayName": [
                  "String"
                ],
                "type": 3
              }
            },
            {
              "label": "start_time",
              "type": {
                "displayName": [
                  "u64"
                ],
                "type": 6
              }
            },
            {
              "label": "end_time",
              "type": {
                "displayName": [
                  "u64"
                ],
                "type": 6
              }
            },
            {
              "label": "immediate_release_rate",
              "type": {
                "displayName": [
                  "u32"
                ],
                "type": 5
              }
            },
            {
              "label": "vesting_duration",
              "type": {
                "displayName": [
                  "u64"
                ],
                "type": 6
              }
            },
            {
              "label": "vesting_unit",
              "type": {
                "displayName": [
                  "u64"
                ],
                "type": 6
              }
            },
            {
              "label": "is_public",
              "type": {
                "displayName": [
                  "bool"
                ],
                "type": 7
              }
            },
            {
              "label": "public_amount",
              "type": {
                "displayName": [
                  "Balance"
                ],
                "type": 4
              }
            },
            {
              "label": "public_price",
              "type": {
                "displayName": [
                  "Balance"
                ],
                "type": 4
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "add_new_phase",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x72bcb3cf"
        },
        {
          "args": [],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_project_end_time",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 22
          },
          "selector": "0xfb0942d5"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetNameInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_name",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 23
          },
          "selector": "0x3c5c0be1"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetPhaseInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "is_active",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetPhaseInput2"
                ],
                "type": 7
              }
            },
            {
              "label": "name",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetPhaseInput3"
                ],
                "type": 3
              }
            },
            {
              "label": "start_time",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetPhaseInput4"
                ],
                "type": 6
              }
            },
            {
              "label": "end_time",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetPhaseInput5"
                ],
                "type": 6
              }
            },
            {
              "label": "immediate_release_rate",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetPhaseInput6"
                ],
                "type": 5
              }
            },
            {
              "label": "vesting_duration",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetPhaseInput7"
                ],
                "type": 6
              }
            },
            {
              "label": "vesting_unit",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetPhaseInput8"
                ],
                "type": 6
              }
            },
            {
              "label": "is_public",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetPhaseInput9"
                ],
                "type": 7
              }
            },
            {
              "label": "total_amount",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetPhaseInput10"
                ],
                "type": 4
              }
            },
            {
              "label": "price",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetPhaseInput11"
                ],
                "type": 4
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_phase",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x002e8971"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetVestingDurationInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "vesting_duration",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetVestingDurationInput2"
                ],
                "type": 6
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_vesting_duration",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x6cbcc9c3"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "AddMultiWhitelistsInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "accounts",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "AddMultiWhitelistsInput2"
                ],
                "type": 25
              }
            },
            {
              "label": "whitelist_amounts",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "AddMultiWhitelistsInput3"
                ],
                "type": 13
              }
            },
            {
              "label": "whitelist_prices",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "AddMultiWhitelistsInput4"
                ],
                "type": 13
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::add_multi_whitelists",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0xc6a48084"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "WhitelistPurchaseInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "amount",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "WhitelistPurchaseInput2"
                ],
                "type": 4
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::whitelist_purchase",
          "mutates": true,
          "payable": true,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0xca252d08"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetWhitelistSaleTotalAmountInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_whitelist_sale_total_amount",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 26
          },
          "selector": "0x8a32d9b4"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetMultiPhasesInput1"
                ],
                "type": 28
              }
            },
            {
              "label": "is_active",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetMultiPhasesInput2"
                ],
                "type": 12
              }
            },
            {
              "label": "name",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetMultiPhasesInput3"
                ],
                "type": 9
              }
            },
            {
              "label": "start_time",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetMultiPhasesInput4"
                ],
                "type": 10
              }
            },
            {
              "label": "end_time",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetMultiPhasesInput5"
                ],
                "type": 10
              }
            },
            {
              "label": "immediate_release_rate",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetMultiPhasesInput6"
                ],
                "type": 11
              }
            },
            {
              "label": "vesting_duration",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetMultiPhasesInput7"
                ],
                "type": 10
              }
            },
            {
              "label": "vesting_unit",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetMultiPhasesInput8"
                ],
                "type": 10
              }
            },
            {
              "label": "is_public",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetMultiPhasesInput9"
                ],
                "type": 12
              }
            },
            {
              "label": "total_amount",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetMultiPhasesInput10"
                ],
                "type": 13
              }
            },
            {
              "label": "price",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetMultiPhasesInput11"
                ],
                "type": 13
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_multi_phases",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0xcc99f231"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetWhitelistSaleInfoInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_whitelist_sale_info",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 29
          },
          "selector": "0xc8e626b9"
        },
        {
          "args": [
            {
              "label": "token_address",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetTokenAddressInput1"
                ],
                "type": 0
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_token_address",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0xcfc68012"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetPublicSaleTotalClaimedAmountInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_public_sale_total_claimed_amount",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 26
          },
          "selector": "0xb3545314"
        },
        {
          "args": [
            {
              "label": "value",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "WithdrawInput1"
                ],
                "type": 4
              }
            },
            {
              "label": "receiver",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "WithdrawInput2"
                ],
                "type": 0
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::withdraw",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x2b959dac"
        },
        {
          "args": [
            {
              "label": "total_supply",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetTotalSupplyInput1"
                ],
                "type": 4
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_total_supply",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x6e74930d"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetIsActiveInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "is_active",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetIsActiveInput2"
                ],
                "type": 7
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_is_active",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0xec4589d6"
        },
        {
          "args": [],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_project_start_time",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 22
          },
          "selector": "0x9395b689"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetPublicSalePriceInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "price",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetPublicSalePriceInput2"
                ],
                "type": 4
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_public_sale_price",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0xa125c795"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetWhitelistAccountInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "account_index",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetWhitelistAccountInput2"
                ],
                "type": 6
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_whitelist_account",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 32
          },
          "selector": "0xd3091cff"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "PublicClaimInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::public_claim",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x0d1cbfe8"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetPhaseInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_phase",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 34
          },
          "selector": "0x60b655b0"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetPublicSaleInfoInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [
            " Public sale"
          ],
          "label": "LaunchpadContractTrait::get_public_sale_info",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 37
          },
          "selector": "0x396b5ab7"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetWhitelistSaleTotalClaimedAmountInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_whitelist_sale_total_claimed_amount",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 26
          },
          "selector": "0xffb82283"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetVestingUnitInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_vesting_unit",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 40
          },
          "selector": "0x8cab2e95"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetNameInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "name",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetNameInput2"
                ],
                "type": 3
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_name",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x27d3f395"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetPublicSalePriceInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_public_sale_price",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 26
          },
          "selector": "0xa8604763"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetWhitelistSaleTotalPurchasedAmountInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_whitelist_sale_total_purchased_amount",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 26
          },
          "selector": "0x2beb629f"
        },
        {
          "args": [],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_tx_rate",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 42
          },
          "selector": "0xe569dc1a"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "PublicPurchaseInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "amount",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "PublicPurchaseInput2"
                ],
                "type": 4
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::public_purchase",
          "mutates": true,
          "payable": true,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x26ca12dd"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetStartAndEndTimeInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "start_time",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetStartAndEndTimeInput2"
                ],
                "type": 6
              }
            },
            {
              "label": "end_time",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetStartAndEndTimeInput3"
                ],
                "type": 6
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_start_and_end_time",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x596d9c64"
        },
        {
          "args": [
            {
              "label": "generator_contract",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetGeneratorContractInput1"
                ],
                "type": 0
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_generator_contract",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x8d51a8a7"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetEndTimeInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_end_time",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 40
          },
          "selector": "0x52288dbd"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetPublicSaleTotalPurchasedAmountInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_public_sale_total_purchased_amount",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 26
          },
          "selector": "0x6bd125b3"
        },
        {
          "args": [
            {
              "label": "project_info_uri",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetProjectInfoUriInput1"
                ],
                "type": 3
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_project_info_uri",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0xab0d645e"
        },
        {
          "args": [],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::burn_unsold_tokens",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x6549d39e"
        },
        {
          "args": [],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_generator_contract",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 43
          },
          "selector": "0x2bdec393"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetStartTimeInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_start_time",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 40
          },
          "selector": "0x8dc373df"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetImmediateReleaseRateInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_immediate_release_rate",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 44
          },
          "selector": "0x482c7183"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetPublicBuyerInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "account",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetPublicBuyerInput2"
                ],
                "type": 0
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_public_buyer",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 46
          },
          "selector": "0xc6941757"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetPublicTotalAmountInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "total_amount",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetPublicTotalAmountInput2"
                ],
                "type": 4
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_public_total_amount",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0xe78eb129"
        },
        {
          "args": [],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_total_supply",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 49
          },
          "selector": "0x410ec6e8"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetVestingUnitInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "vesting_unit",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetVestingUnitInput2"
                ],
                "type": 6
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_vesting_unit",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x28eb4533"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetPublicSaleTotalAmountInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_public_sale_total_amount",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 26
          },
          "selector": "0xb6d2b81a"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetVestingDurationInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_vesting_duration",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 40
          },
          "selector": "0x3acd8ddf"
        },
        {
          "args": [],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_balance",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 50
          },
          "selector": "0xc209eacc"
        },
        {
          "args": [
            {
              "label": "receiver",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "WithdrawUnsoldTokensInput1"
                ],
                "type": 0
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::withdraw_unsold_tokens",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0xf165e99c"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetWhitelistBuyerInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "account",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetWhitelistBuyerInput2"
                ],
                "type": 0
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_whitelist_buyer",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 52
          },
          "selector": "0xfd687fca"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "WhitelistClaimInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::whitelist_claim",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x4ded4cf0"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetWhitelistAccountCountInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_whitelist_account_count",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 22
          },
          "selector": "0x54208622"
        },
        {
          "args": [],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_token_address",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 43
          },
          "selector": "0xae1a6481"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "GetIsActiveInput1"
                ],
                "type": 2
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_is_active",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 55
          },
          "selector": "0x34edecf0"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetIsPublicInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "is_public",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetIsPublicInput2"
                ],
                "type": 7
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_is_public",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0xa958aa3e"
        },
        {
          "args": [],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_total_phase",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 57
          },
          "selector": "0xe6a1c0c4"
        },
        {
          "args": [],
          "default": false,
          "docs": [
            " Getters",
            " Phase Info"
          ],
          "label": "LaunchpadContractTrait::get_project_info_uri",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 58
          },
          "selector": "0x11652eee"
        },
        {
          "args": [],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::get_available_token_amount",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 49
          },
          "selector": "0x83754ee7"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetImmediateReleaseRateInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "immediate_release_rate",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetImmediateReleaseRateInput2"
                ],
                "type": 5
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_immediate_release_rate",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x491cf52b"
        },
        {
          "args": [
            {
              "label": "phase_id",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "UpdateMultiWhitelistsInput1"
                ],
                "type": 2
              }
            },
            {
              "label": "accounts",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "UpdateMultiWhitelistsInput2"
                ],
                "type": 25
              }
            },
            {
              "label": "whitelist_amounts",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "UpdateMultiWhitelistsInput3"
                ],
                "type": 13
              }
            },
            {
              "label": "whitelist_prices",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "UpdateMultiWhitelistsInput4"
                ],
                "type": 13
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::update_multi_whitelists",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x53789416"
        },
        {
          "args": [
            {
              "label": "amount",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "TopupInput1"
                ],
                "type": 4
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::topup",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x28577c22"
        },
        {
          "args": [
            {
              "label": "tx_rate",
              "type": {
                "displayName": [
                  "launchpadcontracttrait_external",
                  "SetTxRateInput1"
                ],
                "type": 5
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "LaunchpadContractTrait::set_tx_rate",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 14
          },
          "selector": "0x005b2af4"
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
            "type": 14
          },
          "selector": "0x9e32fab2"
        },
        {
          "args": [
            {
              "label": "role",
              "type": {
                "displayName": [
                  "accesscontrol_external",
                  "GrantRoleInput1"
                ],
                "type": 5
              }
            },
            {
              "label": "account",
              "type": {
                "displayName": [
                  "accesscontrol_external",
                  "GrantRoleInput2"
                ],
                "type": 33
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "AccessControl::grant_role",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 59
          },
          "selector": "0x4ac062fd"
        },
        {
          "args": [
            {
              "label": "role",
              "type": {
                "displayName": [
                  "accesscontrol_external",
                  "GetRoleAdminInput1"
                ],
                "type": 5
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "AccessControl::get_role_admin",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 42
          },
          "selector": "0x83da3bb2"
        },
        {
          "args": [
            {
              "label": "role",
              "type": {
                "displayName": [
                  "accesscontrol_external",
                  "HasRoleInput1"
                ],
                "type": 5
              }
            },
            {
              "label": "address",
              "type": {
                "displayName": [
                  "accesscontrol_external",
                  "HasRoleInput2"
                ],
                "type": 33
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "AccessControl::has_role",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 61
          },
          "selector": "0xc1d9ac18"
        },
        {
          "args": [
            {
              "label": "role",
              "type": {
                "displayName": [
                  "accesscontrol_external",
                  "RevokeRoleInput1"
                ],
                "type": 5
              }
            },
            {
              "label": "account",
              "type": {
                "displayName": [
                  "accesscontrol_external",
                  "RevokeRoleInput2"
                ],
                "type": 33
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "AccessControl::revoke_role",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 59
          },
          "selector": "0x6e4f0991"
        },
        {
          "args": [
            {
              "label": "role",
              "type": {
                "displayName": [
                  "accesscontrol_external",
                  "RenounceRoleInput1"
                ],
                "type": 5
              }
            },
            {
              "label": "account",
              "type": {
                "displayName": [
                  "accesscontrol_external",
                  "RenounceRoleInput2"
                ],
                "type": 33
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "AccessControl::renounce_role",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 59
          },
          "selector": "0xeaf1248a"
        },
        {
          "args": [
            {
              "label": "role",
              "type": {
                "displayName": [
                  "accesscontrolenumerable_external",
                  "GetRoleMemberCountInput1"
                ],
                "type": 5
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "AccessControlEnumerable::get_role_member_count",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 42
          },
          "selector": "0xf1b1a9d7"
        },
        {
          "args": [
            {
              "label": "role",
              "type": {
                "displayName": [
                  "accesscontrolenumerable_external",
                  "GetRoleMemberInput1"
                ],
                "type": 5
              }
            },
            {
              "label": "index",
              "type": {
                "displayName": [
                  "accesscontrolenumerable_external",
                  "GetRoleMemberInput2"
                ],
                "type": 5
              }
            }
          ],
          "default": false,
          "docs": [],
          "label": "AccessControlEnumerable::get_role_member",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 32
          },
          "selector": "0x163469e0"
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
            "type": 62
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
            "type": 62
          },
          "selector": "0x11f43efd"
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
            "type": 32
          },
          "selector": "0x4fa43c8c"
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
                        "name": "project_info_uri"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 0
                          }
                        },
                        "name": "token_address"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 4
                          }
                        },
                        "name": "total_supply"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 4
                          }
                        },
                        "name": "available_token_amount"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 0
                          }
                        },
                        "name": "generator_contract"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 5
                          }
                        },
                        "name": "tx_rate"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 6
                          }
                        },
                        "name": "project_start_time"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 6
                          }
                        },
                        "name": "project_end_time"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 2
                          }
                        },
                        "name": "total_phase"
                      },
                      {
                        "layout": {
                          "root": {
                            "layout": {
                              "struct": {
                                "fields": [
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x38d6c078",
                                        "ty": 7
                                      }
                                    },
                                    "name": "is_active"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x38d6c078",
                                        "ty": 3
                                      }
                                    },
                                    "name": "name"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x38d6c078",
                                        "ty": 6
                                      }
                                    },
                                    "name": "start_time"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x38d6c078",
                                        "ty": 6
                                      }
                                    },
                                    "name": "end_time"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x38d6c078",
                                        "ty": 5
                                      }
                                    },
                                    "name": "immediate_release_rate"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x38d6c078",
                                        "ty": 6
                                      }
                                    },
                                    "name": "vesting_duration"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x38d6c078",
                                        "ty": 6
                                      }
                                    },
                                    "name": "end_vesting_time"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x38d6c078",
                                        "ty": 6
                                      }
                                    },
                                    "name": "vesting_unit"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x38d6c078",
                                        "ty": 6
                                      }
                                    },
                                    "name": "total_vesting_units"
                                  }
                                ],
                                "name": "PhaseInfo"
                              }
                            },
                            "root_key": "0x38d6c078"
                          }
                        },
                        "name": "phase"
                      },
                      {
                        "layout": {
                          "root": {
                            "layout": {
                              "struct": {
                                "fields": [
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0xdfa2ebe4",
                                        "ty": 7
                                      }
                                    },
                                    "name": "is_public"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0xdfa2ebe4",
                                        "ty": 4
                                      }
                                    },
                                    "name": "total_amount"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0xdfa2ebe4",
                                        "ty": 4
                                      }
                                    },
                                    "name": "price"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0xdfa2ebe4",
                                        "ty": 4
                                      }
                                    },
                                    "name": "total_purchased_amount"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0xdfa2ebe4",
                                        "ty": 4
                                      }
                                    },
                                    "name": "total_claimed_amount"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0xdfa2ebe4",
                                        "ty": 7
                                      }
                                    },
                                    "name": "is_burned"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0xdfa2ebe4",
                                        "ty": 7
                                      }
                                    },
                                    "name": "is_withdrawn"
                                  }
                                ],
                                "name": "PublicSaleInfo"
                              }
                            },
                            "root_key": "0xdfa2ebe4"
                          }
                        },
                        "name": "public_sale_info"
                      },
                      {
                        "layout": {
                          "root": {
                            "layout": {
                              "struct": {
                                "fields": [
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x9c47092d",
                                        "ty": 4
                                      }
                                    },
                                    "name": "purchased_amount"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x9c47092d",
                                        "ty": 4
                                      }
                                    },
                                    "name": "vesting_amount"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x9c47092d",
                                        "ty": 4
                                      }
                                    },
                                    "name": "claimed_amount"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x9c47092d",
                                        "ty": 6
                                      }
                                    },
                                    "name": "last_updated_time"
                                  }
                                ],
                                "name": "BuyerInformation"
                              }
                            },
                            "root_key": "0x9c47092d"
                          }
                        },
                        "name": "public_buyer"
                      },
                      {
                        "layout": {
                          "root": {
                            "layout": {
                              "struct": {
                                "fields": [
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0xddc6ffce",
                                        "ty": 4
                                      }
                                    },
                                    "name": "total_amount"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0xddc6ffce",
                                        "ty": 4
                                      }
                                    },
                                    "name": "total_purchased_amount"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0xddc6ffce",
                                        "ty": 4
                                      }
                                    },
                                    "name": "total_claimed_amount"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0xddc6ffce",
                                        "ty": 7
                                      }
                                    },
                                    "name": "is_burned"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0xddc6ffce",
                                        "ty": 7
                                      }
                                    },
                                    "name": "is_withdrawn"
                                  }
                                ],
                                "name": "WhitelistSaleInfo"
                              }
                            },
                            "root_key": "0xddc6ffce"
                          }
                        },
                        "name": "whitelist_sale_info"
                      },
                      {
                        "layout": {
                          "root": {
                            "layout": {
                              "leaf": {
                                "key": "0xadf3b11d",
                                "ty": 0
                              }
                            },
                            "root_key": "0xadf3b11d"
                          }
                        },
                        "name": "whitelist_account"
                      },
                      {
                        "layout": {
                          "root": {
                            "layout": {
                              "struct": {
                                "fields": [
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x2f033ebd",
                                        "ty": 4
                                      }
                                    },
                                    "name": "amount"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x2f033ebd",
                                        "ty": 4
                                      }
                                    },
                                    "name": "price"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x2f033ebd",
                                        "ty": 4
                                      }
                                    },
                                    "name": "purchased_amount"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x2f033ebd",
                                        "ty": 4
                                      }
                                    },
                                    "name": "vesting_amount"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x2f033ebd",
                                        "ty": 4
                                      }
                                    },
                                    "name": "claimed_amount"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0x2f033ebd",
                                        "ty": 6
                                      }
                                    },
                                    "name": "last_updated_time"
                                  }
                                ],
                                "name": "WhitelistBuyerInfo"
                              }
                            },
                            "root_key": "0x2f033ebd"
                          }
                        },
                        "name": "whitelist_buyer"
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
                                        "ty": 8
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
                "name": "data"
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
                                        "ty": 8
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
              },
              {
                "layout": {
                  "struct": {
                    "fields": [
                      {
                        "layout": {
                          "root": {
                            "layout": {
                              "leaf": {
                                "key": "0x1f2cf4ac",
                                "ty": 5
                              }
                            },
                            "root_key": "0x1f2cf4ac"
                          }
                        },
                        "name": "admin_roles"
                      },
                      {
                        "layout": {
                          "root": {
                            "layout": {
                              "leaf": {
                                "key": "0x8150f558",
                                "ty": 8
                              }
                            },
                            "root_key": "0x8150f558"
                          }
                        },
                        "name": "members"
                      }
                    ],
                    "name": "Data"
                  }
                },
                "name": "access"
              },
              {
                "layout": {
                  "struct": {
                    "fields": [
                      {
                        "layout": {
                          "root": {
                            "layout": {
                              "leaf": {
                                "key": "0x1eb9f2a8",
                                "ty": 5
                              }
                            },
                            "root_key": "0x1eb9f2a8"
                          }
                        },
                        "name": "admin_roles"
                      },
                      {
                        "layout": {
                          "root": {
                            "layout": {
                              "enum": {
                                "dispatchKey": "0x869d6fc0",
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
                                            "key": "0x869d6fc0",
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
                            "root_key": "0x869d6fc0"
                          }
                        },
                        "name": "role_members"
                      }
                    ],
                    "name": "Data"
                  }
                },
                "name": "enumerable"
              }
            ],
            "name": "MyLaunchpad"
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
            "primitive": "str"
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
            "primitive": "u32"
          }
        }
      },
      {
        "id": 6,
        "type": {
          "def": {
            "primitive": "u64"
          }
        }
      },
      {
        "id": 7,
        "type": {
          "def": {
            "primitive": "bool"
          }
        }
      },
      {
        "id": 8,
        "type": {
          "def": {
            "tuple": []
          }
        }
      },
      {
        "id": 9,
        "type": {
          "def": {
            "sequence": {
              "type": 3
            }
          }
        }
      },
      {
        "id": 10,
        "type": {
          "def": {
            "sequence": {
              "type": 6
            }
          }
        }
      },
      {
        "id": 11,
        "type": {
          "def": {
            "sequence": {
              "type": 5
            }
          }
        }
      },
      {
        "id": 12,
        "type": {
          "def": {
            "sequence": {
              "type": 7
            }
          }
        }
      },
      {
        "id": 13,
        "type": {
          "def": {
            "sequence": {
              "type": 4
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
                      "type": 15
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 15
            },
            {
              "name": "E",
              "type": 21
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
                      "type": 8
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
              "type": 8
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
                  "fields": [
                    {
                      "type": 3,
                      "typeName": "String"
                    }
                  ],
                  "index": 0,
                  "name": "Custom"
                },
                {
                  "fields": [
                    {
                      "type": 17,
                      "typeName": "OwnableError"
                    }
                  ],
                  "index": 1,
                  "name": "OwnableError"
                },
                {
                  "fields": [
                    {
                      "type": 18,
                      "typeName": "AccessControlError"
                    }
                  ],
                  "index": 2,
                  "name": "AccessControlError"
                },
                {
                  "fields": [
                    {
                      "type": 19,
                      "typeName": "PSP22Error"
                    }
                  ],
                  "index": 3,
                  "name": "PSP22Error"
                },
                {
                  "fields": [
                    {
                      "type": 20,
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
        "id": 19,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 3,
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
                      "type": 3,
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
                      "type": 3,
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
                      "type": 3,
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
        "id": 22,
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
                      "type": 21
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
              "type": 21
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
                      "type": 24
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 24
            },
            {
              "name": "E",
              "type": 21
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
                  "index": 0,
                  "name": "None"
                },
                {
                  "fields": [
                    {
                      "type": 3
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
              "type": 3
            }
          ],
          "path": [
            "Option"
          ]
        }
      },
      {
        "id": 25,
        "type": {
          "def": {
            "sequence": {
              "type": 0
            }
          }
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
                      "type": 27
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 27
            },
            {
              "name": "E",
              "type": 21
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
        "id": 28,
        "type": {
          "def": {
            "sequence": {
              "type": 2
            }
          }
        }
      },
      {
        "id": 29,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 30
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 30
            },
            {
              "name": "E",
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 30,
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
                      "type": 31
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
              "type": 31
            }
          ],
          "path": [
            "Option"
          ]
        }
      },
      {
        "id": 31,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "name": "total_amount",
                  "type": 4,
                  "typeName": "Balance"
                },
                {
                  "name": "total_purchased_amount",
                  "type": 4,
                  "typeName": "Balance"
                },
                {
                  "name": "total_claimed_amount",
                  "type": 4,
                  "typeName": "Balance"
                },
                {
                  "name": "is_burned",
                  "type": 7,
                  "typeName": "bool"
                },
                {
                  "name": "is_withdrawn",
                  "type": 7,
                  "typeName": "bool"
                }
              ]
            }
          },
          "path": [
            "inkwhale_project",
            "impls",
            "launchpad_contract",
            "data",
            "WhitelistSaleInfo"
          ]
        }
      },
      {
        "id": 32,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 33
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 33
            },
            {
              "name": "E",
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 33,
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
        "id": 34,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 35
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 35
            },
            {
              "name": "E",
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 35,
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
                      "type": 36
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
              "type": 36
            }
          ],
          "path": [
            "Option"
          ]
        }
      },
      {
        "id": 36,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "name": "is_active",
                  "type": 7,
                  "typeName": "bool"
                },
                {
                  "name": "name",
                  "type": 3,
                  "typeName": "String"
                },
                {
                  "name": "start_time",
                  "type": 6,
                  "typeName": "u64"
                },
                {
                  "name": "end_time",
                  "type": 6,
                  "typeName": "u64"
                },
                {
                  "name": "immediate_release_rate",
                  "type": 5,
                  "typeName": "u32"
                },
                {
                  "name": "vesting_duration",
                  "type": 6,
                  "typeName": "u64"
                },
                {
                  "name": "end_vesting_time",
                  "type": 6,
                  "typeName": "u64"
                },
                {
                  "name": "vesting_unit",
                  "type": 6,
                  "typeName": "u64"
                },
                {
                  "name": "total_vesting_units",
                  "type": 6,
                  "typeName": "u64"
                }
              ]
            }
          },
          "path": [
            "inkwhale_project",
            "impls",
            "launchpad_contract",
            "data",
            "PhaseInfo"
          ]
        }
      },
      {
        "id": 37,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 38
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 38
            },
            {
              "name": "E",
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 38,
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
                      "type": 39
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
              "type": 39
            }
          ],
          "path": [
            "Option"
          ]
        }
      },
      {
        "id": 39,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "name": "is_public",
                  "type": 7,
                  "typeName": "bool"
                },
                {
                  "name": "total_amount",
                  "type": 4,
                  "typeName": "Balance"
                },
                {
                  "name": "price",
                  "type": 4,
                  "typeName": "Balance"
                },
                {
                  "name": "total_purchased_amount",
                  "type": 4,
                  "typeName": "Balance"
                },
                {
                  "name": "total_claimed_amount",
                  "type": 4,
                  "typeName": "Balance"
                },
                {
                  "name": "is_burned",
                  "type": 7,
                  "typeName": "bool"
                },
                {
                  "name": "is_withdrawn",
                  "type": 7,
                  "typeName": "bool"
                }
              ]
            }
          },
          "path": [
            "inkwhale_project",
            "impls",
            "launchpad_contract",
            "data",
            "PublicSaleInfo"
          ]
        }
      },
      {
        "id": 40,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 41
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 41
            },
            {
              "name": "E",
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 41,
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
        "id": 42,
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
                      "type": 21
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
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 43,
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
                      "type": 21
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
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 44,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 45
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 45
            },
            {
              "name": "E",
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 45,
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
        "id": 46,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 47
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 47
            },
            {
              "name": "E",
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 47,
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
                      "type": 48
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
              "type": 48
            }
          ],
          "path": [
            "Option"
          ]
        }
      },
      {
        "id": 48,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "name": "purchased_amount",
                  "type": 4,
                  "typeName": "Balance"
                },
                {
                  "name": "vesting_amount",
                  "type": 4,
                  "typeName": "Balance"
                },
                {
                  "name": "claimed_amount",
                  "type": 4,
                  "typeName": "Balance"
                },
                {
                  "name": "last_updated_time",
                  "type": 6,
                  "typeName": "u64"
                }
              ]
            }
          },
          "path": [
            "inkwhale_project",
            "impls",
            "launchpad_contract",
            "data",
            "BuyerInformation"
          ]
        }
      },
      {
        "id": 49,
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
                      "type": 21
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
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 50,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 51
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 51
            },
            {
              "name": "E",
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 51,
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
              "type": 4
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
        "id": 52,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 53
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 53
            },
            {
              "name": "E",
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 53,
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
                      "type": 54
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
              "type": 54
            }
          ],
          "path": [
            "Option"
          ]
        }
      },
      {
        "id": 54,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "name": "amount",
                  "type": 4,
                  "typeName": "Balance"
                },
                {
                  "name": "price",
                  "type": 4,
                  "typeName": "Balance"
                },
                {
                  "name": "purchased_amount",
                  "type": 4,
                  "typeName": "Balance"
                },
                {
                  "name": "vesting_amount",
                  "type": 4,
                  "typeName": "Balance"
                },
                {
                  "name": "claimed_amount",
                  "type": 4,
                  "typeName": "Balance"
                },
                {
                  "name": "last_updated_time",
                  "type": 6,
                  "typeName": "u64"
                }
              ]
            }
          },
          "path": [
            "inkwhale_project",
            "impls",
            "launchpad_contract",
            "data",
            "WhitelistBuyerInfo"
          ]
        }
      },
      {
        "id": 55,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 56
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 56
            },
            {
              "name": "E",
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 56,
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
                      "type": 7
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
              "type": 7
            }
          ],
          "path": [
            "Option"
          ]
        }
      },
      {
        "id": 57,
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
                      "type": 21
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
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 58,
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
                      "type": 21
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
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 59,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 60
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 60
            },
            {
              "name": "E",
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 60,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 8
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
              "type": 8
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
        "id": 61,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 7
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 7
            },
            {
              "name": "E",
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 62,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 63
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 21
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
              "type": 63
            },
            {
              "name": "E",
              "type": 21
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 63,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 8
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
              "type": 8
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
        "id": 64,
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
        "id": 65,
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

export default launchpad;
