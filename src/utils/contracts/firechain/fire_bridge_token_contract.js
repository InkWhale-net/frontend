const fire_bridge_token_contract = {
  CONTRACT_ADDRESS: "5G7XBavTHH2rpNHxWrt5H5tSq5T6gxtjpTdzsep1ZYkbZtnL",
  CONTRACT_ABI: {
    source: {
      hash: "0x4fad9e7b2ceeeaa819bb19241a056afe166dd894e5a6eaf3125189221719a343",
      language: "ink! 4.3.0",
      compiler: "rustc 1.75.0-nightly",
      build_info: {
        build_mode: "Debug",
        cargo_contract_version: "3.2.0",
        rust_toolchain: "nightly-x86_64-unknown-linux-gnu",
        wasm_opt_settings: {
          keep_debug_symbols: false,
          optimization_passes: "Z",
        },
      },
    },
    contract: {
      name: "bridge_token",
      version: "1.0.0",
      authors: ["Inkwhale <admin@inkwhale.net>"],
    },
    spec: {
      constructors: [
        {
          args: [
            {
              label: "trading_rate",
              type: {
                displayName: ["u32"],
                type: 0,
              },
            },
            {
              label: "token_azero_contract_address",
              type: {
                displayName: ["AccountId"],
                type: 3,
              },
            },
            {
              label: "token_5ire_contract_address",
              type: {
                displayName: ["AccountId"],
                type: 3,
              },
            },
            {
              label: "admin_account",
              type: {
                displayName: ["AccountId"],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "new",
          payable: false,
          returnType: {
            displayName: ["ink_primitives", "ConstructorResult"],
            type: 7,
          },
          selector: "0x9bae9d5e",
        },
      ],
      docs: [],
      environment: {
        accountId: {
          displayName: ["AccountId"],
          type: 3,
        },
        balance: {
          displayName: ["Balance"],
          type: 6,
        },
        blockNumber: {
          displayName: ["BlockNumber"],
          type: 0,
        },
        chainExtension: {
          displayName: ["ChainExtension"],
          type: 38,
        },
        hash: {
          displayName: ["Hash"],
          type: 37,
        },
        maxEventTopics: 4,
        timestamp: {
          displayName: ["Timestamp"],
          type: 18,
        },
      },
      events: [
        {
          args: [
            {
              docs: [],
              indexed: false,
              label: "transaction_id",
              type: {
                displayName: ["u128"],
                type: 6,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "trader",
              type: {
                displayName: ["AccountId"],
                type: 3,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "trading_amount",
              type: {
                displayName: ["Balance"],
                type: 6,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "receiver",
              type: {
                displayName: ["AccountId"],
                type: 3,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "trading_fee",
              type: {
                displayName: ["Balance"],
                type: 6,
              },
            },
          ],
          docs: [],
          label: "CreateNewTransaction",
        },
      ],
      lang_error: {
        displayName: ["ink", "LangError"],
        type: 8,
      },
      messages: [
        {
          args: [
            {
              label: "amount",
              type: {
                displayName: ["Balance"],
                type: 6,
              },
            },
            {
              label: "receiver",
              type: {
                displayName: ["AccountId"],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "create_new_transaction",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 9,
          },
          selector: "0x039581ba",
        },
        {
          args: [
            {
              label: "code_hash",
              type: {
                displayName: ["upgradeabletrait_external", "SetCodeInput1"],
                type: 4,
              },
            },
          ],
          default: false,
          docs: [
            " This function allow contract owner modifies the code which is used to execute calls to this contract address (`AccountId`).",
          ],
          label: "UpgradeableTrait::set_code",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 9,
          },
          selector: "0x9e32fab2",
        },
        {
          args: [
            {
              label: "trader",
              type: {
                displayName: [
                  "bridgetoken_external",
                  "GetBalanceOfTraderInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "BridgeToken::get_balance_of_trader",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0x0052eae6",
        },
        {
          args: [
            {
              label: "trader",
              type: {
                displayName: [
                  "bridgetoken_external",
                  "GetPendingTransactionsByTraderAndIndexInput1",
                ],
                type: 3,
              },
            },
            {
              label: "index",
              type: {
                displayName: [
                  "bridgetoken_external",
                  "GetPendingTransactionsByTraderAndIndexInput2",
                ],
                type: 18,
              },
            },
          ],
          default: false,
          docs: [],
          label: "BridgeToken::get_pending_transactions_by_trader_and_index",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0x4a83ab04",
        },
        {
          args: [
            {
              label: "trader",
              type: {
                displayName: [
                  "bridgetoken_external",
                  "GetCompletedTransactionsByTraderAndIndexInput1",
                ],
                type: 3,
              },
            },
            {
              label: "index",
              type: {
                displayName: [
                  "bridgetoken_external",
                  "GetCompletedTransactionsByTraderAndIndexInput2",
                ],
                type: 18,
              },
            },
          ],
          default: false,
          docs: [],
          label: "BridgeToken::get_completed_transactions_by_trader_and_index",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0x6b951322",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "BridgeToken::get_last_transaction_id",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 22,
          },
          selector: "0x58e3ccec",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "BridgeToken::get_token_azero_contract_address",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 23,
          },
          selector: "0xade49a0e",
        },
        {
          args: [
            {
              label: "transaction_id",
              type: {
                displayName: [
                  "bridgetoken_external",
                  "GetTransactionInformationByIdInput1",
                ],
                type: 6,
              },
            },
          ],
          default: false,
          docs: [],
          label: "BridgeToken::get_transaction_information_by_id",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 24,
          },
          selector: "0x65a65401",
        },
        {
          args: [
            {
              label: "trader",
              type: {
                displayName: [
                  "bridgetoken_external",
                  "CountCompletedTransactionsByTraderInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "BridgeToken::count_completed_transactions_by_trader",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 28,
          },
          selector: "0xcf3f8b57",
        },
        {
          args: [
            {
              label: "admin_account",
              type: {
                displayName: [
                  "bridgetoken_external",
                  "UpdateAdminAccountInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "BridgeToken::update_admin_account",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 9,
          },
          selector: "0x505ee71b",
        },
        {
          args: [
            {
              label: "trader",
              type: {
                displayName: [
                  "bridgetoken_external",
                  "GetProcessingTransactionByTraderInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "BridgeToken::get_processing_transaction_by_trader",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0xef974638",
        },
        {
          args: [
            {
              label: "contract_address",
              type: {
                displayName: [
                  "bridgetoken_external",
                  "UpdateToken5ireContractAddressInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "BridgeToken::update_token_5ire_contract_address",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 9,
          },
          selector: "0x1f9833d2",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "BridgeToken::unpause",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 9,
          },
          selector: "0xfe632a30",
        },
        {
          args: [
            {
              label: "transaction_id",
              type: {
                displayName: [
                  "bridgetoken_external",
                  "CompleteTransactionInput1",
                ],
                type: 6,
              },
            },
          ],
          default: false,
          docs: [],
          label: "BridgeToken::complete_transaction",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 9,
          },
          selector: "0xff16c5d0",
        },
        {
          args: [
            {
              label: "trader",
              type: {
                displayName: [
                  "bridgetoken_external",
                  "CountPendingTransactionsByTraderInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "BridgeToken::count_pending_transactions_by_trader",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 28,
          },
          selector: "0x69f871ec",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "BridgeToken::change_state",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 9,
          },
          selector: "0x1ba64dfe",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "BridgeToken::pause",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 9,
          },
          selector: "0x5621831b",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "BridgeToken::get_token_5ire_contract_address",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 23,
          },
          selector: "0x49d3f6d3",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "BridgeToken::get_transaction_last_id",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 22,
          },
          selector: "0xe718af27",
        },
        {
          args: [
            {
              label: "transaction_id",
              type: {
                displayName: [
                  "bridgetoken_external",
                  "ProcessTransactionInput1",
                ],
                type: 6,
              },
            },
          ],
          default: false,
          docs: [],
          label: "BridgeToken::process_transaction",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 9,
          },
          selector: "0x3ba7bcdc",
        },
        {
          args: [
            {
              label: "amount",
              type: {
                displayName: ["bridgetoken_external", "MintTokenInput1"],
                type: 6,
              },
            },
            {
              label: "receiver",
              type: {
                displayName: ["bridgetoken_external", "MintTokenInput2"],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "BridgeToken::mint_token",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 9,
          },
          selector: "0xd05a8800",
        },
        {
          args: [
            {
              label: "contract_address",
              type: {
                displayName: [
                  "bridgetoken_external",
                  "UpdateTokenAzeroContractAddressInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "BridgeToken::update_token_azero_contract_address",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 9,
          },
          selector: "0x49099e00",
        },
        {
          args: [
            {
              label: "trading_rate",
              type: {
                displayName: [
                  "bridgetoken_external",
                  "UpdateTradingRateInput1",
                ],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [],
          label: "BridgeToken::update_trading_rate",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 9,
          },
          selector: "0xce240252",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "BridgeToken::get_admin_account",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 23,
          },
          selector: "0x871eae41",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "BridgeToken::get_trading_rate",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 29,
          },
          selector: "0xddafc330",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "GrantRoleInput1"],
                type: 0,
              },
            },
            {
              label: "account",
              type: {
                displayName: ["accesscontrol_external", "GrantRoleInput2"],
                type: 30,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AccessControl::grant_role",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 31,
          },
          selector: "0x4ac062fd",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "HasRoleInput1"],
                type: 0,
              },
            },
            {
              label: "address",
              type: {
                displayName: ["accesscontrol_external", "HasRoleInput2"],
                type: 30,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AccessControl::has_role",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 33,
          },
          selector: "0xc1d9ac18",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "GetRoleAdminInput1"],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AccessControl::get_role_admin",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 29,
          },
          selector: "0x83da3bb2",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "RevokeRoleInput1"],
                type: 0,
              },
            },
            {
              label: "account",
              type: {
                displayName: ["accesscontrol_external", "RevokeRoleInput2"],
                type: 30,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AccessControl::revoke_role",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 31,
          },
          selector: "0x6e4f0991",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "RenounceRoleInput1"],
                type: 0,
              },
            },
            {
              label: "account",
              type: {
                displayName: ["accesscontrol_external", "RenounceRoleInput2"],
                type: 30,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AccessControl::renounce_role",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 31,
          },
          selector: "0xeaf1248a",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "Pausable::paused",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 33,
          },
          selector: "0xd123ce11",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "Ownable::owner",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 34,
          },
          selector: "0x4fa43c8c",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "Ownable::renounce_ownership",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 35,
          },
          selector: "0x5e228753",
        },
        {
          args: [
            {
              label: "new_owner",
              type: {
                displayName: ["ownable_external", "TransferOwnershipInput1"],
                type: 30,
              },
            },
          ],
          default: false,
          docs: [],
          label: "Ownable::transfer_ownership",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 35,
          },
          selector: "0x11f43efd",
        },
      ],
    },
    storage: {
      root: {
        layout: {
          struct: {
            fields: [
              {
                layout: {
                  struct: {
                    fields: [
                      {
                        layout: {
                          root: {
                            layout: {
                              leaf: {
                                key: "0x1f2cf4ac",
                                ty: 0,
                              },
                            },
                            root_key: "0x1f2cf4ac",
                          },
                        },
                        name: "admin_roles",
                      },
                      {
                        layout: {
                          root: {
                            layout: {
                              leaf: {
                                key: "0x8150f558",
                                ty: 1,
                              },
                            },
                            root_key: "0x8150f558",
                          },
                        },
                        name: "members",
                      },
                    ],
                    name: "Data",
                  },
                },
                name: "access",
              },
              {
                layout: {
                  struct: {
                    fields: [
                      {
                        layout: {
                          root: {
                            layout: {
                              leaf: {
                                key: "0xec3485f7",
                                ty: 2,
                              },
                            },
                            root_key: "0xec3485f7",
                          },
                        },
                        name: "paused",
                      },
                    ],
                    name: "Data",
                  },
                },
                name: "pausable",
              },
              {
                layout: {
                  struct: {
                    fields: [
                      {
                        layout: {
                          root: {
                            layout: {
                              enum: {
                                dispatchKey: "0x6f713913",
                                name: "Option",
                                variants: {
                                  0: {
                                    fields: [],
                                    name: "None",
                                  },
                                  1: {
                                    fields: [
                                      {
                                        layout: {
                                          leaf: {
                                            key: "0x6f713913",
                                            ty: 3,
                                          },
                                        },
                                        name: "0",
                                      },
                                    ],
                                    name: "Some",
                                  },
                                },
                              },
                            },
                            root_key: "0x6f713913",
                          },
                        },
                        name: "owner",
                      },
                    ],
                    name: "Data",
                  },
                },
                name: "ownable",
              },
              {
                layout: {
                  struct: {
                    fields: [
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "admin_account",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 0,
                          },
                        },
                        name: "trading_rate",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "token_azero_contract_address",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "token_5ire_contract_address",
                      },
                      {
                        layout: {
                          root: {
                            layout: {
                              leaf: {
                                key: "0xb33a04dc",
                                ty: 6,
                              },
                            },
                            root_key: "0xb33a04dc",
                          },
                        },
                        name: "traders",
                      },
                      {
                        layout: {
                          root: {
                            layout: {
                              struct: {
                                fields: [
                                  {
                                    layout: {
                                      enum: {
                                        dispatchKey: "0x1dc70227",
                                        name: "TransactionStatus",
                                        variants: {
                                          0: {
                                            fields: [],
                                            name: "Pending",
                                          },
                                          1: {
                                            fields: [],
                                            name: "Processing",
                                          },
                                          2: {
                                            fields: [],
                                            name: "Completed",
                                          },
                                          3: {
                                            fields: [],
                                            name: "Canceled",
                                          },
                                        },
                                      },
                                    },
                                    name: "status",
                                  },
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x1dc70227",
                                        ty: 3,
                                      },
                                    },
                                    name: "trader",
                                  },
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x1dc70227",
                                        ty: 6,
                                      },
                                    },
                                    name: "amount",
                                  },
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x1dc70227",
                                        ty: 3,
                                      },
                                    },
                                    name: "receiver",
                                  },
                                ],
                                name: "TransactionInformation",
                              },
                            },
                            root_key: "0x1dc70227",
                          },
                        },
                        name: "transactions",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 6,
                          },
                        },
                        name: "transaction_id",
                      },
                      {
                        layout: {
                          root: {
                            layout: {
                              leaf: {
                                key: "0x6525230e",
                                ty: 6,
                              },
                            },
                            root_key: "0x6525230e",
                          },
                        },
                        name: "pending_transactions_by_trader",
                      },
                      {
                        layout: {
                          root: {
                            layout: {
                              leaf: {
                                key: "0x916b6d05",
                                ty: 6,
                              },
                            },
                            root_key: "0x916b6d05",
                          },
                        },
                        name: "processing_transaction_by_trader",
                      },
                      {
                        layout: {
                          root: {
                            layout: {
                              leaf: {
                                key: "0x54f4263e",
                                ty: 6,
                              },
                            },
                            root_key: "0x54f4263e",
                          },
                        },
                        name: "completed_transactions_by_trader",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "bridge_token_contract_address",
                      },
                      {
                        layout: {
                          enum: {
                            dispatchKey: "0x00000000",
                            name: "Option",
                            variants: {
                              0: {
                                fields: [],
                                name: "None",
                              },
                              1: {
                                fields: [
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x00000000",
                                        ty: 1,
                                      },
                                    },
                                    name: "0",
                                  },
                                ],
                                name: "Some",
                              },
                            },
                          },
                        },
                        name: "_reserved",
                      },
                    ],
                    name: "Data",
                  },
                },
                name: "bridge_token_data",
              },
            ],
            name: "BridgeTokenContract",
          },
        },
        root_key: "0x00000000",
      },
    },
    types: [
      {
        id: 0,
        type: {
          def: {
            primitive: "u32",
          },
        },
      },
      {
        id: 1,
        type: {
          def: {
            tuple: [],
          },
        },
      },
      {
        id: 2,
        type: {
          def: {
            primitive: "bool",
          },
        },
      },
      {
        id: 3,
        type: {
          def: {
            composite: {
              fields: [
                {
                  type: 4,
                  typeName: "[u8; 32]",
                },
              ],
            },
          },
          path: ["ink_primitives", "types", "AccountId"],
        },
      },
      {
        id: 4,
        type: {
          def: {
            array: {
              len: 32,
              type: 5,
            },
          },
        },
      },
      {
        id: 5,
        type: {
          def: {
            primitive: "u8",
          },
        },
      },
      {
        id: 6,
        type: {
          def: {
            primitive: "u128",
          },
        },
      },
      {
        id: 7,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 1,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 8,
                    },
                  ],
                  index: 1,
                  name: "Err",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 1,
            },
            {
              name: "E",
              type: 8,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 8,
        type: {
          def: {
            variant: {
              variants: [
                {
                  index: 1,
                  name: "CouldNotReadInput",
                },
              ],
            },
          },
          path: ["ink_primitives", "LangError"],
        },
      },
      {
        id: 9,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 10,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 8,
                    },
                  ],
                  index: 1,
                  name: "Err",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 10,
            },
            {
              name: "E",
              type: 8,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 10,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 1,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 11,
                    },
                  ],
                  index: 1,
                  name: "Err",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 1,
            },
            {
              name: "E",
              type: 11,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 11,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 12,
                      typeName: "String",
                    },
                  ],
                  index: 0,
                  name: "Custom",
                },
                {
                  index: 1,
                  name: "OnlyOwner",
                },
                {
                  index: 2,
                  name: "OnlyAdmin",
                },
                {
                  index: 3,
                  name: "InvalidCaller",
                },
                {
                  index: 4,
                  name: "InvalidFee",
                },
                {
                  index: 5,
                  name: "TokenOwnerNotMatch",
                },
                {
                  index: 6,
                  name: "NotApproved",
                },
                {
                  index: 7,
                  name: "CannotTransfer",
                },
                {
                  index: 8,
                  name: "CannotMint",
                },
                {
                  index: 9,
                  name: "NotPublicMint",
                },
                {
                  index: 10,
                  name: "NotEnoughBalance",
                },
                {
                  index: 11,
                  name: "MaxSupply",
                },
                {
                  index: 12,
                  name: "AlreadyInit",
                },
                {
                  index: 13,
                  name: "NotOwner",
                },
                {
                  index: 14,
                  name: "NotTokenOwner",
                },
                {
                  index: 15,
                  name: "ProjectNotExist",
                },
                {
                  index: 16,
                  name: "ProjectOwnerAndAdmin",
                },
                {
                  index: 17,
                  name: "InvalidStartTimeAndEndTime",
                },
                {
                  index: 18,
                  name: "InvalidPhaseCount",
                },
                {
                  index: 19,
                  name: "CollectionOwnerAndAdmin",
                },
                {
                  index: 20,
                  name: "CollectionNotActive",
                },
                {
                  index: 21,
                  name: "CollectionNotExist",
                },
                {
                  index: 22,
                  name: "InvalidInput",
                },
                {
                  index: 23,
                  name: "InvalidType",
                },
                {
                  index: 24,
                  name: "ClaimedAll",
                },
                {
                  index: 25,
                  name: "TokenLimitReached",
                },
                {
                  index: 26,
                  name: "UpdatePhase",
                },
                {
                  index: 27,
                  name: "PhaseNotExist",
                },
                {
                  index: 28,
                  name: "PhaseExpired",
                },
                {
                  index: 29,
                  name: "PhaseDeactivate",
                },
                {
                  index: 30,
                  name: "WhitelistNotExist",
                },
                {
                  index: 31,
                  name: "WithdrawFeeError",
                },
                {
                  index: 32,
                  name: "WithdrawNFTError",
                },
                {
                  index: 33,
                  name: "WithdrawPSP22Error",
                },
                {
                  index: 34,
                  name: "NotListed",
                },
                {
                  index: 35,
                  name: "BidAlreadyExist",
                },
                {
                  index: 36,
                  name: "BidNotExist",
                },
                {
                  index: 37,
                  name: "NotInMarket",
                },
                {
                  index: 38,
                  name: "IsForSale",
                },
                {
                  index: 39,
                  name: "NotForSale",
                },
                {
                  index: 40,
                  name: "NotInSaleList",
                },
                {
                  index: 41,
                  name: "InvalidBidLength",
                },
                {
                  index: 42,
                  name: "InvalidCollectionOwner",
                },
                {
                  index: 43,
                  name: "InvalidTime",
                },
                {
                  index: 44,
                  name: "RewardStarted",
                },
                {
                  index: 45,
                  name: "RewardNotStarted",
                },
                {
                  index: 46,
                  name: "RewardNotAdded",
                },
                {
                  index: 47,
                  name: "ClaimMustBeFalse",
                },
                {
                  index: 48,
                  name: "HoldAmountBidderNotExist",
                },
                {
                  fields: [
                    {
                      type: 13,
                      typeName: "OwnableError",
                    },
                  ],
                  index: 49,
                  name: "OwnableError",
                },
                {
                  fields: [
                    {
                      type: 14,
                      typeName: "PausableError",
                    },
                  ],
                  index: 50,
                  name: "PausableError",
                },
                {
                  fields: [
                    {
                      type: 15,
                      typeName: "AccessControlError",
                    },
                  ],
                  index: 51,
                  name: "AccessControlError",
                },
                {
                  fields: [
                    {
                      type: 16,
                      typeName: "PSP22Error",
                    },
                  ],
                  index: 52,
                  name: "PSP22Error",
                },
                {
                  fields: [
                    {
                      type: 19,
                      typeName: "PSP34Error",
                    },
                  ],
                  index: 53,
                  name: "PSP34Error",
                },
                {
                  index: 54,
                  name: "CheckedOperations",
                },
                {
                  index: 55,
                  name: "InvalidBalanceAndAllowance",
                },
                {
                  index: 56,
                  name: "TraderExist",
                },
                {
                  index: 57,
                  name: "TransactionNotExist",
                },
                {
                  index: 58,
                  name: "ProcessingTransactionOfTraderExist",
                },
                {
                  index: 59,
                  name: "TraderNotHavePendingTransaction",
                },
                {
                  index: 60,
                  name: "NotPendingTransaction",
                },
                {
                  index: 61,
                  name: "ProcessingTransactionIdNotMatch",
                },
                {
                  index: 62,
                  name: "TraderNotHaveProcessingTransaction",
                },
                {
                  index: 63,
                  name: "NotProcessingTransaction",
                },
                {
                  index: 64,
                  name: "CannotBurn",
                },
                {
                  index: 65,
                  name: "NoAmount",
                },
              ],
            },
          },
          path: ["bridge_token_project", "traits", "error", "Error"],
        },
      },
      {
        id: 12,
        type: {
          def: {
            primitive: "str",
          },
        },
      },
      {
        id: 13,
        type: {
          def: {
            variant: {
              variants: [
                {
                  index: 0,
                  name: "CallerIsNotOwner",
                },
                {
                  index: 1,
                  name: "NewOwnerIsNotSet",
                },
              ],
            },
          },
          path: [
            "openbrush_contracts",
            "traits",
            "errors",
            "ownable",
            "OwnableError",
          ],
        },
      },
      {
        id: 14,
        type: {
          def: {
            variant: {
              variants: [
                {
                  index: 0,
                  name: "Paused",
                },
                {
                  index: 1,
                  name: "NotPaused",
                },
              ],
            },
          },
          path: [
            "openbrush_contracts",
            "traits",
            "errors",
            "pausable",
            "PausableError",
          ],
        },
      },
      {
        id: 15,
        type: {
          def: {
            variant: {
              variants: [
                {
                  index: 0,
                  name: "InvalidCaller",
                },
                {
                  index: 1,
                  name: "MissingRole",
                },
                {
                  index: 2,
                  name: "RoleRedundant",
                },
              ],
            },
          },
          path: [
            "openbrush_contracts",
            "traits",
            "errors",
            "access_control",
            "AccessControlError",
          ],
        },
      },
      {
        id: 16,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 12,
                      typeName: "String",
                    },
                  ],
                  index: 0,
                  name: "Custom",
                },
                {
                  index: 1,
                  name: "InsufficientBalance",
                },
                {
                  index: 2,
                  name: "InsufficientAllowance",
                },
                {
                  index: 3,
                  name: "RecipientIsNotSet",
                },
                {
                  index: 4,
                  name: "SenderIsNotSet",
                },
                {
                  fields: [
                    {
                      type: 12,
                      typeName: "String",
                    },
                  ],
                  index: 5,
                  name: "SafeTransferCheckFailed",
                },
                {
                  index: 6,
                  name: "PermitInvalidSignature",
                },
                {
                  index: 7,
                  name: "PermitExpired",
                },
                {
                  fields: [
                    {
                      type: 17,
                      typeName: "NoncesError",
                    },
                  ],
                  index: 8,
                  name: "NoncesError",
                },
              ],
            },
          },
          path: [
            "openbrush_contracts",
            "traits",
            "errors",
            "psp22",
            "PSP22Error",
          ],
        },
      },
      {
        id: 17,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 3,
                      typeName: "AccountId",
                    },
                    {
                      type: 18,
                      typeName: "u64",
                    },
                  ],
                  index: 0,
                  name: "InvalidAccountNonce",
                },
                {
                  index: 1,
                  name: "NonceOverflow",
                },
              ],
            },
          },
          path: [
            "openbrush_contracts",
            "traits",
            "errors",
            "nonces",
            "NoncesError",
          ],
        },
      },
      {
        id: 18,
        type: {
          def: {
            primitive: "u64",
          },
        },
      },
      {
        id: 19,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 12,
                      typeName: "String",
                    },
                  ],
                  index: 0,
                  name: "Custom",
                },
                {
                  index: 1,
                  name: "SelfApprove",
                },
                {
                  index: 2,
                  name: "NotApproved",
                },
                {
                  index: 3,
                  name: "TokenExists",
                },
                {
                  index: 4,
                  name: "TokenNotExists",
                },
                {
                  fields: [
                    {
                      type: 12,
                      typeName: "String",
                    },
                  ],
                  index: 5,
                  name: "SafeTransferCheckFailed",
                },
              ],
            },
          },
          path: [
            "openbrush_contracts",
            "traits",
            "errors",
            "psp34",
            "PSP34Error",
          ],
        },
      },
      {
        id: 20,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 21,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 8,
                    },
                  ],
                  index: 1,
                  name: "Err",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 21,
            },
            {
              name: "E",
              type: 8,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 21,
        type: {
          def: {
            variant: {
              variants: [
                {
                  index: 0,
                  name: "None",
                },
                {
                  fields: [
                    {
                      type: 6,
                    },
                  ],
                  index: 1,
                  name: "Some",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 6,
            },
          ],
          path: ["Option"],
        },
      },
      {
        id: 22,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 6,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 8,
                    },
                  ],
                  index: 1,
                  name: "Err",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 6,
            },
            {
              name: "E",
              type: 8,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 23,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 3,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 8,
                    },
                  ],
                  index: 1,
                  name: "Err",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 3,
            },
            {
              name: "E",
              type: 8,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 24,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 25,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 8,
                    },
                  ],
                  index: 1,
                  name: "Err",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 25,
            },
            {
              name: "E",
              type: 8,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 25,
        type: {
          def: {
            variant: {
              variants: [
                {
                  index: 0,
                  name: "None",
                },
                {
                  fields: [
                    {
                      type: 26,
                    },
                  ],
                  index: 1,
                  name: "Some",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 26,
            },
          ],
          path: ["Option"],
        },
      },
      {
        id: 26,
        type: {
          def: {
            composite: {
              fields: [
                {
                  name: "status",
                  type: 27,
                  typeName: "TransactionStatus",
                },
                {
                  name: "trader",
                  type: 3,
                  typeName: "AccountId",
                },
                {
                  name: "amount",
                  type: 6,
                  typeName: "Balance",
                },
                {
                  name: "receiver",
                  type: 3,
                  typeName: "AccountId",
                },
              ],
            },
          },
          path: [
            "bridge_token_project",
            "impls",
            "bridge_token",
            "data",
            "TransactionInformation",
          ],
        },
      },
      {
        id: 27,
        type: {
          def: {
            variant: {
              variants: [
                {
                  index: 0,
                  name: "Pending",
                },
                {
                  index: 1,
                  name: "Processing",
                },
                {
                  index: 2,
                  name: "Completed",
                },
                {
                  index: 3,
                  name: "Canceled",
                },
              ],
            },
          },
          path: [
            "bridge_token_project",
            "impls",
            "bridge_token",
            "data",
            "TransactionStatus",
          ],
        },
      },
      {
        id: 28,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 18,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 8,
                    },
                  ],
                  index: 1,
                  name: "Err",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 18,
            },
            {
              name: "E",
              type: 8,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 29,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 0,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 8,
                    },
                  ],
                  index: 1,
                  name: "Err",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 0,
            },
            {
              name: "E",
              type: 8,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 30,
        type: {
          def: {
            variant: {
              variants: [
                {
                  index: 0,
                  name: "None",
                },
                {
                  fields: [
                    {
                      type: 3,
                    },
                  ],
                  index: 1,
                  name: "Some",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 3,
            },
          ],
          path: ["Option"],
        },
      },
      {
        id: 31,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 32,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 8,
                    },
                  ],
                  index: 1,
                  name: "Err",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 32,
            },
            {
              name: "E",
              type: 8,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 32,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 1,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 15,
                    },
                  ],
                  index: 1,
                  name: "Err",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 1,
            },
            {
              name: "E",
              type: 15,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 33,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 2,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 8,
                    },
                  ],
                  index: 1,
                  name: "Err",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 2,
            },
            {
              name: "E",
              type: 8,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 34,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 30,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 8,
                    },
                  ],
                  index: 1,
                  name: "Err",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 30,
            },
            {
              name: "E",
              type: 8,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 35,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 36,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 8,
                    },
                  ],
                  index: 1,
                  name: "Err",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 36,
            },
            {
              name: "E",
              type: 8,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 36,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 1,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 13,
                    },
                  ],
                  index: 1,
                  name: "Err",
                },
              ],
            },
          },
          params: [
            {
              name: "T",
              type: 1,
            },
            {
              name: "E",
              type: 13,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 37,
        type: {
          def: {
            composite: {
              fields: [
                {
                  type: 4,
                  typeName: "[u8; 32]",
                },
              ],
            },
          },
          path: ["ink_primitives", "types", "Hash"],
        },
      },
      {
        id: 38,
        type: {
          def: {
            variant: {},
          },
          path: ["ink_env", "types", "NoChainExtension"],
        },
      },
    ],
    version: "4",
  },
};
export default fire_bridge_token_contract;
