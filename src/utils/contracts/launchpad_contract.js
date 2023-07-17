const launchpad_generator = {
    CONTRACT_ADDRESS: "5Do8ukWfsHW5krbFqLFjvLZmTUdCswqis8BggHH7g1YV4S4F",
    CONTRACT_ABI: {
        "source": {
          "hash": "0x4c62e7a19cffbed4d18106d20128f097d204f9ec79f6aa662d7ae37e7e21c275",
          "language": "ink! 4.1.0",
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
                    "type": 4
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
                    "type": 5
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
                    "type": 6
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
                    "type": 5
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
                    "type": 5
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
                    "type": 5
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
                    "type": 5
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
            "type": 22
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
                    "type": 4
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
                    "type": 5
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
                    "type": 6
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
                    "type": 4
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
                  "label": "end_time",
                  "type": {
                    "displayName": [
                      "u64"
                    ],
                    "type": 7
                  }
                },
                {
                  "label": "immediate_release_rate",
                  "type": {
                    "displayName": [
                      "u32"
                    ],
                    "type": 6
                  }
                },
                {
                  "label": "vesting_duration",
                  "type": {
                    "displayName": [
                      "u64"
                    ],
                    "type": 7
                  }
                },
                {
                  "label": "vesting_unit",
                  "type": {
                    "displayName": [
                      "u64"
                    ],
                    "type": 7
                  }
                },
                {
                  "label": "is_public",
                  "type": {
                    "displayName": [
                      "bool"
                    ],
                    "type": 8
                  }
                },
                {
                  "label": "public_amount",
                  "type": {
                    "displayName": [
                      "Balance"
                    ],
                    "type": 5
                  }
                },
                {
                  "label": "public_price",
                  "type": {
                    "displayName": [
                      "Balance"
                    ],
                    "type": 5
                  }
                }
              ],
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
                  "ink",
                  "MessageResult"
                ],
                "type": 23
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
                  "ink",
                  "MessageResult"
                ],
                "type": 23
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
                "type": 25
              },
              "selector": "0x4fa43c8c"
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
                    "type": 8
                  }
                },
                {
                  "label": "name",
                  "type": {
                    "displayName": [
                      "launchpadcontracttrait_external",
                      "SetPhaseInput3"
                    ],
                    "type": 4
                  }
                },
                {
                  "label": "start_time",
                  "type": {
                    "displayName": [
                      "launchpadcontracttrait_external",
                      "SetPhaseInput4"
                    ],
                    "type": 7
                  }
                },
                {
                  "label": "end_time",
                  "type": {
                    "displayName": [
                      "launchpadcontracttrait_external",
                      "SetPhaseInput5"
                    ],
                    "type": 7
                  }
                },
                {
                  "label": "immediate_release_rate",
                  "type": {
                    "displayName": [
                      "launchpadcontracttrait_external",
                      "SetPhaseInput6"
                    ],
                    "type": 6
                  }
                },
                {
                  "label": "vesting_duration",
                  "type": {
                    "displayName": [
                      "launchpadcontracttrait_external",
                      "SetPhaseInput7"
                    ],
                    "type": 7
                  }
                },
                {
                  "label": "vesting_unit",
                  "type": {
                    "displayName": [
                      "launchpadcontracttrait_external",
                      "SetPhaseInput8"
                    ],
                    "type": 7
                  }
                },
                {
                  "label": "is_public",
                  "type": {
                    "displayName": [
                      "launchpadcontracttrait_external",
                      "SetPhaseInput9"
                    ],
                    "type": 8
                  }
                },
                {
                  "label": "total_amount",
                  "type": {
                    "displayName": [
                      "launchpadcontracttrait_external",
                      "SetPhaseInput10"
                    ],
                    "type": 5
                  }
                },
                {
                  "label": "price",
                  "type": {
                    "displayName": [
                      "launchpadcontracttrait_external",
                      "SetPhaseInput11"
                    ],
                    "type": 5
                  }
                }
              ],
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
                    "type": 26
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
                      "GetNameInput1"
                    ],
                    "type": 2
                  }
                }
              ],
              "docs": [],
              "label": "LaunchpadContractTrait::get_name",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 27
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
                      "GetPublicSaleInfoInput1"
                    ],
                    "type": 2
                  }
                }
              ],
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
                "type": 29
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
                    "type": 8
                  }
                }
              ],
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
              "docs": [],
              "label": "LaunchpadContractTrait::get_whitelist_sale_total_purchased_amount",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 32
              },
              "selector": "0x2beb629f"
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
                    "type": 4
                  }
                }
              ],
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
                      "PublicClaimInput1"
                    ],
                    "type": 2
                  }
                }
              ],
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
                  "label": "value",
                  "type": {
                    "displayName": [
                      "launchpadcontracttrait_external",
                      "WithdrawInput1"
                    ],
                    "type": 5
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
                  "label": "phase_id",
                  "type": {
                    "displayName": [
                      "launchpadcontracttrait_external",
                      "SetMultiPhasesInput1"
                    ],
                    "type": 20
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
                  "label": "total_supply",
                  "type": {
                    "displayName": [
                      "launchpadcontracttrait_external",
                      "SetTotalSupplyInput1"
                    ],
                    "type": 5
                  }
                }
              ],
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
              "args": [],
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
                "type": 34
              },
              "selector": "0x11652eee"
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
                    "type": 6
                  }
                }
              ],
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
              "args": [],
              "docs": [],
              "label": "LaunchpadContractTrait::get_total_supply",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 35
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
                      "GetImmediateReleaseRateInput1"
                    ],
                    "type": 2
                  }
                }
              ],
              "docs": [],
              "label": "LaunchpadContractTrait::get_immediate_release_rate",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 36
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
                    "type": 7
                  }
                }
              ],
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
              "args": [],
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
                    "type": 7
                  }
                }
              ],
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
              "docs": [],
              "label": "LaunchpadContractTrait::get_public_buyer",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 38
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
                      "GetWhitelistAccountCountInput1"
                    ],
                    "type": 2
                  }
                }
              ],
              "docs": [],
              "label": "LaunchpadContractTrait::get_whitelist_account_count",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 41
              },
              "selector": "0x54208622"
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
              "docs": [],
              "label": "LaunchpadContractTrait::get_public_sale_total_purchased_amount",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 32
              },
              "selector": "0x6bd125b3"
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
              "docs": [],
              "label": "LaunchpadContractTrait::get_vesting_duration",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 42
              },
              "selector": "0x3acd8ddf"
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
              "docs": [],
              "label": "LaunchpadContractTrait::get_public_sale_total_claimed_amount",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 32
              },
              "selector": "0xb3545314"
            },
            {
              "args": [],
              "docs": [],
              "label": "LaunchpadContractTrait::get_token_address",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 25
              },
              "selector": "0xae1a6481"
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
                      "GetWhitelistSaleTotalClaimedAmountInput1"
                    ],
                    "type": 2
                  }
                }
              ],
              "docs": [],
              "label": "LaunchpadContractTrait::get_whitelist_sale_total_claimed_amount",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 32
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
                    "type": 8
                  }
                }
              ],
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
              "docs": [],
              "label": "LaunchpadContractTrait::get_whitelist_buyer",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 44
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
                      "GetWhitelistSaleTotalAmountInput1"
                    ],
                    "type": 2
                  }
                }
              ],
              "docs": [],
              "label": "LaunchpadContractTrait::get_whitelist_sale_total_amount",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 32
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
                    "type": 6
                  }
                }
              ],
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
                      "GetIsActiveInput1"
                    ],
                    "type": 2
                  }
                }
              ],
              "docs": [],
              "label": "LaunchpadContractTrait::get_is_active",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 47
              },
              "selector": "0x34edecf0"
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
                      "GetWhitelistSaleInfoInput1"
                    ],
                    "type": 2
                  }
                }
              ],
              "docs": [],
              "label": "LaunchpadContractTrait::get_whitelist_sale_info",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 49
              },
              "selector": "0xc8e626b9"
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
                    "type": 7
                  }
                }
              ],
              "docs": [],
              "label": "LaunchpadContractTrait::get_whitelist_account",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 52
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
                    "type": 26
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
                      "GetEndTimeInput1"
                    ],
                    "type": 2
                  }
                }
              ],
              "docs": [],
              "label": "LaunchpadContractTrait::get_end_time",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 42
              },
              "selector": "0x52288dbd"
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
                    "type": 4
                  }
                }
              ],
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
              "docs": [],
              "label": "LaunchpadContractTrait::get_start_time",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 42
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
                    "type": 5
                  }
                }
              ],
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
                    "type": 5
                  }
                }
              ],
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
              "docs": [],
              "label": "LaunchpadContractTrait::get_vesting_unit",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 42
              },
              "selector": "0x8cab2e95"
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
                    "type": 5
                  }
                }
              ],
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
              "args": [],
              "docs": [],
              "label": "LaunchpadContractTrait::get_project_start_time",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 41
              },
              "selector": "0x9395b689"
            },
            {
              "args": [],
              "docs": [],
              "label": "LaunchpadContractTrait::get_available_token_amount",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 35
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
                      "GetPublicSaleTotalAmountInput1"
                    ],
                    "type": 2
                  }
                }
              ],
              "docs": [],
              "label": "LaunchpadContractTrait::get_public_sale_total_amount",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 32
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
                    "type": 5
                  }
                }
              ],
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
              "args": [],
              "docs": [],
              "label": "LaunchpadContractTrait::get_project_end_time",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 41
              },
              "selector": "0xfb0942d5"
            },
            {
              "args": [],
              "docs": [],
              "label": "LaunchpadContractTrait::get_total_phase",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 54
              },
              "selector": "0xe6a1c0c4"
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
              "docs": [],
              "label": "LaunchpadContractTrait::get_phase",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 55
              },
              "selector": "0x60b655b0"
            },
            {
              "args": [],
              "docs": [],
              "label": "LaunchpadContractTrait::get_generator_contract",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 25
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
                    "type": 5
                  }
                }
              ],
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
                      "GetPublicSalePriceInput1"
                    ],
                    "type": 2
                  }
                }
              ],
              "docs": [],
              "label": "LaunchpadContractTrait::get_public_sale_price",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 32
              },
              "selector": "0xa8604763"
            },
            {
              "args": [],
              "docs": [],
              "label": "LaunchpadContractTrait::get_balance",
              "mutates": true,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 58
              },
              "selector": "0xc209eacc"
            },
            {
              "args": [],
              "docs": [],
              "label": "LaunchpadContractTrait::get_tx_rate",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 60
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
                    "type": 7
                  }
                },
                {
                  "label": "end_time",
                  "type": {
                    "displayName": [
                      "launchpadcontracttrait_external",
                      "SetStartAndEndTimeInput3"
                    ],
                    "type": 7
                  }
                }
              ],
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
                      "HasRoleInput1"
                    ],
                    "type": 6
                  }
                },
                {
                  "label": "address",
                  "type": {
                    "displayName": [
                      "accesscontrol_external",
                      "HasRoleInput2"
                    ],
                    "type": 0
                  }
                }
              ],
              "docs": [
                " Returns `true` if `account` has been granted `role`."
              ],
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
                    "type": 6
                  }
                },
                {
                  "label": "account",
                  "type": {
                    "displayName": [
                      "accesscontrol_external",
                      "RevokeRoleInput2"
                    ],
                    "type": 0
                  }
                }
              ],
              "docs": [
                " Revokes `role` from `account`.",
                "",
                " On success a `RoleRevoked` event is emitted.",
                "",
                " # Errors",
                "",
                " Returns with `MissingRole` error if caller can't grant the `role` or if `account` doesn't have `role`."
              ],
              "label": "AccessControl::revoke_role",
              "mutates": true,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 62
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
                    "type": 6
                  }
                },
                {
                  "label": "account",
                  "type": {
                    "displayName": [
                      "accesscontrol_external",
                      "RenounceRoleInput2"
                    ],
                    "type": 0
                  }
                }
              ],
              "docs": [
                " Revokes `role` from the calling account.",
                " Roles are often managed via `grant_role` and `revoke_role`: this function's",
                " purpose is to provide a mechanism for accounts to lose their privileges",
                " if they are compromised (such as when a trusted device is misplaced).",
                "",
                " On success a `RoleRevoked` event is emitted.",
                "",
                " # Errors",
                "",
                " Returns with `InvalidCaller` error if caller is not `account`.",
                " Returns with `MissingRole` error if `account` doesn't have `role`."
              ],
              "label": "AccessControl::renounce_role",
              "mutates": true,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 62
              },
              "selector": "0xeaf1248a"
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
                    "type": 6
                  }
                }
              ],
              "docs": [
                " Returns the admin role that controls `role`. See `grant_role` and `revoke_role`."
              ],
              "label": "AccessControl::get_role_admin",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 60
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
                      "GrantRoleInput1"
                    ],
                    "type": 6
                  }
                },
                {
                  "label": "account",
                  "type": {
                    "displayName": [
                      "accesscontrol_external",
                      "GrantRoleInput2"
                    ],
                    "type": 0
                  }
                }
              ],
              "docs": [
                " Grants `role` to `account`.",
                "",
                " On success a `RoleGranted` event is emitted.",
                "",
                " # Errors",
                "",
                " Returns with `MissingRole` error if caller can't grant the role.",
                " Returns with `RoleRedundant` error `account` has `role`."
              ],
              "label": "AccessControl::grant_role",
              "mutates": true,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 62
              },
              "selector": "0x4ac062fd"
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
                    "type": 6
                  }
                }
              ],
              "docs": [
                " Returns the number of accounts that have `role`.",
                " Can be used together with {get_role_member} to enumerate",
                " all bearers of a role."
              ],
              "label": "AccessControlEnumerable::get_role_member_count",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 60
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
                    "type": 6
                  }
                },
                {
                  "label": "index",
                  "type": {
                    "displayName": [
                      "accesscontrolenumerable_external",
                      "GetRoleMemberInput2"
                    ],
                    "type": 6
                  }
                }
              ],
              "docs": [
                " Returns one of the accounts that have `role`.",
                "",
                " Role bearers are not sorted in any particular way, and their",
                " ordering may change at any point."
              ],
              "label": "AccessControlEnumerable::get_role_member",
              "mutates": false,
              "payable": false,
              "returnType": {
                "displayName": [
                  "ink",
                  "MessageResult"
                ],
                "type": 52
              },
              "selector": "0x163469e0"
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
                                            "ty": 3
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
                              "leaf": {
                                "key": "0x00000000",
                                "ty": 4
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
                                "ty": 5
                              }
                            },
                            "name": "total_supply"
                          },
                          {
                            "layout": {
                              "leaf": {
                                "key": "0x00000000",
                                "ty": 5
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
                                "ty": 6
                              }
                            },
                            "name": "tx_rate"
                          },
                          {
                            "layout": {
                              "leaf": {
                                "key": "0x00000000",
                                "ty": 7
                              }
                            },
                            "name": "project_start_time"
                          },
                          {
                            "layout": {
                              "leaf": {
                                "key": "0x00000000",
                                "ty": 7
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
                                            "key": "0xd8f85b6e",
                                            "ty": 8
                                          }
                                        },
                                        "name": "is_active"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0xd8f85b6e",
                                            "ty": 4
                                          }
                                        },
                                        "name": "name"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0xd8f85b6e",
                                            "ty": 7
                                          }
                                        },
                                        "name": "start_time"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0xd8f85b6e",
                                            "ty": 7
                                          }
                                        },
                                        "name": "end_time"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0xd8f85b6e",
                                            "ty": 6
                                          }
                                        },
                                        "name": "immediate_release_rate"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0xd8f85b6e",
                                            "ty": 7
                                          }
                                        },
                                        "name": "vesting_duration"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0xd8f85b6e",
                                            "ty": 7
                                          }
                                        },
                                        "name": "end_vesting_time"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0xd8f85b6e",
                                            "ty": 7
                                          }
                                        },
                                        "name": "vesting_unit"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0xd8f85b6e",
                                            "ty": 7
                                          }
                                        },
                                        "name": "total_vesting_units"
                                      }
                                    ],
                                    "name": "PhaseInfo"
                                  }
                                },
                                "root_key": "0xd8f85b6e"
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
                                            "key": "0x003a4ea3",
                                            "ty": 8
                                          }
                                        },
                                        "name": "is_public"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x003a4ea3",
                                            "ty": 5
                                          }
                                        },
                                        "name": "total_amount"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x003a4ea3",
                                            "ty": 5
                                          }
                                        },
                                        "name": "price"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x003a4ea3",
                                            "ty": 5
                                          }
                                        },
                                        "name": "total_purchased_amount"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x003a4ea3",
                                            "ty": 5
                                          }
                                        },
                                        "name": "total_claimed_amount"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x003a4ea3",
                                            "ty": 8
                                          }
                                        },
                                        "name": "is_burned"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x003a4ea3",
                                            "ty": 8
                                          }
                                        },
                                        "name": "is_withdrawn"
                                      }
                                    ],
                                    "name": "PublicSaleInfo"
                                  }
                                },
                                "root_key": "0x003a4ea3"
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
                                            "key": "0x6cc683c9",
                                            "ty": 5
                                          }
                                        },
                                        "name": "purchased_amount"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x6cc683c9",
                                            "ty": 5
                                          }
                                        },
                                        "name": "vesting_amount"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x6cc683c9",
                                            "ty": 5
                                          }
                                        },
                                        "name": "claimed_amount"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x6cc683c9",
                                            "ty": 7
                                          }
                                        },
                                        "name": "last_updated_time"
                                      }
                                    ],
                                    "name": "BuyerInformation"
                                  }
                                },
                                "root_key": "0x6cc683c9"
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
                                            "key": "0x0c150b14",
                                            "ty": 5
                                          }
                                        },
                                        "name": "total_amount"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x0c150b14",
                                            "ty": 5
                                          }
                                        },
                                        "name": "total_purchased_amount"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x0c150b14",
                                            "ty": 5
                                          }
                                        },
                                        "name": "total_claimed_amount"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x0c150b14",
                                            "ty": 8
                                          }
                                        },
                                        "name": "is_burned"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x0c150b14",
                                            "ty": 8
                                          }
                                        },
                                        "name": "is_withdrawn"
                                      }
                                    ],
                                    "name": "WhitelistSaleInfo"
                                  }
                                },
                                "root_key": "0x0c150b14"
                              }
                            },
                            "name": "whitelist_sale_info"
                          },
                          {
                            "layout": {
                              "root": {
                                "layout": {
                                  "leaf": {
                                    "key": "0xe3982563",
                                    "ty": 0
                                  }
                                },
                                "root_key": "0xe3982563"
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
                                            "key": "0x38f51bc3",
                                            "ty": 5
                                          }
                                        },
                                        "name": "amount"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x38f51bc3",
                                            "ty": 5
                                          }
                                        },
                                        "name": "price"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x38f51bc3",
                                            "ty": 5
                                          }
                                        },
                                        "name": "purchased_amount"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x38f51bc3",
                                            "ty": 5
                                          }
                                        },
                                        "name": "vesting_amount"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x38f51bc3",
                                            "ty": 5
                                          }
                                        },
                                        "name": "claimed_amount"
                                      },
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x38f51bc3",
                                            "ty": 7
                                          }
                                        },
                                        "name": "last_updated_time"
                                      }
                                    ],
                                    "name": "WhitelistBuyerInfo"
                                  }
                                },
                                "root_key": "0x38f51bc3"
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
                                            "ty": 3
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
                                            "ty": 3
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
                                    "key": "0x6a2cd2b4",
                                    "ty": 6
                                  }
                                },
                                "root_key": "0x6a2cd2b4"
                              }
                            },
                            "name": "admin_roles"
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
                                            "key": "0x6888e7ba",
                                            "ty": 0
                                          }
                                        },
                                        "root_key": "0x6888e7ba"
                                      }
                                    },
                                    "name": "role_members"
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
                                                    "ty": 3
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
                                "name": "Members"
                              }
                            },
                            "name": "members"
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
                                            "ty": 3
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
                    "name": "access"
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
                "tuple": []
              }
            }
          },
          {
            "id": 4,
            "type": {
              "def": {
                "primitive": "str"
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
                "primitive": "u32"
              }
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
                "primitive": "bool"
              }
            }
          },
          {
            "id": 9,
            "type": {
              "def": {
                "sequence": {
                  "type": 4
                }
              }
            }
          },
          {
            "id": 10,
            "type": {
              "def": {
                "sequence": {
                  "type": 7
                }
              }
            }
          },
          {
            "id": 11,
            "type": {
              "def": {
                "sequence": {
                  "type": 6
                }
              }
            }
          },
          {
            "id": 12,
            "type": {
              "def": {
                "sequence": {
                  "type": 8
                }
              }
            }
          },
          {
            "id": 13,
            "type": {
              "def": {
                "sequence": {
                  "type": 5
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
                  "type": 15
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
            "id": 15,
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
                  "type": 3
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
                          "type": 4,
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
                          "type": 21,
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
                      "name": "InvalidPhaseData"
                    },
                    {
                      "index": 47,
                      "name": "CannotTopupToken"
                    },
                    {
                      "index": 48,
                      "name": "InvalidStartTimeAndEndTime"
                    },
                    {
                      "index": 49,
                      "name": "InvalidPhaseCount"
                    },
                    {
                      "index": 50,
                      "name": "InvalidMaxStakingAmount"
                    },
                    {
                      "index": 51,
                      "name": "InvalidApy"
                    },
                    {
                      "index": 52,
                      "name": "InvalidMultiplier"
                    },
                    {
                      "index": 53,
                      "name": "InvalidWhitelistData"
                    },
                    {
                      "index": 54,
                      "name": "PhaseNotExist"
                    },
                    {
                      "index": 55,
                      "name": "PhaseNotActive"
                    },
                    {
                      "index": 56,
                      "name": "WhitelistBuyerInfoNotExist"
                    },
                    {
                      "index": 57,
                      "name": "WhitelistBuyerInfoExist"
                    },
                    {
                      "index": 58,
                      "name": "WhitelistBuyerPurchased"
                    },
                    {
                      "index": 59,
                      "name": "WhitelistSaleInfoNotExist"
                    },
                    {
                      "index": 60,
                      "name": "WhitelistPhaseAccountNotExist"
                    },
                    {
                      "index": 61,
                      "name": "PublicSaleInfoNotExist"
                    },
                    {
                      "index": 62,
                      "name": "InvalidSetActive"
                    },
                    {
                      "index": 63,
                      "name": "InvalidTotalAmount"
                    },
                    {
                      "index": 64,
                      "name": "CannotTransferTxFee"
                    },
                    {
                      "index": 65,
                      "name": "ActiveLaunchpadStatusNotFound"
                    },
                    {
                      "index": 66,
                      "name": "LaunchpadNotActive"
                    },
                    {
                      "index": 67,
                      "name": "InvalidCaller"
                    },
                    {
                      "index": 68,
                      "name": "NoPhaseActive"
                    },
                    {
                      "index": 69,
                      "name": "InvalidTotalSupply"
                    },
                    {
                      "index": 70,
                      "name": "PhaseNotPublic"
                    },
                    {
                      "index": 71,
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
                          "type": 20,
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
                          "type": 20,
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
                "sequence": {
                  "type": 2
                }
              }
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
                          "type": 20,
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
                          "type": 20,
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
            "id": 22,
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
                  "type": 24
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
            "id": 25,
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
                  "type": 0
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
            "id": 26,
            "type": {
              "def": {
                "sequence": {
                  "type": 0
                }
              }
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
                  "type": 28
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
            "id": 28,
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
                  "type": 30
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
                      "name": "is_public",
                      "type": 8,
                      "typeName": "bool"
                    },
                    {
                      "name": "total_amount",
                      "type": 5,
                      "typeName": "Balance"
                    },
                    {
                      "name": "price",
                      "type": 5,
                      "typeName": "Balance"
                    },
                    {
                      "name": "total_purchased_amount",
                      "type": 5,
                      "typeName": "Balance"
                    },
                    {
                      "name": "total_claimed_amount",
                      "type": 5,
                      "typeName": "Balance"
                    },
                    {
                      "name": "is_burned",
                      "type": 8,
                      "typeName": "bool"
                    },
                    {
                      "name": "is_withdrawn",
                      "type": 8,
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
                  "type": 33
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
            "id": 34,
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
                  "type": 4
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
            "id": 35,
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
                  "type": 5
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
            "id": 36,
            "type": {
              "def": {
                "variant": {
                  "variants": [
                    {
                      "fields": [
                        {
                          "type": 37
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
                  "type": 37
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
            "id": 37,
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
            "id": 38,
            "type": {
              "def": {
                "variant": {
                  "variants": [
                    {
                      "fields": [
                        {
                          "type": 39
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
                  "type": 39
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
            "id": 39,
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
                          "type": 40
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
                  "type": 40
                }
              ],
              "path": [
                "Option"
              ]
            }
          },
          {
            "id": 40,
            "type": {
              "def": {
                "composite": {
                  "fields": [
                    {
                      "name": "purchased_amount",
                      "type": 5,
                      "typeName": "Balance"
                    },
                    {
                      "name": "vesting_amount",
                      "type": 5,
                      "typeName": "Balance"
                    },
                    {
                      "name": "claimed_amount",
                      "type": 5,
                      "typeName": "Balance"
                    },
                    {
                      "name": "last_updated_time",
                      "type": 7,
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
            "id": 41,
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
                  "type": 7
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
            "id": 42,
            "type": {
              "def": {
                "variant": {
                  "variants": [
                    {
                      "fields": [
                        {
                          "type": 43
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
                  "type": 43
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
            "id": 43,
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
                  "type": 45
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
                          "type": 46
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
                  "type": 46
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
                "composite": {
                  "fields": [
                    {
                      "name": "amount",
                      "type": 5,
                      "typeName": "Balance"
                    },
                    {
                      "name": "price",
                      "type": 5,
                      "typeName": "Balance"
                    },
                    {
                      "name": "purchased_amount",
                      "type": 5,
                      "typeName": "Balance"
                    },
                    {
                      "name": "vesting_amount",
                      "type": 5,
                      "typeName": "Balance"
                    },
                    {
                      "name": "claimed_amount",
                      "type": 5,
                      "typeName": "Balance"
                    },
                    {
                      "name": "last_updated_time",
                      "type": 7,
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
            "id": 47,
            "type": {
              "def": {
                "variant": {
                  "variants": [
                    {
                      "fields": [
                        {
                          "type": 48
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
                  "type": 48
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
            "id": 48,
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
                          "type": 8
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
                  "type": 8
                }
              ],
              "path": [
                "Option"
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
                          "type": 50
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
                  "type": 50
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
            "id": 50,
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
                          "type": 51
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
                  "type": 51
                }
              ],
              "path": [
                "Option"
              ]
            }
          },
          {
            "id": 51,
            "type": {
              "def": {
                "composite": {
                  "fields": [
                    {
                      "name": "total_amount",
                      "type": 5,
                      "typeName": "Balance"
                    },
                    {
                      "name": "total_purchased_amount",
                      "type": 5,
                      "typeName": "Balance"
                    },
                    {
                      "name": "total_claimed_amount",
                      "type": 5,
                      "typeName": "Balance"
                    },
                    {
                      "name": "is_burned",
                      "type": 8,
                      "typeName": "bool"
                    },
                    {
                      "name": "is_withdrawn",
                      "type": 8,
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
                  "type": 53
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
            "id": 54,
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
                  "type": 2
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
                  "type": 56
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
                          "type": 57
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
                  "type": 57
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
                "composite": {
                  "fields": [
                    {
                      "name": "is_active",
                      "type": 8,
                      "typeName": "bool"
                    },
                    {
                      "name": "name",
                      "type": 4,
                      "typeName": "String"
                    },
                    {
                      "name": "start_time",
                      "type": 7,
                      "typeName": "u64"
                    },
                    {
                      "name": "end_time",
                      "type": 7,
                      "typeName": "u64"
                    },
                    {
                      "name": "immediate_release_rate",
                      "type": 6,
                      "typeName": "u32"
                    },
                    {
                      "name": "vesting_duration",
                      "type": 7,
                      "typeName": "u64"
                    },
                    {
                      "name": "end_vesting_time",
                      "type": 7,
                      "typeName": "u64"
                    },
                    {
                      "name": "vesting_unit",
                      "type": 7,
                      "typeName": "u64"
                    },
                    {
                      "name": "total_vesting_units",
                      "type": 7,
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
            "id": 58,
            "type": {
              "def": {
                "variant": {
                  "variants": [
                    {
                      "fields": [
                        {
                          "type": 59
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
                  "type": 59
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
            "id": 59,
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
                  "type": 5
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
            "id": 60,
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
                  "type": 6
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
            "id": 61,
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
                  "type": 8
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
                  "type": 63
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
            "id": 63,
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
          }
        ],
        "version": "4"
      }
  };
  
  export default launchpad_generator;