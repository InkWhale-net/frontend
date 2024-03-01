const nft_pool_contract = {
  CONTRACT_ADDRESS: "5F5medrKQHb8Gp1nZAVYtnMqSgj7wW8t8JVh26geTg3QL5RU",
  CONTRACT_ABI: {
    "source": {
      "hash": "0x3a112b5649dc2930d159375a872a19988875ed0a2ae2678e3d80d8249ef33372",
      "language": "ink! 4.0.1",
      "compiler": "rustc 1.70.0-nightly",
      "build_info": {
        "build_mode": "Release",
        "cargo_contract_version": "2.1.0",
        "rust_toolchain": "nightly-x86_64-unknown-linux-gnu",
        "wasm_opt_settings": {
          "keep_debug_symbols": false,
          "optimization_passes": "Z"
        }
      }
    },
    "contract": {
      "name": "my_nft_pool",
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
              "label": "inw_contract",
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
              "label": "max_staking_amount",
              "type": {
                "displayName": [
                  "Balance"
                ],
                "type": 4
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
          "returnType": {
            "displayName": [
              "ink_primitives",
              "ConstructorResult"
            ],
            "type": 10
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
              "label": "pool_contract",
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
              "label": "nft_contract",
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
              "label": "staker",
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
              "label": "token_id",
              "type": {
                "displayName": [
                  "Id"
                ],
                "type": 19
              }
            }
          ],
          "docs": [],
          "label": "NFTPoolStakeEvent"
        },
        {
          "args": [
            {
              "docs": [],
              "indexed": false,
              "label": "pool_contract",
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
              "label": "nft_contract",
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
              "label": "staker",
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
              "label": "token_id",
              "type": {
                "displayName": [
                  "Id"
                ],
                "type": 19
              }
            }
          ],
          "docs": [],
          "label": "NFTPoolUnstakeEvent"
        },
        {
          "args": [
            {
              "docs": [],
              "indexed": false,
              "label": "pool_contract",
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
              "label": "staker",
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
          "label": "NFTPoolClaimEvent"
        }
      ],
      "lang_error": {
        "displayName": [
          "ink",
          "LangError"
        ],
        "type": 18
      },
      "messages": [
        {
          "args": [
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
              "label": "max_staking_amount",
              "type": {
                "displayName": [
                  "Balance"
                ],
                "type": 4
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
          "label": "initialize",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 10
          },
          "selector": "0xf2f6dba3"
        },
        {
          "args": [
            {
              "label": "token_id",
              "type": {
                "displayName": [
                  "Id"
                ],
                "type": 19
              }
            }
          ],
          "docs": [],
          "label": "stake",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 10
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
                "type": 19
              }
            }
          ],
          "docs": [],
          "label": "unstake",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 10
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
              "ink",
              "MessageResult"
            ],
            "type": 10
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
              "ink",
              "MessageResult"
            ],
            "type": 20
          },
          "selector": "0x82c1595f"
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
              "ink",
              "MessageResult"
            ],
            "type": 21
          },
          "selector": "0x11f43efd"
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
            "type": 20
          },
          "selector": "0x4fa43c8c"
        },
        {
          "args": [],
          "docs": [],
          "label": "GenericPoolContractTrait::duration",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 23
          },
          "selector": "0xec96d641"
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
              "ink",
              "MessageResult"
            ],
            "type": 24
          },
          "selector": "0x7d91f5c8"
        },
        {
          "args": [],
          "docs": [],
          "label": "GenericPoolContractTrait::inw_contract",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 20
          },
          "selector": "0xf96ce121"
        },
        {
          "args": [],
          "docs": [],
          "label": "GenericPoolContractTrait::multiplier",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 27
          },
          "selector": "0xfb1ecf6a"
        },
        {
          "args": [],
          "docs": [],
          "label": "GenericPoolContractTrait::unstake_fee",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 27
          },
          "selector": "0xc74b547f"
        },
        {
          "args": [],
          "docs": [],
          "label": "GenericPoolContractTrait::max_staking_amount",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 27
          },
          "selector": "0x11fd5b2b"
        },
        {
          "args": [],
          "docs": [],
          "label": "GenericPoolContractTrait::staking_contract_address",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 20
          },
          "selector": "0xb22a7a83"
        },
        {
          "args": [],
          "docs": [],
          "label": "GenericPoolContractTrait::is_topup_enough_reward",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 28
          },
          "selector": "0x7663de4d"
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
              "ink",
              "MessageResult"
            ],
            "type": 10
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
              "ink",
              "MessageResult"
            ],
            "type": 10
          },
          "selector": "0x7be928b9"
        },
        {
          "args": [],
          "docs": [],
          "label": "GenericPoolContractTrait::total_unclaimed_reward",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 27
          },
          "selector": "0x16231caf"
        },
        {
          "args": [],
          "docs": [],
          "label": "GenericPoolContractTrait::min_reward_amount",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 27
          },
          "selector": "0x57057db9"
        },
        {
          "args": [],
          "docs": [],
          "label": "GenericPoolContractTrait::start_time",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 23
          },
          "selector": "0xc48cf63e"
        },
        {
          "args": [
            {
              "label": "inw_contract",
              "type": {
                "displayName": [
                  "genericpoolcontracttrait_external",
                  "SetInwContractInput1"
                ],
                "type": 0
              }
            }
          ],
          "docs": [],
          "label": "GenericPoolContractTrait::set_inw_contract",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 10
          },
          "selector": "0xb89c001e"
        },
        {
          "args": [],
          "docs": [],
          "label": "GenericPoolContractTrait::reward_pool",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 27
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
              "ink",
              "MessageResult"
            ],
            "type": 27
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
              "ink",
              "MessageResult"
            ],
            "type": 20
          },
          "selector": "0x0da3be06"
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
                "type": 5
              }
            }
          ],
          "docs": [],
          "label": "NftStakingListTrait::get_staked_id",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "ink",
              "MessageResult"
            ],
            "type": 29
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
              "ink",
              "MessageResult"
            ],
            "type": 23
          },
          "selector": "0x2a30e9be"
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
            "type": 10
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
                            "ty": 0
                          }
                        },
                        "name": "staking_contract_address"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 0
                          }
                        },
                        "name": "psp22_contract_address"
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
                            "ty": 4
                          }
                        },
                        "name": "multiplier"
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
                                        "key": "0xf508dbf5",
                                        "ty": 5
                                      }
                                    },
                                    "name": "last_reward_update"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0xf508dbf5",
                                        "ty": 4
                                      }
                                    },
                                    "name": "staked_value"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0xf508dbf5",
                                        "ty": 4
                                      }
                                    },
                                    "name": "unclaimed_reward"
                                  },
                                  {
                                    "layout": {
                                      "leaf": {
                                        "key": "0xf508dbf5",
                                        "ty": 4
                                      }
                                    },
                                    "name": "future_reward"
                                  }
                                ],
                                "name": "StakeInformation"
                              }
                            },
                            "root_key": "0xf508dbf5"
                          }
                        },
                        "name": "stakers"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 6
                          }
                        },
                        "name": "is_topup_enough_reward"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 4
                          }
                        },
                        "name": "reward_pool"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 4
                          }
                        },
                        "name": "total_unclaimed_reward"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 4
                          }
                        },
                        "name": "max_staking_amount"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 4
                          }
                        },
                        "name": "min_reward_amount"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 4
                          }
                        },
                        "name": "total_staked"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 5
                          }
                        },
                        "name": "duration"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 5
                          }
                        },
                        "name": "start_time"
                      },
                      {
                        "layout": {
                          "leaf": {
                            "key": "0x00000000",
                            "ty": 4
                          }
                        },
                        "name": "unstake_fee"
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
                          "root": {
                            "layout": {
                              "enum": {
                                "dispatchKey": "0x28ae5fc3",
                                "name": "Id",
                                "variants": {
                                  "0": {
                                    "fields": [
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x28ae5fc3",
                                            "ty": 2
                                          }
                                        },
                                        "name": "0"
                                      }
                                    ],
                                    "name": "U8"
                                  },
                                  "1": {
                                    "fields": [
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x28ae5fc3",
                                            "ty": 7
                                          }
                                        },
                                        "name": "0"
                                      }
                                    ],
                                    "name": "U16"
                                  },
                                  "2": {
                                    "fields": [
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x28ae5fc3",
                                            "ty": 8
                                          }
                                        },
                                        "name": "0"
                                      }
                                    ],
                                    "name": "U32"
                                  },
                                  "3": {
                                    "fields": [
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x28ae5fc3",
                                            "ty": 5
                                          }
                                        },
                                        "name": "0"
                                      }
                                    ],
                                    "name": "U64"
                                  },
                                  "4": {
                                    "fields": [
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x28ae5fc3",
                                            "ty": 4
                                          }
                                        },
                                        "name": "0"
                                      }
                                    ],
                                    "name": "U128"
                                  },
                                  "5": {
                                    "fields": [
                                      {
                                        "layout": {
                                          "leaf": {
                                            "key": "0x28ae5fc3",
                                            "ty": 9
                                          }
                                        },
                                        "name": "0"
                                      }
                                    ],
                                    "name": "Bytes"
                                  }
                                }
                              }
                            },
                            "root_key": "0x28ae5fc3"
                          }
                        },
                        "name": "staking_list"
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
                "name": "staking_list_data"
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
              }
            ],
            "name": "MyNFTPool"
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
            "primitive": "u128"
          }
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
            "primitive": "bool"
          }
        }
      },
      {
        "id": 7,
        "type": {
          "def": {
            "primitive": "u16"
          }
        }
      },
      {
        "id": 8,
        "type": {
          "def": {
            "primitive": "u32"
          }
        }
      },
      {
        "id": 9,
        "type": {
          "def": {
            "sequence": {
              "type": 2
            }
          }
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
                      "type": 11
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
              "type": 11
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
                      "typeName": "OwnableError"
                    }
                  ],
                  "index": 1,
                  "name": "OwnableError"
                },
                {
                  "fields": [
                    {
                      "type": 15,
                      "typeName": "AccessControlError"
                    }
                  ],
                  "index": 2,
                  "name": "AccessControlError"
                },
                {
                  "fields": [
                    {
                      "type": 16,
                      "typeName": "PSP22Error"
                    }
                  ],
                  "index": 3,
                  "name": "PSP22Error"
                },
                {
                  "fields": [
                    {
                      "type": 17,
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
        "id": 13,
        "type": {
          "def": {
            "primitive": "str"
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
        "id": 15,
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
        "id": 16,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 9,
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
                      "type": 9,
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
        "id": 17,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 9,
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
                      "type": 9,
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
        "id": 18,
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
        "id": 19,
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
                      "type": 7,
                      "typeName": "u16"
                    }
                  ],
                  "index": 1,
                  "name": "U16"
                },
                {
                  "fields": [
                    {
                      "type": 8,
                      "typeName": "u32"
                    }
                  ],
                  "index": 2,
                  "name": "U32"
                },
                {
                  "fields": [
                    {
                      "type": 5,
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
                      "type": 9,
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
        "id": 20,
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
              "type": 0
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
        "id": 21,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 22
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
              "type": 22
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
        "id": 22,
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
              "type": 3
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
              "type": 5
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
        "id": 24,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 25
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
              "type": 25
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
        "id": 25,
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
                      "type": 26
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
              "type": 26
            }
          ],
          "path": [
            "Option"
          ]
        }
      },
      {
        "id": 26,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "name": "last_reward_update",
                  "type": 5,
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
                },
                {
                  "name": "future_reward",
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
        "id": 27,
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
              "type": 4
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
              "type": 6
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
              "type": 30
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
                      "type": 19
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
              "type": 19
            }
          ],
          "path": [
            "Option"
          ]
        }
      }
    ],
    "version": "4"
  },
};

export default nft_pool_contract;