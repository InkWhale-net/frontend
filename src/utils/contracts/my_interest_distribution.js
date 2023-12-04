const my_interest_distribution = {
  CONTRACT_ADDRESS: "5H8ip2uNJZBzU2r3VTGFqha5JqCgCMHXCRYczoSvYBZncQHj",
  CONTRACT_ABI: {
    source: {
      hash: "0x08bcac8aad5d66e47415134a52537f9662867ed9a2131dfbeca8b0d0df7d9c8a",
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
      name: "my_interest_distribution",
      version: "1.0.0",
      authors: ["InkWhale <admin@artzero.io>"],
    },
    spec: {
      constructors: [
        {
          args: [
            {
              label: "inw_contract",
              type: {
                displayName: ["AccountId"],
                type: 0,
              },
            },
            {
              label: "azero_staking_contract",
              type: {
                displayName: ["AccountId"],
                type: 0,
              },
            },
            {
              label: "master_account",
              type: {
                displayName: ["AccountId"],
                type: 0,
              },
            },
            {
              label: "total_rate",
              type: {
                displayName: ["u64"],
                type: 3,
              },
            },
            {
              label: "interest_account_rate",
              type: {
                displayName: ["u64"],
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
            type: 6,
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
          type: 19,
        },
        blockNumber: {
          displayName: ["BlockNumber"],
          type: 4,
        },
        chainExtension: {
          displayName: ["ChainExtension"],
          type: 33,
        },
        hash: {
          displayName: ["Hash"],
          type: 32,
        },
        maxEventTopics: 4,
        timestamp: {
          displayName: ["Timestamp"],
          type: 3,
        },
      },
      events: [],
      lang_error: {
        displayName: ["ink", "LangError"],
        type: 16,
      },
      messages: [
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
            type: 6,
          },
          selector: "0x9e32fab2",
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
            type: 17,
          },
          selector: "0xc4360570",
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
                type: 19,
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
            type: 6,
          },
          selector: "0xd9aad284",
        },
        {
          args: [
            {
              label: "value",
              type: {
                displayName: ["admintrait_external", "WithdrawFeeInput1"],
                type: 19,
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
            type: 6,
          },
          selector: "0x07573e99",
        },
        {
          args: [
            {
              label: "interest_account_rate",
              type: {
                displayName: [
                  "interestdistributiontrait_external",
                  "SetInterestAccountRateInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "InterestDistributionTrait::set_interest_account_rate",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 6,
          },
          selector: "0x30e95acf",
        },
        {
          args: [
            {
              label: "amount",
              type: {
                displayName: [
                  "interestdistributiontrait_external",
                  "DistributeInwRewardInput1",
                ],
                type: 19,
              },
            },
          ],
          default: false,
          docs: [],
          label: "InterestDistributionTrait::distribute_inw_reward",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 6,
          },
          selector: "0x9a354382",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "InterestDistributionTrait::get_azero_staking_contract",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0x5819cac9",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "InterestDistributionTrait::get_master_account",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0x91a1c2eb",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "InterestDistributionTrait::get_inw_contract",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0x63f699f9",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "InterestDistributionTrait::get_azero_minimum_balance",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 21,
          },
          selector: "0xd1faf01d",
        },
        {
          args: [
            {
              label: "inw_contract",
              type: {
                displayName: [
                  "interestdistributiontrait_external",
                  "SetInwContractInput1",
                ],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [],
          label: "InterestDistributionTrait::set_inw_contract",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 6,
          },
          selector: "0xc2c9c903",
        },
        {
          args: [
            {
              label: "master_account",
              type: {
                displayName: [
                  "interestdistributiontrait_external",
                  "SetMasterAccountInput1",
                ],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [],
          label: "InterestDistributionTrait::set_master_account",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 6,
          },
          selector: "0xdba1cc84",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "InterestDistributionTrait::get_total_rate",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 22,
          },
          selector: "0x55ef99cc",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "InterestDistributionTrait::get_azero_balance",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 21,
          },
          selector: "0x07a81ca2",
        },
        {
          args: [
            {
              label: "total_rate",
              type: {
                displayName: [
                  "interestdistributiontrait_external",
                  "SetTotalRateInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "InterestDistributionTrait::set_total_rate",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 6,
          },
          selector: "0x1ea0ae5f",
        },
        {
          args: [
            {
              label: "azero_staking_contract",
              type: {
                displayName: [
                  "interestdistributiontrait_external",
                  "SetAzeroStakingContractInput1",
                ],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [],
          label: "InterestDistributionTrait::set_azero_staking_contract",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 6,
          },
          selector: "0x77b08da0",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "InterestDistributionTrait::get_interest_account_rate",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 22,
          },
          selector: "0xbaaa0723",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "InterestDistributionTrait::distribute_azero",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 6,
          },
          selector: "0x2707bb36",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "RenounceRoleInput1"],
                type: 4,
              },
            },
            {
              label: "account",
              type: {
                displayName: ["accesscontrol_external", "RenounceRoleInput2"],
                type: 23,
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
            type: 24,
          },
          selector: "0xeaf1248a",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "RevokeRoleInput1"],
                type: 4,
              },
            },
            {
              label: "account",
              type: {
                displayName: ["accesscontrol_external", "RevokeRoleInput2"],
                type: 23,
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
            type: 24,
          },
          selector: "0x6e4f0991",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "GetRoleAdminInput1"],
                type: 4,
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
            type: 26,
          },
          selector: "0x83da3bb2",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "GrantRoleInput1"],
                type: 4,
              },
            },
            {
              label: "account",
              type: {
                displayName: ["accesscontrol_external", "GrantRoleInput2"],
                type: 23,
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
            type: 24,
          },
          selector: "0x4ac062fd",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "HasRoleInput1"],
                type: 4,
              },
            },
            {
              label: "address",
              type: {
                displayName: ["accesscontrol_external", "HasRoleInput2"],
                type: 23,
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
            type: 27,
          },
          selector: "0xc1d9ac18",
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
                type: 4,
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
            type: 26,
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
                type: 4,
              },
            },
            {
              label: "index",
              type: {
                displayName: [
                  "accesscontrolenumerable_external",
                  "GetRoleMemberInput2",
                ],
                type: 4,
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
            type: 29,
          },
          selector: "0x163469e0",
        },
        {
          args: [
            {
              label: "new_owner",
              type: {
                displayName: ["ownable_external", "TransferOwnershipInput1"],
                type: 23,
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
            type: 30,
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
            type: 29,
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
            type: 30,
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
                            ty: 0,
                          },
                        },
                        name: "inw_contract",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 0,
                          },
                        },
                        name: "azero_staking_contract",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 0,
                          },
                        },
                        name: "master_account",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "total_rate",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "interest_account_rate",
                      },
                    ],
                    name: "Data",
                  },
                },
                name: "data",
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
                                ty: 4,
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
                                ty: 5,
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
                                ty: 4,
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
            name: "MyInterestDistribution",
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
            primitive: "u64",
          },
        },
      },
      {
        id: 4,
        type: {
          def: {
            primitive: "u32",
          },
        },
      },
      {
        id: 5,
        type: {
          def: {
            tuple: [],
          },
        },
      },
      {
        id: 6,
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
                      type: 16,
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
              type: 16,
            },
          ],
          path: ["Result"],
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
                      type: 5,
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
              type: 5,
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
                  fields: [
                    {
                      type: 9,
                      typeName: "String",
                    },
                  ],
                  index: 0,
                  name: "Custom",
                },
                {
                  fields: [
                    {
                      type: 10,
                      typeName: "OwnableError",
                    },
                  ],
                  index: 1,
                  name: "OwnableError",
                },
                {
                  fields: [
                    {
                      type: 11,
                      typeName: "AccessControlError",
                    },
                  ],
                  index: 2,
                  name: "AccessControlError",
                },
                {
                  fields: [
                    {
                      type: 12,
                      typeName: "PSP22Error",
                    },
                  ],
                  index: 3,
                  name: "PSP22Error",
                },
                {
                  fields: [
                    {
                      type: 14,
                      typeName: "PSP34Error",
                    },
                  ],
                  index: 4,
                  name: "PSP34Error",
                },
                {
                  fields: [
                    {
                      type: 15,
                      typeName: "PausableError",
                    },
                  ],
                  index: 5,
                  name: "PausableError",
                },
                {
                  index: 6,
                  name: "NotEnoughBalance",
                },
                {
                  index: 7,
                  name: "WithdrawFeeError",
                },
                {
                  index: 8,
                  name: "NotCallable",
                },
                {
                  index: 9,
                  name: "CannotTransfer",
                },
                {
                  index: 10,
                  name: "CannotBurn",
                },
                {
                  index: 11,
                  name: "CheckedOperations",
                },
                {
                  index: 12,
                  name: "InvalidBalanceAndAllowance",
                },
                {
                  index: 13,
                  name: "AlreadyInit",
                },
                {
                  index: 14,
                  name: "InvalidBuyAmount",
                },
                {
                  index: 15,
                  name: "InvalidTransferAmount",
                },
                {
                  index: 16,
                  name: "CannotCreatePool",
                },
                {
                  index: 17,
                  name: "NotTimeToStake",
                },
                {
                  index: 18,
                  name: "NoStakerFound",
                },
                {
                  index: 19,
                  name: "InvalidUnstakedAmount",
                },
                {
                  index: 20,
                  name: "NotEnoughReward",
                },
                {
                  index: 21,
                  name: "NotTokenOwner",
                },
                {
                  index: 22,
                  name: "AllowanceNotSet",
                },
                {
                  index: 23,
                  name: "TokenNotFound",
                },
                {
                  index: 24,
                  name: "UserNotStake",
                },
                {
                  index: 25,
                  name: "NoTokenOwner",
                },
                {
                  index: 26,
                  name: "ExceedTotalStakingAmount",
                },
                {
                  index: 27,
                  name: "NoClaimAmount",
                },
                {
                  index: 28,
                  name: "NotTimeToWithdraw",
                },
                {
                  index: 29,
                  name: "NotEnoughRewardToWithdraw",
                },
                {
                  index: 30,
                  name: "NotTopupEnoughReward",
                },
                {
                  index: 31,
                  name: "NoAmount",
                },
                {
                  index: 32,
                  name: "InvalidTokenBalanceAndAllowance",
                },
                {
                  index: 33,
                  name: "CannotApprove",
                },
                {
                  index: 34,
                  name: "CannotTopupRewardPool",
                },
                {
                  index: 35,
                  name: "NotTimeToPurchase",
                },
                {
                  index: 36,
                  name: "NotTimeToClaim",
                },
                {
                  index: 37,
                  name: "NotTimeToBurn",
                },
                {
                  index: 38,
                  name: "NoTokenPurchased",
                },
                {
                  index: 39,
                  name: "AlreadyBurnt",
                },
                {
                  index: 40,
                  name: "InvalidTime",
                },
                {
                  index: 41,
                  name: "InvalidPercentage",
                },
                {
                  index: 42,
                  name: "InvalidDuration",
                },
                {
                  index: 43,
                  name: "InvalidVestingUnit",
                },
                {
                  index: 44,
                  name: "InvalidTopupAmount",
                },
                {
                  index: 45,
                  name: "LaunchpadNotExist",
                },
                {
                  index: 46,
                  name: "InvalidIsActiveInput",
                },
                {
                  index: 47,
                  name: "InvalidCreationFee",
                },
                {
                  index: 48,
                  name: "InvalidTxRate",
                },
                {
                  index: 49,
                  name: "InvalidPhaseData",
                },
                {
                  index: 50,
                  name: "CannotTopupToken",
                },
                {
                  index: 51,
                  name: "InvalidStartTimeAndEndTime",
                },
                {
                  index: 52,
                  name: "InvalidPhaseCount",
                },
                {
                  index: 53,
                  name: "InvalidMaxStakingAmount",
                },
                {
                  index: 54,
                  name: "InvalidApy",
                },
                {
                  index: 55,
                  name: "InvalidMultiplier",
                },
                {
                  index: 56,
                  name: "InvalidWhitelistData",
                },
                {
                  index: 57,
                  name: "PhaseNotExist",
                },
                {
                  index: 58,
                  name: "PhaseNotActive",
                },
                {
                  index: 59,
                  name: "WhitelistBuyerInfoNotExist",
                },
                {
                  index: 60,
                  name: "WhitelistBuyerInfoExist",
                },
                {
                  index: 61,
                  name: "WhitelistBuyerPurchased",
                },
                {
                  index: 62,
                  name: "WhitelistSaleInfoNotExist",
                },
                {
                  index: 63,
                  name: "WhitelistPhaseAccountNotExist",
                },
                {
                  index: 64,
                  name: "PublicSaleInfoNotExist",
                },
                {
                  index: 65,
                  name: "InvalidSetActive",
                },
                {
                  index: 66,
                  name: "InvalidTotalAmount",
                },
                {
                  index: 67,
                  name: "CannotTransferTxFee",
                },
                {
                  index: 68,
                  name: "ActiveLaunchpadStatusNotFound",
                },
                {
                  index: 69,
                  name: "LaunchpadNotActive",
                },
                {
                  index: 70,
                  name: "InvalidCaller",
                },
                {
                  index: 71,
                  name: "NoPhaseActive",
                },
                {
                  index: 72,
                  name: "InvalidTotalSupply",
                },
                {
                  index: 73,
                  name: "PhaseNotPublic",
                },
                {
                  index: 74,
                  name: "InvalidSetPublic",
                },
                {
                  index: 75,
                  name: "InvalidMinStakingAmount",
                },
                {
                  index: 76,
                  name: "InvalidMaxWaitingTime",
                },
                {
                  index: 77,
                  name: "InvalidUnstakingFee",
                },
                {
                  index: 78,
                  name: "BelowMinStakingMount",
                },
                {
                  index: 79,
                  name: "ExceedMaxTotalStakingMount",
                },
                {
                  index: 80,
                  name: "WithdrawalRequestIsNotClaimable",
                },
                {
                  index: 81,
                  name: "WithdrawError",
                },
                {
                  index: 82,
                  name: "RequestNotForClaimer",
                },
                {
                  index: 83,
                  name: "NoWithdrawalRequestInfo",
                },
                {
                  index: 84,
                  name: "NoStakeInfoFound",
                },
                {
                  index: 85,
                  name: "CannotGetWaitingList",
                },
                {
                  index: 86,
                  name: "CannotGetWithdrawableAmount",
                },
                {
                  index: 87,
                  name: "InvalidWithdrawalAmount",
                },
                {
                  index: 88,
                  name: "CannotUpdateUnclaimedRewards",
                },
                {
                  index: 89,
                  name: "CannotUpdateLastUnclaimedRewards",
                },
                {
                  index: 90,
                  name: "InvalidCapAmount",
                },
                {
                  index: 91,
                  name: "InvalidWhitelistAmount",
                },
                {
                  index: 92,
                  name: "CapExceeded",
                },
                {
                  index: 93,
                  name: "CannotCollectInwV1",
                },
                {
                  index: 94,
                  name: "InvalidWithdrawalRequestStatus",
                },
                {
                  index: 95,
                  name: "InvalidWaitingRequestIndex",
                },
                {
                  index: 96,
                  name: "IsNotWithdrawable",
                },
                {
                  index: 97,
                  name: "CannotCollectInwV2",
                },
                {
                  index: 98,
                  name: "CannotMintInwV2",
                },
                {
                  index: 99,
                  name: "CannotTransferInwV1",
                },
                {
                  index: 100,
                  name: "InvalidIsLockedInput",
                },
                {
                  index: 101,
                  name: "InvalidTimeToClaimRewards",
                },
                {
                  index: 102,
                  name: "NotEnoughAzeroReward",
                },
                {
                  index: 103,
                  name: "NotEnoughInwReward",
                },
                {
                  index: 104,
                  name: "RequestToClaimRewardsFirst",
                },
                {
                  index: 105,
                  name: "InvalidTotalRate",
                },
                {
                  index: 106,
                  name: "InvalidInterestAccountRate",
                },
                {
                  index: 107,
                  name: "NoAzeroToDistribute",
                },
                {
                  index: 108,
                  name: "CannotTopupAzeroInterestAccount",
                },
                {
                  index: 109,
                  name: "NoNewAzeroTopup",
                },
                {
                  index: 110,
                  name: "NotInterestDistributionContract",
                },
                {
                  index: 111,
                  name: "NotAzeroStakingContract",
                },
                {
                  index: 112,
                  name: "CannotTransferToInterestAccount",
                },
                {
                  index: 113,
                  name: "CannotTransferToMasterAccount",
                },
                {
                  index: 114,
                  name: "CheckedOperationsTimeLength",
                },
                {
                  index: 115,
                  name: "CheckedOperationsAzeroInterestAccount",
                },
                {
                  index: 116,
                  name: "CheckedOperationsInwInterestAccount",
                },
                {
                  index: 117,
                  name: "CheckedOperationsUnclaimedAzeroReward",
                },
                {
                  index: 118,
                  name: "CheckedOperationsUnclaimedInwReward",
                },
              ],
            },
          },
          path: ["inkwhale_project", "traits", "error", "Error"],
        },
      },
      {
        id: 9,
        type: {
          def: {
            primitive: "str",
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
        id: 11,
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
        id: 12,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 9,
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
                      type: 9,
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
                      type: 13,
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
        id: 13,
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
                      type: 3,
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
        id: 14,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 9,
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
                      type: 9,
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
        id: 15,
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
        id: 16,
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
        id: 17,
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
                      type: 16,
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
              type: 16,
            },
          ],
          path: ["Result"],
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
                      type: 19,
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
              type: 19,
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
        id: 19,
        type: {
          def: {
            primitive: "u128",
          },
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
                      type: 0,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 16,
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
              type: 16,
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
                  fields: [
                    {
                      type: 19,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 16,
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
              type: 19,
            },
            {
              name: "E",
              type: 16,
            },
          ],
          path: ["Result"],
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
                      type: 3,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 16,
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
              type: 16,
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
                      type: 16,
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
              type: 16,
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
              type: 5,
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
        id: 26,
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
                      type: 16,
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
              type: 16,
            },
          ],
          path: ["Result"],
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
                      type: 28,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 16,
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
              type: 28,
            },
            {
              name: "E",
              type: 16,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 28,
        type: {
          def: {
            primitive: "bool",
          },
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
                      type: 23,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 16,
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
              type: 23,
            },
            {
              name: "E",
              type: 16,
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
                      type: 31,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 16,
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
              type: 31,
            },
            {
              name: "E",
              type: 16,
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
                      type: 5,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 10,
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
              type: 10,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 32,
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
        id: 33,
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

export default my_interest_distribution;
