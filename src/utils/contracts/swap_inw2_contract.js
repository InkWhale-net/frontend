const swap_inw2_contract = {
    CONTRACT_ADDRESS: "5FvhtkkqjsVtTXLDDex5a4GKry4dRVEKyRrcuvMfWL4aKxXa",
    CONTRACT_ABI: {
      "source": {
        "hash": "0x5932ebcc5b5cfb4045617ecbfd683f17a2d56c3b8daae151aa68d4aabf9c20f9",
        "language": "ink! 4.3.0",
        "compiler": "rustc 1.68.0",
        "build_info": {
          "build_mode": "Release",
          "cargo_contract_version": "3.2.0",
          "rust_toolchain": "stable-x86_64-unknown-linux-gnu",
          "wasm_opt_settings": {
            "keep_debug_symbols": false,
            "optimization_passes": "Z"
          }
        }
      },
      "contract": {
        "name": "inw_swap",
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
                "label": "inw_contract_v1",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 1
                }
              },
              {
                "label": "inw_contract_v2",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 1
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
              "type": 5
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
            "type": 1
          },
          "balance": {
            "displayName": [
              "Balance"
            ],
            "type": 0
          },
          "blockNumber": {
            "displayName": [
              "BlockNumber"
            ],
            "type": 34
          },
          "chainExtension": {
            "displayName": [
              "ChainExtension"
            ],
            "type": 35
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
            "type": 19
          }
        },
        "events": [
          {
            "args": [
              {
                "docs": [],
                "indexed": true,
                "label": "user",
                "type": {
                  "displayName": [
                    "AccountId"
                  ],
                  "type": 1
                }
              },
              {
                "docs": [],
                "indexed": false,
                "label": "value",
                "type": {
                  "displayName": [
                    "Balance"
                  ],
                  "type": 0
                }
              }
            ],
            "docs": [],
            "label": "Swap"
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
            "args": [],
            "default": false,
            "docs": [],
            "label": "pause",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 8
            },
            "selector": "0x81e0c604"
          },
          {
            "args": [],
            "default": false,
            "docs": [],
            "label": "unpause",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 8
            },
            "selector": "0x67616649"
          },
          {
            "args": [],
            "default": false,
            "docs": [],
            "label": "change_state",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 8
            },
            "selector": "0x300f90c8"
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
                  "type": 2
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
              "type": 11
            },
            "selector": "0x9e32fab2"
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
                  "type": 1
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
                  "type": 1
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
              "type": 11
            },
            "selector": "0xd9aad284"
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
                  "type": 1
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
              "type": 11
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
              "type": 21
            },
            "selector": "0xc4360570"
          },
          {
            "args": [],
            "default": false,
            "docs": [],
            "label": "InwSwapTrait::get_inw_contract_v2",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 23
            },
            "selector": "0x0543f709"
          },
          {
            "args": [],
            "default": false,
            "docs": [],
            "label": "InwSwapTrait::get_inw_contract_v1",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 23
            },
            "selector": "0x1a3ed4b8"
          },
          {
            "args": [
              {
                "label": "inw_contract_v2",
                "type": {
                  "displayName": [
                    "inwswaptrait_external",
                    "SetInwContractV2Input1"
                  ],
                  "type": 1
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "InwSwapTrait::set_inw_contract_v2",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 11
            },
            "selector": "0x73271d53"
          },
          {
            "args": [
              {
                "label": "amount",
                "type": {
                  "displayName": [
                    "inwswaptrait_external",
                    "BurnInwV1Input1"
                  ],
                  "type": 0
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "InwSwapTrait::burn_inw_v1",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 11
            },
            "selector": "0xa7c2e930"
          },
          {
            "args": [
              {
                "label": "inw_contract_v1",
                "type": {
                  "displayName": [
                    "inwswaptrait_external",
                    "SetInwContractV1Input1"
                  ],
                  "type": 1
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "InwSwapTrait::set_inw_contract_v1",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 11
            },
            "selector": "0x44df600b"
          },
          {
            "args": [
              {
                "label": "amount",
                "type": {
                  "displayName": [
                    "inwswaptrait_external",
                    "SwapInput1"
                  ],
                  "type": 0
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "InwSwapTrait::swap",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 11
            },
            "selector": "0xae765606"
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
              "type": 24
            },
            "selector": "0x5e228753"
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
              "type": 26
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
                  "type": 27
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
              "type": 24
            },
            "selector": "0x11f43efd"
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
                  "type": 1
                }
              },
              {
                "label": "spender",
                "type": {
                  "displayName": [
                    "psp22_external",
                    "AllowanceInput2"
                  ],
                  "type": 1
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "PSP22::allowance",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 28
            },
            "selector": "0x4d47d921"
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
                  "type": 1
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "PSP22::balance_of",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 28
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
                  "type": 1
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
            "default": false,
            "docs": [],
            "label": "PSP22::increase_allowance",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 29
            },
            "selector": "0x96d6b57a"
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
                  "type": 1
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
            "default": false,
            "docs": [],
            "label": "PSP22::decrease_allowance",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 29
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
                  "type": 1
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
                  "type": 31
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "PSP22::transfer",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 29
            },
            "selector": "0xdb20f9f5"
          },
          {
            "args": [],
            "default": false,
            "docs": [],
            "label": "PSP22::total_supply",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 28
            },
            "selector": "0x162df8c2"
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
                  "type": 1
                }
              },
              {
                "label": "to",
                "type": {
                  "displayName": [
                    "psp22_external",
                    "TransferFromInput2"
                  ],
                  "type": 1
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
                  "type": 31
                }
              }
            ],
            "default": false,
            "docs": [],
            "label": "PSP22::transfer_from",
            "mutates": true,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 29
            },
            "selector": "0x54b3c76e"
          },
          {
            "args": [],
            "default": false,
            "docs": [],
            "label": "PSP22Capped::cap",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 28
            },
            "selector": "0xf40366b4"
          },
          {
            "args": [],
            "default": false,
            "docs": [],
            "label": "Pausable::paused",
            "mutates": false,
            "payable": false,
            "returnType": {
              "displayName": [
                "ink",
                "MessageResult"
              ],
              "type": 32
            },
            "selector": "0xd123ce11"
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
                                  "key": "0x270a8fc3",
                                  "ty": 0
                                }
                              },
                              "root_key": "0x270a8fc3"
                            }
                          },
                          "name": "supply"
                        },
                        {
                          "layout": {
                            "root": {
                              "layout": {
                                "leaf": {
                                  "key": "0xc2664826",
                                  "ty": 0
                                }
                              },
                              "root_key": "0xc2664826"
                            }
                          },
                          "name": "balances"
                        },
                        {
                          "layout": {
                            "root": {
                              "layout": {
                                "leaf": {
                                  "key": "0xf8d71e22",
                                  "ty": 0
                                }
                              },
                              "root_key": "0xf8d71e22"
                            }
                          },
                          "name": "allowances"
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
                              "ty": 1
                            }
                          },
                          "name": "inw_contract_v1"
                        },
                        {
                          "layout": {
                            "leaf": {
                              "key": "0x00000000",
                              "ty": 1
                            }
                          },
                          "name": "inw_contract_v2"
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
                            "root": {
                              "layout": {
                                "leaf": {
                                  "key": "0x5fd98c24",
                                  "ty": 0
                                }
                              },
                              "root_key": "0x5fd98c24"
                            }
                          },
                          "name": "cap"
                        }
                      ],
                      "name": "Data"
                    }
                  },
                  "name": "cap"
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
                                  "key": "0xec3485f7",
                                  "ty": 4
                                }
                              },
                              "root_key": "0xec3485f7"
                            }
                          },
                          "name": "paused"
                        }
                      ],
                      "name": "Data"
                    }
                  },
                  "name": "pause"
                }
              ],
              "name": "InwSwap"
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
              "composite": {
                "fields": [
                  {
                    "type": 2,
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
          "id": 2,
          "type": {
            "def": {
              "array": {
                "len": 32,
                "type": 3
              }
            }
          }
        },
        {
          "id": 3,
          "type": {
            "def": {
              "primitive": "u8"
            }
          }
        },
        {
          "id": 4,
          "type": {
            "def": {
              "primitive": "bool"
            }
          }
        },
        {
          "id": 5,
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
                "type": 6
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
                        "type": 6
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
                "type": 6
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
                    "index": 0,
                    "name": "Paused"
                  },
                  {
                    "index": 1,
                    "name": "NotPaused"
                  }
                ]
              }
            },
            "path": [
              "openbrush_contracts",
              "traits",
              "errors",
              "pausable",
              "PausableError"
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
                        "type": 12
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
                "type": 12
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
          "id": 12,
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
          "id": 13,
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
                        "type": 15,
                        "typeName": "OwnableError"
                      }
                    ],
                    "index": 1,
                    "name": "OwnableError"
                  },
                  {
                    "fields": [
                      {
                        "type": 16,
                        "typeName": "AccessControlError"
                      }
                    ],
                    "index": 2,
                    "name": "AccessControlError"
                  },
                  {
                    "fields": [
                      {
                        "type": 17,
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
                    "fields": [
                      {
                        "type": 10,
                        "typeName": "PausableError"
                      }
                    ],
                    "index": 5,
                    "name": "PausableError"
                  },
                  {
                    "index": 6,
                    "name": "NotEnoughBalance"
                  },
                  {
                    "index": 7,
                    "name": "WithdrawFeeError"
                  },
                  {
                    "index": 8,
                    "name": "NotCallable"
                  },
                  {
                    "index": 9,
                    "name": "CannotTransfer"
                  },
                  {
                    "index": 10,
                    "name": "CannotBurn"
                  },
                  {
                    "index": 11,
                    "name": "CheckedOperations"
                  },
                  {
                    "index": 12,
                    "name": "InvalidBalanceAndAllowance"
                  },
                  {
                    "index": 13,
                    "name": "AlreadyInit"
                  },
                  {
                    "index": 14,
                    "name": "InvalidBuyAmount"
                  },
                  {
                    "index": 15,
                    "name": "InvalidTransferAmount"
                  },
                  {
                    "index": 16,
                    "name": "CannotCreatePool"
                  },
                  {
                    "index": 17,
                    "name": "NotTimeToStake"
                  },
                  {
                    "index": 18,
                    "name": "NoStakerFound"
                  },
                  {
                    "index": 19,
                    "name": "InvalidUnstakedAmount"
                  },
                  {
                    "index": 20,
                    "name": "NotEnoughReward"
                  },
                  {
                    "index": 21,
                    "name": "NotTokenOwner"
                  },
                  {
                    "index": 22,
                    "name": "AllowanceNotSet"
                  },
                  {
                    "index": 23,
                    "name": "TokenNotFound"
                  },
                  {
                    "index": 24,
                    "name": "UserNotStake"
                  },
                  {
                    "index": 25,
                    "name": "NoTokenOwner"
                  },
                  {
                    "index": 26,
                    "name": "ExceedTotalStakingAmount"
                  },
                  {
                    "index": 27,
                    "name": "NoClaimAmount"
                  },
                  {
                    "index": 28,
                    "name": "NotTimeToWithdraw"
                  },
                  {
                    "index": 29,
                    "name": "NotEnoughRewardToWithdraw"
                  },
                  {
                    "index": 30,
                    "name": "NotTopupEnoughReward"
                  },
                  {
                    "index": 31,
                    "name": "NoAmount"
                  },
                  {
                    "index": 32,
                    "name": "InvalidTokenBalanceAndAllowance"
                  },
                  {
                    "index": 33,
                    "name": "CannotApprove"
                  },
                  {
                    "index": 34,
                    "name": "CannotTopupRewardPool"
                  },
                  {
                    "index": 35,
                    "name": "NotTimeToPurchase"
                  },
                  {
                    "index": 36,
                    "name": "NotTimeToClaim"
                  },
                  {
                    "index": 37,
                    "name": "NotTimeToBurn"
                  },
                  {
                    "index": 38,
                    "name": "NoTokenPurchased"
                  },
                  {
                    "index": 39,
                    "name": "AlreadyBurnt"
                  },
                  {
                    "index": 40,
                    "name": "InvalidTime"
                  },
                  {
                    "index": 41,
                    "name": "InvalidPercentage"
                  },
                  {
                    "index": 42,
                    "name": "InvalidDuration"
                  },
                  {
                    "index": 43,
                    "name": "InvalidVestingUnit"
                  },
                  {
                    "index": 44,
                    "name": "InvalidTopupAmount"
                  },
                  {
                    "index": 45,
                    "name": "LaunchpadNotExist"
                  },
                  {
                    "index": 46,
                    "name": "InvalidIsActiveInput"
                  },
                  {
                    "index": 47,
                    "name": "InvalidCreationFee"
                  },
                  {
                    "index": 48,
                    "name": "InvalidTxRate"
                  },
                  {
                    "index": 49,
                    "name": "InvalidPhaseData"
                  },
                  {
                    "index": 50,
                    "name": "CannotTopupToken"
                  },
                  {
                    "index": 51,
                    "name": "InvalidStartTimeAndEndTime"
                  },
                  {
                    "index": 52,
                    "name": "InvalidPhaseCount"
                  },
                  {
                    "index": 53,
                    "name": "InvalidMaxStakingAmount"
                  },
                  {
                    "index": 54,
                    "name": "InvalidApy"
                  },
                  {
                    "index": 55,
                    "name": "InvalidMultiplier"
                  },
                  {
                    "index": 56,
                    "name": "InvalidWhitelistData"
                  },
                  {
                    "index": 57,
                    "name": "PhaseNotExist"
                  },
                  {
                    "index": 58,
                    "name": "PhaseNotActive"
                  },
                  {
                    "index": 59,
                    "name": "WhitelistBuyerInfoNotExist"
                  },
                  {
                    "index": 60,
                    "name": "WhitelistBuyerInfoExist"
                  },
                  {
                    "index": 61,
                    "name": "WhitelistBuyerPurchased"
                  },
                  {
                    "index": 62,
                    "name": "WhitelistSaleInfoNotExist"
                  },
                  {
                    "index": 63,
                    "name": "WhitelistPhaseAccountNotExist"
                  },
                  {
                    "index": 64,
                    "name": "PublicSaleInfoNotExist"
                  },
                  {
                    "index": 65,
                    "name": "InvalidSetActive"
                  },
                  {
                    "index": 66,
                    "name": "InvalidTotalAmount"
                  },
                  {
                    "index": 67,
                    "name": "CannotTransferTxFee"
                  },
                  {
                    "index": 68,
                    "name": "ActiveLaunchpadStatusNotFound"
                  },
                  {
                    "index": 69,
                    "name": "LaunchpadNotActive"
                  },
                  {
                    "index": 70,
                    "name": "InvalidCaller"
                  },
                  {
                    "index": 71,
                    "name": "NoPhaseActive"
                  },
                  {
                    "index": 72,
                    "name": "InvalidTotalSupply"
                  },
                  {
                    "index": 73,
                    "name": "PhaseNotPublic"
                  },
                  {
                    "index": 74,
                    "name": "InvalidSetPublic"
                  },
                  {
                    "index": 75,
                    "name": "InvalidCapAmount"
                  },
                  {
                    "index": 76,
                    "name": "InvalidWhitelistAmount"
                  },
                  {
                    "index": 77,
                    "name": "CapExceeded"
                  },
                  {
                    "index": 78,
                    "name": "CannotCollectInwV1"
                  },
                  {
                    "index": 79,
                    "name": "CannotMintInwV2"
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
          "id": 14,
          "type": {
            "def": {
              "primitive": "str"
            }
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
          "id": 16,
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
          "id": 17,
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
                    "name": "RecipientIsNotSet"
                  },
                  {
                    "index": 4,
                    "name": "SenderIsNotSet"
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
                        "type": 18,
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
          "id": 18,
          "type": {
            "def": {
              "variant": {
                "variants": [
                  {
                    "fields": [
                      {
                        "type": 1,
                        "typeName": "AccountId"
                      },
                      {
                        "type": 19,
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
          "id": 19,
          "type": {
            "def": {
              "primitive": "u64"
            }
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
                        "type": 22
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
                "type": 22
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
                        "type": 0
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
                "type": 0
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
          "id": 23,
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
                "type": 25
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
          "id": 25,
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
                        "type": 15
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
                "type": 15
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
                        "type": 27
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
                "type": 27
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
                        "type": 1
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
                "type": 1
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
                "type": 30
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
          "id": 30,
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
                "type": 6
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
          "id": 31,
          "type": {
            "def": {
              "sequence": {
                "type": 3
              }
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
          "id": 33,
          "type": {
            "def": {
              "composite": {
                "fields": [
                  {
                    "type": 2,
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
              "primitive": "u32"
            }
          }
        },
        {
          "id": 35,
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
  
  export default swap_inw2_contract;