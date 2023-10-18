const launchpad_generator = {
  CONTRACT_ADDRESS: "5H4DhP45H4eD872yhfWkBtJEVEDeT9c7ixr7QsRv6VG4yBgp",
  CONTRACT_ABI: {
    source: {
      hash: "0x738a9bd1dbe2e78cfdc6e8ad26ce2fc1b1ea52cb465417fc226d3ddd69e868c9",
      language: "ink! 4.3.0",
      compiler: "rustc 1.68.0",
      build_info: {
        build_mode: "Release",
        cargo_contract_version: "3.2.0",
        rust_toolchain: "stable-x86_64-unknown-linux-gnu",
        wasm_opt_settings: {
          keep_debug_symbols: false,
          optimization_passes: "Z",
        },
      },
    },
    contract: {
      name: "launchpad_generator",
      version: "1.0.0",
      authors: ["InkWhale <admin@artzero.io>"],
    },
    spec: {
      constructors: [
        {
          args: [
            {
              label: "launchpad_hash",
              type: {
                displayName: ["Hash"],
                type: 3,
              },
            },
            {
              label: "inw_contract",
              type: {
                displayName: ["AccountId"],
                type: 0,
              },
            },
            {
              label: "creation_fee",
              type: {
                displayName: ["Balance"],
                type: 4,
              },
            },
            {
              label: "tx_rate",
              type: {
                displayName: ["u32"],
                type: 5,
              },
            },
            {
              label: "admin_address",
              type: {
                displayName: ["AccountId"],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [],
          label: "new",
          payable: false,
          returnType: {
            displayName: ["ink_primitives", "ConstructorResult"],
            type: 10,
          },
          selector: "0x9bae9d5e",
        },
      ],
      docs: [],
      environment: {
        accountId: {
          displayName: ["AccountId"],
          type: 0,
        },
        balance: {
          displayName: ["Balance"],
          type: 4,
        },
        blockNumber: {
          displayName: ["BlockNumber"],
          type: 5,
        },
        chainExtension: {
          displayName: ["ChainExtension"],
          type: 39,
        },
        hash: {
          displayName: ["Hash"],
          type: 3,
        },
        maxEventTopics: 4,
        timestamp: {
          displayName: ["Timestamp"],
          type: 6,
        },
      },
      events: [],
      lang_error: {
        displayName: ["ink", "LangError"],
        type: 19,
      },
      messages: [
        {
          args: [
            {
              label: "project_info_uri",
              type: {
                displayName: ["String"],
                type: 13,
              },
            },
            {
              label: "token_address",
              type: {
                displayName: ["AccountId"],
                type: 0,
              },
            },
            {
              label: "total_supply",
              type: {
                displayName: ["Balance"],
                type: 4,
              },
            },
            {
              label: "phases",
              type: {
                displayName: ["Vec"],
                type: 20,
              },
            },
          ],
          default: false,
          docs: [],
          label: "new_launchpad",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 10,
          },
          selector: "0xfee9221d",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "LaunchpadGeneratorTrait::get_inw_contract",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 22,
          },
          selector: "0x356faef0",
        },
        {
          args: [
            {
              label: "id",
              type: {
                displayName: [
                  "launchpadgeneratortrait_external",
                  "GetLaunchpadByIdInput1",
                ],
                type: 6,
              },
            },
          ],
          default: false,
          docs: [],
          label: "LaunchpadGeneratorTrait::get_launchpad_by_id",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 23,
          },
          selector: "0x165393dc",
        },
        {
          args: [
            {
              label: "address",
              type: {
                displayName: [
                  "launchpadgeneratortrait_external",
                  "GetIsActiveLaunchpadInput1",
                ],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [],
          label: "LaunchpadGeneratorTrait::get_is_active_launchpad",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 25,
          },
          selector: "0xe638edfe",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "LaunchpadGeneratorTrait::get_tx_rate",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 27,
          },
          selector: "0x151595a1",
        },
        {
          args: [
            {
              label: "launchpad_hash",
              type: {
                displayName: [
                  "launchpadgeneratortrait_external",
                  "SetLaunchpadHashInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "LaunchpadGeneratorTrait::set_launchpad_hash",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 10,
          },
          selector: "0x7fe531cc",
        },
        {
          args: [
            {
              label: "inw_contract",
              type: {
                displayName: [
                  "launchpadgeneratortrait_external",
                  "SetInwContractInput1",
                ],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [],
          label: "LaunchpadGeneratorTrait::set_inw_contract",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 10,
          },
          selector: "0x159c7a23",
        },
        {
          args: [
            {
              label: "tx_rate",
              type: {
                displayName: [
                  "launchpadgeneratortrait_external",
                  "SetTxRateInput1",
                ],
                type: 5,
              },
            },
          ],
          default: false,
          docs: [],
          label: "LaunchpadGeneratorTrait::set_tx_rate",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 10,
          },
          selector: "0xdd198c6e",
        },
        {
          args: [
            {
              label: "creation_fee",
              type: {
                displayName: [
                  "launchpadgeneratortrait_external",
                  "SetCreationFeeInput1",
                ],
                type: 4,
              },
            },
          ],
          default: false,
          docs: [],
          label: "LaunchpadGeneratorTrait::set_creation_fee",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 10,
          },
          selector: "0xe96fc0d1",
        },
        {
          args: [
            {
              label: "address",
              type: {
                displayName: [
                  "launchpadgeneratortrait_external",
                  "SetIsActiveLaunchpadInput1",
                ],
                type: 0,
              },
            },
            {
              label: "is_active",
              type: {
                displayName: [
                  "launchpadgeneratortrait_external",
                  "SetIsActiveLaunchpadInput2",
                ],
                type: 8,
              },
            },
          ],
          default: false,
          docs: [],
          label: "LaunchpadGeneratorTrait::set_is_active_launchpad",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 10,
          },
          selector: "0x74afd096",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "LaunchpadGeneratorTrait::get_launchpad_count",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 28,
          },
          selector: "0xf0cb2510",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "LaunchpadGeneratorTrait::get_launchpad_hash",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 29,
          },
          selector: "0xbf42ec1e",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "LaunchpadGeneratorTrait::get_active_launchpad_count",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 28,
          },
          selector: "0xbc14706d",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "LaunchpadGeneratorTrait::get_creation_fee",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 30,
          },
          selector: "0xd6f68769",
        },
        {
          args: [
            {
              label: "owner_address",
              type: {
                displayName: [
                  "launchpadgeneratortrait_external",
                  "GetLaunchpadByOwnerInput1",
                ],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [],
          label: "LaunchpadGeneratorTrait::get_launchpad_by_owner",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 31,
          },
          selector: "0xd06c43d4",
        },
        {
          args: [
            {
              label: "psp22_contract_address",
              type: {
                displayName: ["admintrait_external", "TranferPsp22Input1"],
                type: 0,
              },
            },
            {
              label: "amount",
              type: {
                displayName: ["admintrait_external", "TranferPsp22Input2"],
                type: 4,
              },
            },
            {
              label: "receiver",
              type: {
                displayName: ["admintrait_external", "TranferPsp22Input3"],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [
            " This function allow contract owner withdraw PSP22 to an account in case there is any token sent to contract by mistake",
          ],
          label: "AdminTrait::tranfer_psp22",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 10,
          },
          selector: "0xd9aad284",
        },
        {
          args: [
            {
              label: "value",
              type: {
                displayName: ["admintrait_external", "WithdrawFeeInput1"],
                type: 4,
              },
            },
            {
              label: "receiver",
              type: {
                displayName: ["admintrait_external", "WithdrawFeeInput2"],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [
            " This function allows contract owner to withdraw contract balance to his account.",
          ],
          label: "AdminTrait::withdraw_fee",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 10,
          },
          selector: "0x07573e99",
        },
        {
          args: [],
          default: false,
          docs: [" Get Azero balance"],
          label: "AdminTrait::get_balance",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 32,
          },
          selector: "0xc4360570",
        },
        {
          args: [
            {
              label: "code_hash",
              type: {
                displayName: ["upgradeabletrait_external", "SetCodeInput1"],
                type: 1,
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
            type: 10,
          },
          selector: "0x9e32fab2",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "RevokeRoleInput1"],
                type: 5,
              },
            },
            {
              label: "account",
              type: {
                displayName: ["accesscontrol_external", "RevokeRoleInput2"],
                type: 24,
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
            type: 34,
          },
          selector: "0x6e4f0991",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "HasRoleInput1"],
                type: 5,
              },
            },
            {
              label: "address",
              type: {
                displayName: ["accesscontrol_external", "HasRoleInput2"],
                type: 24,
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
            type: 36,
          },
          selector: "0xc1d9ac18",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "GetRoleAdminInput1"],
                type: 5,
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
            type: 27,
          },
          selector: "0x83da3bb2",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "GrantRoleInput1"],
                type: 5,
              },
            },
            {
              label: "account",
              type: {
                displayName: ["accesscontrol_external", "GrantRoleInput2"],
                type: 24,
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
            type: 34,
          },
          selector: "0x4ac062fd",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "RenounceRoleInput1"],
                type: 5,
              },
            },
            {
              label: "account",
              type: {
                displayName: ["accesscontrol_external", "RenounceRoleInput2"],
                type: 24,
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
            type: 34,
          },
          selector: "0xeaf1248a",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: [
                  "accesscontrolenumerable_external",
                  "GetRoleMemberCountInput1",
                ],
                type: 5,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AccessControlEnumerable::get_role_member_count",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 27,
          },
          selector: "0xf1b1a9d7",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: [
                  "accesscontrolenumerable_external",
                  "GetRoleMemberInput1",
                ],
                type: 5,
              },
            },
            {
              label: "index",
              type: {
                displayName: [
                  "accesscontrolenumerable_external",
                  "GetRoleMemberInput2",
                ],
                type: 5,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AccessControlEnumerable::get_role_member",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 23,
          },
          selector: "0x163469e0",
        },
        {
          args: [
            {
              label: "new_owner",
              type: {
                displayName: ["ownable_external", "TransferOwnershipInput1"],
                type: 24,
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
            type: 37,
          },
          selector: "0x11f43efd",
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
            type: 23,
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
            type: 37,
          },
          selector: "0x5e228753",
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
                                            ty: 0,
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
                        name: "launchpad_hash",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 0,
                          },
                        },
                        name: "inw_contract",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 4,
                          },
                        },
                        name: "creation_fee",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 5,
                          },
                        },
                        name: "tx_rate",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 6,
                          },
                        },
                        name: "launchpad_count",
                      },
                      {
                        layout: {
                          root: {
                            layout: {
                              leaf: {
                                key: "0x7121e2a9",
                                ty: 0,
                              },
                            },
                            root_key: "0x7121e2a9",
                          },
                        },
                        name: "launchpad_by_id",
                      },
                      {
                        layout: {
                          root: {
                            layout: {
                              leaf: {
                                key: "0xd2bf375c",
                                ty: 7,
                              },
                            },
                            root_key: "0xd2bf375c",
                          },
                        },
                        name: "launchpad_by_owner",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 6,
                          },
                        },
                        name: "active_launchpad_count",
                      },
                      {
                        layout: {
                          root: {
                            layout: {
                              leaf: {
                                key: "0x15184c12",
                                ty: 8,
                              },
                            },
                            root_key: "0x15184c12",
                          },
                        },
                        name: "is_active_launchpad",
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
                                        ty: 9,
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
                name: "manager",
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
                                key: "0x1f2cf4ac",
                                ty: 5,
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
                                ty: 9,
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
                                key: "0x1eb9f2a8",
                                ty: 5,
                              },
                            },
                            root_key: "0x1eb9f2a8",
                          },
                        },
                        name: "admin_roles",
                      },
                      {
                        layout: {
                          root: {
                            layout: {
                              enum: {
                                dispatchKey: "0x869d6fc0",
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
                                            key: "0x869d6fc0",
                                            ty: 0,
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
                            root_key: "0x869d6fc0",
                          },
                        },
                        name: "role_members",
                      },
                    ],
                    name: "Data",
                  },
                },
                name: "enumerable",
              },
            ],
            name: "LaunchpadGenerator",
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
            composite: {
              fields: [
                {
                  type: 1,
                  typeName: "[u8; 32]",
                },
              ],
            },
          },
          path: ["ink_primitives", "types", "AccountId"],
        },
      },
      {
        id: 1,
        type: {
          def: {
            array: {
              len: 32,
              type: 2,
            },
          },
        },
      },
      {
        id: 2,
        type: {
          def: {
            primitive: "u8",
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
                  type: 1,
                  typeName: "[u8; 32]",
                },
              ],
            },
          },
          path: ["ink_primitives", "types", "Hash"],
        },
      },
      {
        id: 4,
        type: {
          def: {
            primitive: "u128",
          },
        },
      },
      {
        id: 5,
        type: {
          def: {
            primitive: "u32",
          },
        },
      },
      {
        id: 6,
        type: {
          def: {
            primitive: "u64",
          },
        },
      },
      {
        id: 7,
        type: {
          def: {
            sequence: {
              type: 0,
            },
          },
        },
      },
      {
        id: 8,
        type: {
          def: {
            primitive: "bool",
          },
        },
      },
      {
        id: 9,
        type: {
          def: {
            tuple: [],
          },
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
                      type: 11,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 19,
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
              type: 11,
            },
            {
              name: "E",
              type: 19,
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
                      type: 9,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 12,
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
              type: 9,
            },
            {
              name: "E",
              type: 12,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 12,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 13,
                      typeName: "String",
                    },
                  ],
                  index: 0,
                  name: "Custom",
                },
                {
                  fields: [
                    {
                      type: 14,
                      typeName: "OwnableError",
                    },
                  ],
                  index: 1,
                  name: "OwnableError",
                },
                {
                  fields: [
                    {
                      type: 15,
                      typeName: "AccessControlError",
                    },
                  ],
                  index: 2,
                  name: "AccessControlError",
                },
                {
                  fields: [
                    {
                      type: 16,
                      typeName: "PSP22Error",
                    },
                  ],
                  index: 3,
                  name: "PSP22Error",
                },
                {
                  fields: [
                    {
                      type: 18,
                      typeName: "PSP34Error",
                    },
                  ],
                  index: 4,
                  name: "PSP34Error",
                },
                {
                  index: 5,
                  name: "NotEnoughBalance",
                },
                {
                  index: 6,
                  name: "WithdrawFeeError",
                },
                {
                  index: 7,
                  name: "NotCallable",
                },
                {
                  index: 8,
                  name: "CannotTransfer",
                },
                {
                  index: 9,
                  name: "CannotBurn",
                },
                {
                  index: 10,
                  name: "CheckedOperations",
                },
                {
                  index: 11,
                  name: "InvalidBalanceAndAllowance",
                },
                {
                  index: 12,
                  name: "AlreadyInit",
                },
                {
                  index: 13,
                  name: "InvalidBuyAmount",
                },
                {
                  index: 14,
                  name: "InvalidTransferAmount",
                },
                {
                  index: 15,
                  name: "CannotCreatePool",
                },
                {
                  index: 16,
                  name: "NotTimeToStake",
                },
                {
                  index: 17,
                  name: "NoStakerFound",
                },
                {
                  index: 18,
                  name: "InvalidUnstakedAmount",
                },
                {
                  index: 19,
                  name: "NotEnoughReward",
                },
                {
                  index: 20,
                  name: "NotTokenOwner",
                },
                {
                  index: 21,
                  name: "AllowanceNotSet",
                },
                {
                  index: 22,
                  name: "TokenNotFound",
                },
                {
                  index: 23,
                  name: "UserNotStake",
                },
                {
                  index: 24,
                  name: "NoTokenOwner",
                },
                {
                  index: 25,
                  name: "ExceedTotalStakingAmount",
                },
                {
                  index: 26,
                  name: "NoClaimAmount",
                },
                {
                  index: 27,
                  name: "NotTimeToWithdraw",
                },
                {
                  index: 28,
                  name: "NotEnoughRewardToWithdraw",
                },
                {
                  index: 29,
                  name: "NotTopupEnoughReward",
                },
                {
                  index: 30,
                  name: "NoAmount",
                },
                {
                  index: 31,
                  name: "InvalidTokenBalanceAndAllowance",
                },
                {
                  index: 32,
                  name: "CannotApprove",
                },
                {
                  index: 33,
                  name: "CannotTopupRewardPool",
                },
                {
                  index: 34,
                  name: "NotTimeToPurchase",
                },
                {
                  index: 35,
                  name: "NotTimeToClaim",
                },
                {
                  index: 36,
                  name: "NotTimeToBurn",
                },
                {
                  index: 37,
                  name: "NoTokenPurchased",
                },
                {
                  index: 38,
                  name: "AlreadyBurnt",
                },
                {
                  index: 39,
                  name: "InvalidTime",
                },
                {
                  index: 40,
                  name: "InvalidPercentage",
                },
                {
                  index: 41,
                  name: "InvalidDuration",
                },
                {
                  index: 42,
                  name: "InvalidVestingUnit",
                },
                {
                  index: 43,
                  name: "InvalidTopupAmount",
                },
                {
                  index: 44,
                  name: "LaunchpadNotExist",
                },
                {
                  index: 45,
                  name: "InvalidIsActiveInput",
                },
                {
                  index: 46,
                  name: "InvalidCreationFee",
                },
                {
                  index: 47,
                  name: "InvalidTxRate",
                },
                {
                  index: 48,
                  name: "InvalidPhaseData",
                },
                {
                  index: 49,
                  name: "CannotTopupToken",
                },
                {
                  index: 50,
                  name: "InvalidStartTimeAndEndTime",
                },
                {
                  index: 51,
                  name: "InvalidPhaseCount",
                },
                {
                  index: 52,
                  name: "InvalidMaxStakingAmount",
                },
                {
                  index: 53,
                  name: "InvalidApy",
                },
                {
                  index: 54,
                  name: "InvalidMultiplier",
                },
                {
                  index: 55,
                  name: "InvalidWhitelistData",
                },
                {
                  index: 56,
                  name: "PhaseNotExist",
                },
                {
                  index: 57,
                  name: "PhaseNotActive",
                },
                {
                  index: 58,
                  name: "WhitelistBuyerInfoNotExist",
                },
                {
                  index: 59,
                  name: "WhitelistBuyerInfoExist",
                },
                {
                  index: 60,
                  name: "WhitelistBuyerPurchased",
                },
                {
                  index: 61,
                  name: "WhitelistSaleInfoNotExist",
                },
                {
                  index: 62,
                  name: "WhitelistPhaseAccountNotExist",
                },
                {
                  index: 63,
                  name: "PublicSaleInfoNotExist",
                },
                {
                  index: 64,
                  name: "InvalidSetActive",
                },
                {
                  index: 65,
                  name: "InvalidTotalAmount",
                },
                {
                  index: 66,
                  name: "CannotTransferTxFee",
                },
                {
                  index: 67,
                  name: "ActiveLaunchpadStatusNotFound",
                },
                {
                  index: 68,
                  name: "LaunchpadNotActive",
                },
                {
                  index: 69,
                  name: "InvalidCaller",
                },
                {
                  index: 70,
                  name: "NoPhaseActive",
                },
                {
                  index: 71,
                  name: "InvalidTotalSupply",
                },
                {
                  index: 72,
                  name: "PhaseNotPublic",
                },
                {
                  index: 73,
                  name: "InvalidSetPublic",
                },
                {
                  index: 74,
                  name: "InvalidCapAmount",
                },
              ],
            },
          },
          path: ["inkwhale_project", "traits", "error", "Error"],
        },
      },
      {
        id: 13,
        type: {
          def: {
            primitive: "str",
          },
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
                      type: 13,
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
                      type: 13,
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
                      type: 0,
                      typeName: "AccountId",
                    },
                    {
                      type: 6,
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
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 13,
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
                      type: 13,
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
        id: 19,
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
        id: 20,
        type: {
          def: {
            sequence: {
              type: 21,
            },
          },
        },
      },
      {
        id: 21,
        type: {
          def: {
            composite: {
              fields: [
                {
                  name: "name",
                  type: 13,
                  typeName: "String",
                },
                {
                  name: "start_time",
                  type: 6,
                  typeName: "u64",
                },
                {
                  name: "end_time",
                  type: 6,
                  typeName: "u64",
                },
                {
                  name: "immediate_release_rate",
                  type: 5,
                  typeName: "u32",
                },
                {
                  name: "vesting_duration",
                  type: 6,
                  typeName: "u64",
                },
                {
                  name: "vesting_unit",
                  type: 6,
                  typeName: "u64",
                },
                {
                  name: "cap_amount",
                  type: 4,
                  typeName: "Balance",
                },
                {
                  name: "is_public",
                  type: 8,
                  typeName: "bool",
                },
                {
                  name: "public_amount",
                  type: 4,
                  typeName: "Balance",
                },
                {
                  name: "public_price",
                  type: 4,
                  typeName: "Balance",
                },
              ],
            },
          },
          path: [
            "inkwhale_project",
            "impls",
            "launchpad_contract",
            "data",
            "PhaseInput",
          ],
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
                      type: 0,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 19,
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
              type: 19,
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
                      type: 24,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 19,
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
              type: 24,
            },
            {
              name: "E",
              type: 19,
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
                  index: 0,
                  name: "None",
                },
                {
                  fields: [
                    {
                      type: 0,
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
              type: 0,
            },
          ],
          path: ["Option"],
        },
      },
      {
        id: 25,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 26,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 19,
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
              type: 26,
            },
            {
              name: "E",
              type: 19,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 26,
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
                      type: 8,
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
              type: 8,
            },
          ],
          path: ["Option"],
        },
      },
      {
        id: 27,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 5,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 19,
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
              type: 5,
            },
            {
              name: "E",
              type: 19,
            },
          ],
          path: ["Result"],
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
                      type: 6,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 19,
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
              type: 19,
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
                      type: 3,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 19,
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
              type: 19,
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
                  fields: [
                    {
                      type: 4,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 19,
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
              type: 4,
            },
            {
              name: "E",
              type: 19,
            },
          ],
          path: ["Result"],
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
                      type: 7,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 19,
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
              type: 7,
            },
            {
              name: "E",
              type: 19,
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
                      type: 33,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 19,
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
              type: 33,
            },
            {
              name: "E",
              type: 19,
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
                      type: 4,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 12,
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
              type: 4,
            },
            {
              name: "E",
              type: 12,
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
                      type: 35,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 19,
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
              type: 35,
            },
            {
              name: "E",
              type: 19,
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
                      type: 9,
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
              type: 9,
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
        id: 36,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 8,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 19,
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
              type: 8,
            },
            {
              name: "E",
              type: 19,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 37,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 38,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 19,
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
              type: 38,
            },
            {
              name: "E",
              type: 19,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 38,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 9,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 14,
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
              type: 9,
            },
            {
              name: "E",
              type: 14,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 39,
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

export default launchpad_generator;
