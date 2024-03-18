const azero_manager_bridge = {
    CONTRACT_ADDRESS: "5CudmELFbxoRKAeiY2GivG3avjZatA6prhKudmYyBxdQkTf6",
    CONTRACT_ABI: {
      "source": {
        "hash": "0xfc712d36075bf4798aef5d2afcd533a698a954afdc51245a8d8fe2ad8123b51c",
        "language": "ink! 4.3.0",
        "compiler": "rustc 1.70.0-nightly",
        "build_info": {
          "build_mode": "Debug",
          "cargo_contract_version": "2.1.0",
          "rust_toolchain": "nightly-x86_64-unknown-linux-gnu",
          "wasm_opt_settings": {
            "keep_debug_symbols": false,
            "optimization_passes": "Z"
          }
        }
      },
      "contract": {
        "name": "azero_manager",
        "version": "1.0.0",
        "authors": [
          "Inkwhale <admin@inkwhale.net>"
        ]
      },
      "spec": {
        "constructors": [
          {
            "args": [
              {
                "label": "bridge_token_contract_address",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 3
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
              "type": 6
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
            "type": 3
          },
          "balance": {
            "displayName": [
              "Balance"
            ],
            "type": 2
          },
          "blockNumber": {
            "displayName": [
              "BlockNumber"
            ],
            "type": 0
          },
          "chainExtension": {
            "displayName": [
              "ChainExtension"
            ],
            "type": 34
          },
          "hash": {
            "displayName": [
              "Hash"
            ],
            "type": 33
          },
          "maxEventTopics": 4,
          "timestamp": {
            "displayName": [
              "Timestamp"
            ],
            "type": 16
          }
        },
        "events": [
          {
            "args": [
              {
                "docs": [],
                "indexed": false,
                "label": "transaction_id",
                "type": {
                  "displayName": [
                    "u128"
                  ],
                  "type": 2
                }
              },
              {
                "docs": [],
                "indexed": false,
                "label": "trader",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 3
                }
              },
              {
                "docs": [],
                "indexed": false,
                "label": "trading_amount",
                "type": {
                  "displayName": [
                    "Balance"
                  ],
                  "type": 2
                }
              },
              {
                "docs": [],
                "indexed": false,
                "label": "receiver",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 3
                }
              }
            ],
            "docs": [],
            "label": "CreateNewTransaction"
          }
        ],
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
                "label": "amount",
                "type": {
                  "displayName": [
                    "Balance"
                  ],
                  "type": 2
                }
              },
              {
                "label": "receiver",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 3
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "create_new_transaction",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 8
            },
            "selector": "0x039581ba"
          },
          {
            "args": [
              {
                "label": "trader",
                "type": {
                  "displayName": [
                    "azeromanager_external",
                    "CountCompletedTransactionsByTraderInput1"
                  ],
                  "type": 3
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "AzeroManager::count_completed_transactions_by_trader",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 18
            },
            "selector": "0x8fc90ad5"
          },
          {
            "args": [
              {
                "label": "trader",
                "type": {
                  "displayName": [
                    "azeromanager_external",
                    "GetBalanceOfTraderInput1"
                  ],
                  "type": 3
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "AzeroManager::get_balance_of_trader",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 19
            },
            "selector": "0x592b2e1f"
          },
          {
            "args": [],
            "default": false,
            "docs": [],
            "label": "AzeroManager::get_transaction_last_id",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 21
            },
            "selector": "0x7fe7ac78"
          },
          {
            "args": [],
            "default": false,
            "docs": [],
            "label": "AzeroManager::get_bridge_token_contract_address",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 22
            },
            "selector": "0x8b409aa1"
          },
          {
            "args": [
              {
                "label": "trader",
                "type": {
                  "displayName": [
                    "azeromanager_external",
                    "GetProcessingTransactionByTraderInput1"
                  ],
                  "type": 3
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "AzeroManager::get_processing_transaction_by_trader",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 19
            },
            "selector": "0x9ebd3705"
          },
          {
            "args": [],
            "default": false,
            "docs": [],
            "label": "AzeroManager::get_last_transaction_id",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 21
            },
            "selector": "0xe820d97e"
          },
          {
            "args": [
              {
                "label": "trader",
                "type": {
                  "displayName": [
                    "azeromanager_external",
                    "GetPendingTransactionsByTraderAndIndexInput1"
                  ],
                  "type": 3
                }
              },
              {
                "label": "index",
                "type": {
                  "displayName": [
                    "azeromanager_external",
                    "GetPendingTransactionsByTraderAndIndexInput2"
                  ],
                  "type": 16
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "AzeroManager::get_pending_transactions_by_trader_and_index",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 19
            },
            "selector": "0xcab093ec"
          },
          {
            "args": [
              {
                "label": "transaction_id",
                "type": {
                  "displayName": [
                    "azeromanager_external",
                    "GetTransactionInformationByIdInput1"
                  ],
                  "type": 2
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "AzeroManager::get_transaction_information_by_id",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 23
            },
            "selector": "0x18cd5f5f"
          },
          {
            "args": [
              {
                "label": "trader",
                "type": {
                  "displayName": [
                    "azeromanager_external",
                    "CountPendingTransactionsByTraderInput1"
                  ],
                  "type": 3
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "AzeroManager::count_pending_transactions_by_trader",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 18
            },
            "selector": "0xa098f740"
          },
          {
            "args": [
              {
                "label": "transaction_id",
                "type": {
                  "displayName": [
                    "azeromanager_external",
                    "ProcessTransactionInput1"
                  ],
                  "type": 2
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "AzeroManager::process_transaction",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 8
            },
            "selector": "0x9d498dc5"
          },
          {
            "args": [
              {
                "label": "transaction_id",
                "type": {
                  "displayName": [
                    "azeromanager_external",
                    "CompleteTransactionInput1"
                  ],
                  "type": 2
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "AzeroManager::complete_transaction",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 8
            },
            "selector": "0xab4f97d4"
          },
          {
            "args": [
              {
                "label": "contract_address",
                "type": {
                  "displayName": [
                    "azeromanager_external",
                    "UpdateBridgeTokenContractAddressInput1"
                  ],
                  "type": 3
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "AzeroManager::update_bridge_token_contract_address",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 8
            },
            "selector": "0x158cbf84"
          },
          {
            "args": [
              {
                "label": "trader",
                "type": {
                  "displayName": [
                    "azeromanager_external",
                    "GetCompletedTransactionsByTraderAndIndexInput1"
                  ],
                  "type": 3
                }
              },
              {
                "label": "index",
                "type": {
                  "displayName": [
                    "azeromanager_external",
                    "GetCompletedTransactionsByTraderAndIndexInput2"
                  ],
                  "type": 16
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "AzeroManager::get_completed_transactions_by_trader_and_index",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 19
            },
            "selector": "0xd19bf733"
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
                  "type": 0
                }
              },
              {
                "label": "account",
                "type": {
                  "displayName": [
                    "accesscontrol_external",
                    "GrantRoleInput2"
                  ],
                  "type": 27
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
              "type": 28
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
                    "HasRoleInput1"
                  ],
                  "type": 0
                }
              },
              {
                "label": "address",
                "type": {
                  "displayName": [
                    "accesscontrol_external",
                    "HasRoleInput2"
                  ],
                  "type": 27
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
              "type": 30
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
                    "GetRoleAdminInput1"
                  ],
                  "type": 0
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
              "type": 32
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
                    "RevokeRoleInput1"
                  ],
                  "type": 0
                }
              },
              {
                "label": "account",
                "type": {
                  "displayName": [
                    "accesscontrol_external",
                    "RevokeRoleInput2"
                  ],
                  "type": 27
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
              "type": 28
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
                  "type": 0
                }
              },
              {
                "label": "account",
                "type": {
                  "displayName": [
                    "accesscontrol_external",
                    "RenounceRoleInput2"
                  ],
                  "type": 27
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
              "type": 28
            },
            "selector": "0xeaf1248a"
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
                                "leaf": {
                                  "key": "0x1f2cf4ac",
                                  "ty": 0
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
                                  "ty": 1
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
                                  "key": "0xb9c87fa3",
                                  "ty": 2
                                }
                              },
                              "root_key": "0xb9c87fa3"
                            }
                          },
                          "name": "traders"
                        },
                        {
                          "layout": {
                            "root": {
                              "layout": {
                                "struct": {
                                  "fields": [
                                    {
                                      "layout": {
                                        "enum": {
                                          "dispatchKey": "0x4785794f",
                                          "name": "TransactionStatus",
                                          "variants": {
                                            "0": {
                                              "fields": [],
                                              "name": "Pending"
                                            },
                                            "1": {
                                              "fields": [],
                                              "name": "Processing"
                                            },
                                            "2": {
                                              "fields": [],
                                              "name": "Completed"
                                            },
                                            "3": {
                                              "fields": [],
                                              "name": "Canceled"
                                            }
                                          }
                                        }
                                      },
                                      "name": "status"
                                    },
                                    {
                                      "layout": {
                                        "leaf": {
                                          "key": "0x4785794f",
                                          "ty": 3
                                        }
                                      },
                                      "name": "trader"
                                    },
                                    {
                                      "layout": {
                                        "leaf": {
                                          "key": "0x4785794f",
                                          "ty": 2
                                        }
                                      },
                                      "name": "amount"
                                    },
                                    {
                                      "layout": {
                                        "leaf": {
                                          "key": "0x4785794f",
                                          "ty": 3
                                        }
                                      },
                                      "name": "receiver"
                                    }
                                  ],
                                  "name": "TransactionInformation"
                                }
                              },
                              "root_key": "0x4785794f"
                            }
                          },
                          "name": "transactions"
                        },
                        {
                          "layout": {
                            "leaf": {
                              "key": "0x00000000",
                              "ty": 2
                            }
                          },
                          "name": "transaction_id"
                        },
                        {
                          "layout": {
                            "root": {
                              "layout": {
                                "leaf": {
                                  "key": "0x4db1597e",
                                  "ty": 2
                                }
                              },
                              "root_key": "0x4db1597e"
                            }
                          },
                          "name": "pending_transactions_by_trader"
                        },
                        {
                          "layout": {
                            "root": {
                              "layout": {
                                "leaf": {
                                  "key": "0xbd1afc8f",
                                  "ty": 2
                                }
                              },
                              "root_key": "0xbd1afc8f"
                            }
                          },
                          "name": "processing_transaction_by_trader"
                        },
                        {
                          "layout": {
                            "root": {
                              "layout": {
                                "leaf": {
                                  "key": "0x37b9323a",
                                  "ty": 2
                                }
                              },
                              "root_key": "0x37b9323a"
                            }
                          },
                          "name": "completed_transactions_by_trader"
                        },
                        {
                          "layout": {
                            "leaf": {
                              "key": "0x00000000",
                              "ty": 3
                            }
                          },
                          "name": "bridge_token_contract_address"
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
                  "name": "azero_manager_data"
                }
              ],
              "name": "AzeroManagerContract"
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
              "primitive": "u32"
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
              "primitive": "u128"
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
                    "type": 4,
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
          "id": 4,
          "type": {
            "def": {
              "array": {
                "len": 32,
                "type": 5
              }
            }
          }
        },
        {
          "id": 5,
          "type": {
            "def": {
              "primitive": "u8"
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
                        "type": 11,
                        "typeName": "String"
                      }
                    ],
                    "index": 0,
                    "name": "Custom"
                  },
                  {
                    "index": 1,
                    "name": "OnlyOwner"
                  },
                  {
                    "index": 2,
                    "name": "OnlyAdmin"
                  },
                  {
                    "index": 3,
                    "name": "InvalidCaller"
                  },
                  {
                    "index": 4,
                    "name": "InvalidFee"
                  },
                  {
                    "index": 5,
                    "name": "TokenOwnerNotMatch"
                  },
                  {
                    "index": 6,
                    "name": "NotApproved"
                  },
                  {
                    "index": 7,
                    "name": "CannotTransfer"
                  },
                  {
                    "index": 8,
                    "name": "CannotMint"
                  },
                  {
                    "index": 9,
                    "name": "NotPublicMint"
                  },
                  {
                    "index": 10,
                    "name": "NotEnoughBalance"
                  },
                  {
                    "index": 11,
                    "name": "MaxSupply"
                  },
                  {
                    "index": 12,
                    "name": "AlreadyInit"
                  },
                  {
                    "index": 13,
                    "name": "NotOwner"
                  },
                  {
                    "index": 14,
                    "name": "NotTokenOwner"
                  },
                  {
                    "index": 15,
                    "name": "ProjectNotExist"
                  },
                  {
                    "index": 16,
                    "name": "ProjectOwnerAndAdmin"
                  },
                  {
                    "index": 17,
                    "name": "InvalidStartTimeAndEndTime"
                  },
                  {
                    "index": 18,
                    "name": "InvalidPhaseCount"
                  },
                  {
                    "index": 19,
                    "name": "CollectionOwnerAndAdmin"
                  },
                  {
                    "index": 20,
                    "name": "CollectionNotActive"
                  },
                  {
                    "index": 21,
                    "name": "CollectionNotExist"
                  },
                  {
                    "index": 22,
                    "name": "InvalidInput"
                  },
                  {
                    "index": 23,
                    "name": "InvalidType"
                  },
                  {
                    "index": 24,
                    "name": "ClaimedAll"
                  },
                  {
                    "index": 25,
                    "name": "TokenLimitReached"
                  },
                  {
                    "index": 26,
                    "name": "UpdatePhase"
                  },
                  {
                    "index": 27,
                    "name": "PhaseNotExist"
                  },
                  {
                    "index": 28,
                    "name": "PhaseExpired"
                  },
                  {
                    "index": 29,
                    "name": "PhaseDeactivate"
                  },
                  {
                    "index": 30,
                    "name": "WhitelistNotExist"
                  },
                  {
                    "index": 31,
                    "name": "WithdrawFeeError"
                  },
                  {
                    "index": 32,
                    "name": "WithdrawNFTError"
                  },
                  {
                    "index": 33,
                    "name": "WithdrawPSP22Error"
                  },
                  {
                    "index": 34,
                    "name": "NotListed"
                  },
                  {
                    "index": 35,
                    "name": "BidAlreadyExist"
                  },
                  {
                    "index": 36,
                    "name": "BidNotExist"
                  },
                  {
                    "index": 37,
                    "name": "NotInMarket"
                  },
                  {
                    "index": 38,
                    "name": "IsForSale"
                  },
                  {
                    "index": 39,
                    "name": "NotForSale"
                  },
                  {
                    "index": 40,
                    "name": "NotInSaleList"
                  },
                  {
                    "index": 41,
                    "name": "InvalidBidLength"
                  },
                  {
                    "index": 42,
                    "name": "InvalidCollectionOwner"
                  },
                  {
                    "index": 43,
                    "name": "InvalidTime"
                  },
                  {
                    "index": 44,
                    "name": "RewardStarted"
                  },
                  {
                    "index": 45,
                    "name": "RewardNotStarted"
                  },
                  {
                    "index": 46,
                    "name": "RewardNotAdded"
                  },
                  {
                    "index": 47,
                    "name": "ClaimMustBeFalse"
                  },
                  {
                    "index": 48,
                    "name": "HoldAmountBidderNotExist"
                  },
                  {
                    "fields": [
                      {
                        "type": 12,
                        "typeName": "OwnableError"
                      }
                    ],
                    "index": 49,
                    "name": "OwnableError"
                  },
                  {
                    "fields": [
                      {
                        "type": 13,
                        "typeName": "AccessControlError"
                      }
                    ],
                    "index": 50,
                    "name": "AccessControlError"
                  },
                  {
                    "fields": [
                      {
                        "type": 14,
                        "typeName": "PSP22Error"
                      }
                    ],
                    "index": 51,
                    "name": "PSP22Error"
                  },
                  {
                    "fields": [
                      {
                        "type": 17,
                        "typeName": "PSP34Error"
                      }
                    ],
                    "index": 52,
                    "name": "PSP34Error"
                  },
                  {
                    "index": 53,
                    "name": "CheckedOperations"
                  },
                  {
                    "index": 54,
                    "name": "InvalidBalanceAndAllowance"
                  },
                  {
                    "index": 55,
                    "name": "TraderExist"
                  },
                  {
                    "index": 56,
                    "name": "TransactionNotExist"
                  },
                  {
                    "index": 57,
                    "name": "ProcessingTransactionOfTraderExist"
                  },
                  {
                    "index": 58,
                    "name": "TraderNotHavePendingTransaction"
                  },
                  {
                    "index": 59,
                    "name": "NotPendingTransaction"
                  },
                  {
                    "index": 60,
                    "name": "ProcessingTransactionIdNotMatch"
                  },
                  {
                    "index": 61,
                    "name": "TraderNotHaveProcessingTransaction"
                  },
                  {
                    "index": 62,
                    "name": "NotProcessingTransaction"
                  }
                ]
              }
            },
            "path": [
              "bridge_token_project",
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
              "primitive": "str"
            }
          }
        },
        {
          "id": 12,
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
                    "name": "NewOwnerIsNotSet"
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
          "id": 13,
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
          "id": 14,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "fields": [
                      {
                        "type": 11,
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
                    "name": "RecipientIsNotSet"
                  },
                  {
                    "index": 4,
                    "name": "SenderIsNotSet"
                  },
                  {
                    "fields": [
                      {
                        "type": 11,
                        "typeName": "String"
                      }
                    ],
                    "index": 5,
                    "name": "SafeTransferCheckFailed"
                  },
                  {
                    "index": 6,
                    "name": "PermitInvalidSignature"
                  },
                  {
                    "index": 7,
                    "name": "PermitExpired"
                  },
                  {
                    "fields": [
                      {
                        "type": 15,
                        "typeName": "NoncesError"
                      }
                    ],
                    "index": 8,
                    "name": "NoncesError"
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
                        "type": 3,
                        "typeName": "AccountId"
                      },
                      {
                        "type": 16,
                        "typeName": "u64"
                      }
                    ],
                    "index": 0,
                    "name": "InvalidAccountNonce"
                  },
                  {
                    "index": 1,
                    "name": "NonceOverflow"
                  }
                ]
              }
            },
            "path": [
              "openbrush_contracts",
              "traits",
              "errors",
              "nonces",
              "NoncesError"
            ]
          }
        },
        {
          "id": 16,
          "type": {
            "def": {
              "primitive": "u64"
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
                        "type": 11,
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
                        "type": 11,
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
          "id": 19,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "fields": [
                      {
                        "type": 20
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
                "type": 20
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
                    "index": 0,
                    "name": "None"
                  },
                  {
                    "fields": [
                      {
                        "type": 2
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
                "type": 2
              }
            ],
            "path": [
              "Option"
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
                "type": 3
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
                        "type": 24
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
                "type": 24
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
                        "type": 25
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
                "type": 25
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
              "composite": {
                "fields": [
                  {
                    "name": "status",
                    "type": 26,
                    "typeName": "TransactionStatus"
                  },
                  {
                    "name": "trader",
                    "type": 3,
                    "typeName": "AccountId"
                  },
                  {
                    "name": "amount",
                    "type": 2,
                    "typeName": "Balance"
                  },
                  {
                    "name": "receiver",
                    "type": 3,
                    "typeName": "AccountId"
                  }
                ]
              }
            },
            "path": [
              "bridge_token_project",
              "impls",
              "azero_manager",
              "data",
              "TransactionInformation"
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
                    "index": 0,
                    "name": "Pending"
                  },
                  {
                    "index": 1,
                    "name": "Processing"
                  },
                  {
                    "index": 2,
                    "name": "Completed"
                  },
                  {
                    "index": 3,
                    "name": "Canceled"
                  }
                ]
              }
            },
            "path": [
              "bridge_token_project",
              "impls",
              "azero_manager",
              "data",
              "TransactionStatus"
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
          "id": 28,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "fields": [
                      {
                        "type": 29
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
                "type": 29
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
          "id": 29,
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
          "id": 30,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "fields": [
                      {
                        "type": 31
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
                "type": 31
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
          "id": 31,
          "type": {
            "def": {
              "primitive": "bool"
            }
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
          "id": 33,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "type": 4,
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
          "id": 34,
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
}
export default azero_manager_bridge