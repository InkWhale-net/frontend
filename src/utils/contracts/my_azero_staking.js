const my_azero_staking = {
  CONTRACT_ADDRESS: "5FaYr75B7gRoTiDj92bxKCZ8SuxrEHUBpHQNu7pnbWffRVNH",
  CONTRACT_ABI: {
    source: {
      hash: "0x235c49ad77d40cf03dc61423164e2b2b733a1863d99eea0972a6f9fc1f155efc",
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
      name: "my_azero_staking",
      version: "1.0.0",
      authors: ["InkWhale <admin@artzero.io>"],
    },
    spec: {
      constructors: [
        {
          args: [
            {
              label: "min_staking_amount",
              type: {
                displayName: ["Balance"],
                type: 3,
              },
            },
            {
              label: "max_total_staking_amount",
              type: {
                displayName: ["Balance"],
                type: 3,
              },
            },
            {
              label: "apy",
              type: {
                displayName: ["Balance"],
                type: 3,
              },
            },
            {
              label: "max_waiting_time",
              type: {
                displayName: ["u64"],
                type: 4,
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
              label: "inw_multiplier",
              type: {
                displayName: ["Balance"],
                type: 3,
              },
            },
            {
              label: "unstaking_fee",
              type: {
                displayName: ["Balance"],
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
            type: 8,
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
          type: 3,
        },
        blockNumber: {
          displayName: ["BlockNumber"],
          type: 6,
        },
        chainExtension: {
          displayName: ["ChainExtension"],
          type: 50,
        },
        hash: {
          displayName: ["Hash"],
          type: 49,
        },
        maxEventTopics: 4,
        timestamp: {
          displayName: ["Timestamp"],
          type: 4,
        },
      },
      events: [
        {
          args: [
            {
              docs: [],
              indexed: false,
              label: "staker",
              type: {
                displayName: ["AccountId"],
                type: 0,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "amount",
              type: {
                displayName: ["Balance"],
                type: 3,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "time",
              type: {
                displayName: ["u64"],
                type: 4,
              },
            },
          ],
          docs: [],
          label: "StakeEvent",
        },
        {
          args: [
            {
              docs: [],
              indexed: false,
              label: "request_id",
              type: {
                displayName: ["u128"],
                type: 3,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "user",
              type: {
                displayName: ["AccountId"],
                type: 0,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "amount",
              type: {
                displayName: ["Balance"],
                type: 3,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "azero_reward",
              type: {
                displayName: ["Balance"],
                type: 3,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "inw_reward",
              type: {
                displayName: ["Balance"],
                type: 3,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "time",
              type: {
                displayName: ["u64"],
                type: 4,
              },
            },
          ],
          docs: [],
          label: "WithrawalRequestEvent",
        },
        {
          args: [
            {
              docs: [],
              indexed: false,
              label: "request_id",
              type: {
                displayName: ["u128"],
                type: 3,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "user",
              type: {
                displayName: ["AccountId"],
                type: 0,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "azero_amount",
              type: {
                displayName: ["Balance"],
                type: 3,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "inw_amount",
              type: {
                displayName: ["Balance"],
                type: 3,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "time",
              type: {
                displayName: ["u64"],
                type: 4,
              },
            },
          ],
          docs: [],
          label: "ClaimEvent",
        },
        {
          args: [
            {
              docs: [],
              indexed: false,
              label: "caller",
              type: {
                displayName: ["AccountId"],
                type: 0,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "receiver",
              type: {
                displayName: ["AccountId"],
                type: 0,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "amount",
              type: {
                displayName: ["Balance"],
                type: 3,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "time",
              type: {
                displayName: ["u64"],
                type: 4,
              },
            },
          ],
          docs: [],
          label: "WithdrawAzeroToStakeEvent",
        },
        {
          args: [
            {
              docs: [],
              indexed: false,
              label: "receiver",
              type: {
                displayName: ["AccountId"],
                type: 0,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "amount",
              type: {
                displayName: ["Balance"],
                type: 3,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "time",
              type: {
                displayName: ["u64"],
                type: 4,
              },
            },
          ],
          docs: [],
          label: "WithdrawAzeroEvent",
        },
        {
          args: [
            {
              docs: [],
              indexed: false,
              label: "receiver",
              type: {
                displayName: ["AccountId"],
                type: 0,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "amount",
              type: {
                displayName: ["Balance"],
                type: 3,
              },
            },
            {
              docs: [],
              indexed: false,
              label: "time",
              type: {
                displayName: ["u64"],
                type: 4,
              },
            },
          ],
          docs: [],
          label: "WithdrawInwEvent",
        },
      ],
      lang_error: {
        displayName: ["ink", "LangError"],
        type: 17,
      },
      messages: [
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_waiting_withdrawal_list",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 18,
          },
          selector: "0x8c3b79ff",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_total_inw_claimed",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0xe179dab6",
        },
        {
          args: [
            {
              label: "inw_multiplier",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "SetInwMultiplierInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::set_inw_multiplier",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 8,
          },
          selector: "0x1cf13874",
        },
        {
          args: [
            {
              label: "expiration_duration",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "SelectRequestsToPayInput1",
                ],
                type: 4,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::select_requests_to_pay",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 8,
          },
          selector: "0xc8ff4075",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_waiting_withdrawal_count",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0xf60e78d9",
        },
        {
          args: [
            {
              label: "amount",
              type: {
                displayName: ["azerostakingtrait_external", "StakeInput1"],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::stake",
          mutates: true,
          payable: true,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 8,
          },
          selector: "0x1946a0e0",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_apy",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0x3462eeef",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_total_inw_for_waiting_withdrawals",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0x4fa92bed",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_unstaking_fee",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0x84352494",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_inw_contract",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 21,
          },
          selector: "0x851d72b9",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_inw_multiplier",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0xa721cd60",
        },
        {
          args: [
            {
              label: "max_total_staking_amount",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "SetMaxTotalStakingAmountInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::set_max_total_staking_amount",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 8,
          },
          selector: "0x16be4ee3",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_withdrawal_request_count",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0x26bd140c",
        },
        {
          args: [
            {
              label: "expiration_duration",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "WithdrawAzeroToStakeInput1",
                ],
                type: 4,
              },
            },
            {
              label: "receiver",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "WithdrawAzeroToStakeInput2",
                ],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::withdraw_azero_to_stake",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 8,
          },
          selector: "0x2c42ce57",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_staker_list",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 22,
          },
          selector: "0x94151ab4",
        },
        {
          args: [
            {
              label: "index",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "GetWaitingWithdrawalIndexInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_waiting_withdrawal_index",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 23,
          },
          selector: "0x21994b34",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_total_azero_staked",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0xa2efe52b",
        },
        {
          args: [
            {
              label: "index",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "GetWithdrawalRequestInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_withdrawal_request",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 25,
          },
          selector: "0x99b05303",
        },
        {
          args: [
            {
              label: "expiration_duration",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "GetWithdrawableAzeroToStakeToValidatorInput1",
                ],
                type: 4,
              },
            },
          ],
          default: false,
          docs: [],
          label:
            "AzeroStakingTrait::get_withdrawable_azero_to_stake_to_validator",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 28,
          },
          selector: "0x998a18ee",
        },
        {
          args: [
            {
              label: "apy",
              type: {
                displayName: ["azerostakingtrait_external", "SetApyInput1"],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::set_apy",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 8,
          },
          selector: "0xa477acfc",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_min_staking_amount",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0x91d337b9",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_withdrawable_inw",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 28,
          },
          selector: "0x1787edcb",
        },
        {
          args: [
            {
              label: "user",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "GetWithdrawalRequestListByUserInput1",
                ],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_withdrawal_request_list_by_user",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 30,
          },
          selector: "0xcbce5802",
        },
        {
          args: [
            {
              label: "user",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "GetWithdrawalRequestIndexListByUserInput1",
                ],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_withdrawal_request_index_list_by_user",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 18,
          },
          selector: "0x28e00c0c",
        },
        {
          args: [
            {
              label: "user",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "GetWithdrawalRequestCountByUserInput1",
                ],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_withdrawal_request_count_by_user",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0x7b6d001a",
        },
        {
          args: [
            {
              label: "receiver",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "WithdrawInwInput1",
                ],
                type: 0,
              },
            },
            {
              label: "amount",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "WithdrawInwInput2",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::withdraw_inw",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 8,
          },
          selector: "0x243ecbfd",
        },
        {
          args: [
            {
              label: "request_index",
              type: {
                displayName: ["azerostakingtrait_external", "ClaimInput1"],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::claim",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 8,
          },
          selector: "0x0c93dc7f",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_max_total_staking_amount",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0xcf52de55",
        },
        {
          args: [
            {
              label: "staker",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "GetStakeInfoInput1",
                ],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_stake_info",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 32,
          },
          selector: "0x3b01b496",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_total_stakers",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0xc0481a7d",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_total_azero_for_waiting_withdrawals",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0x8919cece",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_total_inw_reserved_for_withdrawals",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0x630ec101",
        },
        {
          args: [
            {
              label: "min_staking_amount",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "SetMinStakingAmountInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::set_min_staking_amount",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 8,
          },
          selector: "0x4f9a052b",
        },
        {
          args: [
            {
              label: "max_waiting_time",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "SetMaxWaitingTimeInput1",
                ],
                type: 4,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::set_max_waiting_time",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 8,
          },
          selector: "0xd414c1a1",
        },
        {
          args: [
            {
              label: "inw_contract",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "SetInwContractInput1",
                ],
                type: 0,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::set_inw_contract",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 8,
          },
          selector: "0xba86540d",
        },
        {
          args: [
            {
              label: "unstaking_fee",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "SetUnstakingFeeInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::set_unstaking_fee",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 8,
          },
          selector: "0x25c30ffb",
        },
        {
          args: [
            {
              label: "expiration_duration",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "GetSortedWaitingListWithinExpirationDurationInput1",
                ],
                type: 4,
              },
            },
          ],
          default: false,
          docs: [],
          label:
            "AzeroStakingTrait::get_sorted_waiting_list_within_expiration_duration",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 36,
          },
          selector: "0x2c0ff8e3",
        },
        {
          args: [
            {
              label: "receiver",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "WithdrawAzeroInput1",
                ],
                type: 0,
              },
            },
            {
              label: "amount",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "WithdrawAzeroInput2",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::withdraw_azero",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 8,
          },
          selector: "0xbdca5718",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_payable_azero",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 28,
          },
          selector: "0x2463ece1",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_withdrawal_request_list",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 30,
          },
          selector: "0x17511a77",
        },
        {
          args: [
            {
              label: "user",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "GetWithdrawalRequestIndexByUserInput1",
                ],
                type: 0,
              },
            },
            {
              label: "index",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "GetWithdrawalRequestIndexByUserInput2",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_withdrawal_request_index_by_user",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 23,
          },
          selector: "0x86196557",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_total_azero_reserved_for_withdrawals",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0xc85ced38",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_max_waiting_time",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 39,
          },
          selector: "0x69d7fcb9",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_total_azero_claimed",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0x9c50c036",
        },
        {
          args: [
            {
              label: "amount",
              type: {
                displayName: [
                  "azerostakingtrait_external",
                  "WithdrawRequestInput1",
                ],
                type: 3,
              },
            },
          ],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::withdraw_request",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 8,
          },
          selector: "0x61753ad8",
        },
        {
          args: [],
          default: false,
          docs: [],
          label: "AzeroStakingTrait::get_azero_balance",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["ink", "MessageResult"],
            type: 20,
          },
          selector: "0xe8b1ab1a",
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
            type: 8,
          },
          selector: "0x9e32fab2",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "GetRoleAdminInput1"],
                type: 6,
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
            type: 40,
          },
          selector: "0x83da3bb2",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "RenounceRoleInput1"],
                type: 6,
              },
            },
            {
              label: "account",
              type: {
                displayName: ["accesscontrol_external", "RenounceRoleInput2"],
                type: 41,
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
            type: 42,
          },
          selector: "0xeaf1248a",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "GrantRoleInput1"],
                type: 6,
              },
            },
            {
              label: "account",
              type: {
                displayName: ["accesscontrol_external", "GrantRoleInput2"],
                type: 41,
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
            type: 42,
          },
          selector: "0x4ac062fd",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "RevokeRoleInput1"],
                type: 6,
              },
            },
            {
              label: "account",
              type: {
                displayName: ["accesscontrol_external", "RevokeRoleInput2"],
                type: 41,
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
            type: 42,
          },
          selector: "0x6e4f0991",
        },
        {
          args: [
            {
              label: "role",
              type: {
                displayName: ["accesscontrol_external", "HasRoleInput1"],
                type: 6,
              },
            },
            {
              label: "address",
              type: {
                displayName: ["accesscontrol_external", "HasRoleInput2"],
                type: 41,
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
            type: 44,
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
                  "GetRoleMemberInput1",
                ],
                type: 6,
              },
            },
            {
              label: "index",
              type: {
                displayName: [
                  "accesscontrolenumerable_external",
                  "GetRoleMemberInput2",
                ],
                type: 6,
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
            type: 46,
          },
          selector: "0x163469e0",
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
                type: 6,
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
            type: 40,
          },
          selector: "0xf1b1a9d7",
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
            type: 47,
          },
          selector: "0x5e228753",
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
            type: 46,
          },
          selector: "0x4fa43c8c",
        },
        {
          args: [
            {
              label: "new_owner",
              type: {
                displayName: ["ownable_external", "TransferOwnershipInput1"],
                type: 41,
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
            type: 47,
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
                        name: "min_staking_amount",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "max_total_staking_amount",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "apy",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 4,
                          },
                        },
                        name: "max_waiting_time",
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
                            ty: 3,
                          },
                        },
                        name: "inw_multiplier",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "unstaking_fee",
                      },
                      {
                        layout: {
                          root: {
                            layout: {
                              struct: {
                                fields: [
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x5fe9aada",
                                        ty: 3,
                                      },
                                    },
                                    name: "staking_amount",
                                  },
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x5fe9aada",
                                        ty: 3,
                                      },
                                    },
                                    name: "unclaimed_azero_reward",
                                  },
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x5fe9aada",
                                        ty: 3,
                                      },
                                    },
                                    name: "claimed_azero_reward",
                                  },
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x5fe9aada",
                                        ty: 3,
                                      },
                                    },
                                    name: "unclaimed_inw_reward",
                                  },
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x5fe9aada",
                                        ty: 3,
                                      },
                                    },
                                    name: "claimed_inw_reward",
                                  },
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x5fe9aada",
                                        ty: 4,
                                      },
                                    },
                                    name: "last_updated",
                                  },
                                ],
                                name: "StakeInformation",
                              },
                            },
                            root_key: "0x5fe9aada",
                          },
                        },
                        name: "stake_info_by_staker",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 5,
                          },
                        },
                        name: "staker_list",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "withdrawal_request_count",
                      },
                      {
                        layout: {
                          root: {
                            layout: {
                              struct: {
                                fields: [
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x2cfd5b3f",
                                        ty: 3,
                                      },
                                    },
                                    name: "request_index",
                                  },
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x2cfd5b3f",
                                        ty: 0,
                                      },
                                    },
                                    name: "user",
                                  },
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x2cfd5b3f",
                                        ty: 3,
                                      },
                                    },
                                    name: "amount",
                                  },
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x2cfd5b3f",
                                        ty: 3,
                                      },
                                    },
                                    name: "azero_reward",
                                  },
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x2cfd5b3f",
                                        ty: 3,
                                      },
                                    },
                                    name: "total_azero",
                                  },
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x2cfd5b3f",
                                        ty: 3,
                                      },
                                    },
                                    name: "inw_reward",
                                  },
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x2cfd5b3f",
                                        ty: 4,
                                      },
                                    },
                                    name: "request_time",
                                  },
                                  {
                                    layout: {
                                      leaf: {
                                        key: "0x2cfd5b3f",
                                        ty: 2,
                                      },
                                    },
                                    name: "status",
                                  },
                                ],
                                name: "WithdrawalRequestInformation",
                              },
                            },
                            root_key: "0x2cfd5b3f",
                          },
                        },
                        name: "withdrawal_request_list",
                      },
                      {
                        layout: {
                          root: {
                            layout: {
                              leaf: {
                                key: "0x887d6e2f",
                                ty: 3,
                              },
                            },
                            root_key: "0x887d6e2f",
                          },
                        },
                        name: "withdrawal_request_by_user",
                      },
                      {
                        layout: {
                          root: {
                            layout: {
                              leaf: {
                                key: "0x701352ec",
                                ty: 3,
                              },
                            },
                            root_key: "0x701352ec",
                          },
                        },
                        name: "withdrawal_waiting_list",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "total_azero_staked",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "total_azero_claimed",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "total_inw_claimed",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "total_azero_for_waiting_withdrawals",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "total_inw_for_waiting_withdrawals",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "total_azero_reserved_for_withdrawals",
                      },
                      {
                        layout: {
                          leaf: {
                            key: "0x00000000",
                            ty: 3,
                          },
                        },
                        name: "total_inw_reserved_for_withdrawals",
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
                                ty: 6,
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
                                ty: 7,
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
                                ty: 6,
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
            name: "MyAzeroStaking",
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
            primitive: "u128",
          },
        },
      },
      {
        id: 4,
        type: {
          def: {
            primitive: "u64",
          },
        },
      },
      {
        id: 5,
        type: {
          def: {
            sequence: {
              type: 0,
            },
          },
        },
      },
      {
        id: 6,
        type: {
          def: {
            primitive: "u32",
          },
        },
      },
      {
        id: 7,
        type: {
          def: {
            tuple: [],
          },
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
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 17,
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
              type: 17,
            },
          ],
          path: ["Result"],
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
                      type: 7,
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
              type: 7,
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
        id: 10,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 11,
                      typeName: "String",
                    },
                  ],
                  index: 0,
                  name: "Custom",
                },
                {
                  fields: [
                    {
                      type: 12,
                      typeName: "OwnableError",
                    },
                  ],
                  index: 1,
                  name: "OwnableError",
                },
                {
                  fields: [
                    {
                      type: 13,
                      typeName: "AccessControlError",
                    },
                  ],
                  index: 2,
                  name: "AccessControlError",
                },
                {
                  fields: [
                    {
                      type: 14,
                      typeName: "PSP22Error",
                    },
                  ],
                  index: 3,
                  name: "PSP22Error",
                },
                {
                  fields: [
                    {
                      type: 16,
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
                  name: "InvalidMinStakingAmount",
                },
                {
                  index: 75,
                  name: "InvalidMaxWaitingTime",
                },
                {
                  index: 76,
                  name: "InvalidUnstakingFee",
                },
                {
                  index: 77,
                  name: "BelowMinStakingMount",
                },
                {
                  index: 78,
                  name: "ExceedMaxTotalStakingMount",
                },
                {
                  index: 79,
                  name: "WithdrawalRequestIsNotClaimable",
                },
                {
                  index: 80,
                  name: "WithdrawError",
                },
                {
                  index: 81,
                  name: "RequestNotForClaimer",
                },
                {
                  index: 82,
                  name: "NoWithdrawalRequestInfo",
                },
                {
                  index: 83,
                  name: "NoStakeInfoFound",
                },
                {
                  index: 84,
                  name: "CannotGetWaitingList",
                },
                {
                  index: 85,
                  name: "CannotGetWithdrawableAmount",
                },
                {
                  index: 86,
                  name: "InvalidWithdrawalAmount",
                },
                {
                  index: 87,
                  name: "CannotUpdateUnclaimedRewards",
                },
                {
                  index: 88,
                  name: "InvalidCapAmount",
                },
                {
                  index: 89,
                  name: "InvalidWhitelistAmount",
                },
              ],
            },
          },
          path: ["inkwhale_project", "traits", "error", "Error"],
        },
      },
      {
        id: 11,
        type: {
          def: {
            primitive: "str",
          },
        },
      },
      {
        id: 12,
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
        id: 13,
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
        id: 14,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 11,
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
                      type: 11,
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
                      type: 15,
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
        id: 15,
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
                      type: 4,
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
        id: 16,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 11,
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
                      type: 11,
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
        id: 17,
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
                      type: 17,
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
              type: 17,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 19,
        type: {
          def: {
            sequence: {
              type: 3,
            },
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
                      type: 3,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 17,
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
              type: 17,
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
                      type: 0,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 17,
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
              type: 17,
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
                      type: 5,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 17,
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
              type: 17,
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
                      type: 17,
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
              type: 17,
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
                      type: 17,
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
              type: 17,
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
                      type: 27,
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
              type: 27,
            },
          ],
          path: ["Option"],
        },
      },
      {
        id: 27,
        type: {
          def: {
            composite: {
              fields: [
                {
                  name: "request_index",
                  type: 3,
                  typeName: "u128",
                },
                {
                  name: "user",
                  type: 0,
                  typeName: "AccountId",
                },
                {
                  name: "amount",
                  type: 3,
                  typeName: "Balance",
                },
                {
                  name: "azero_reward",
                  type: 3,
                  typeName: "Balance",
                },
                {
                  name: "total_azero",
                  type: 3,
                  typeName: "Balance",
                },
                {
                  name: "inw_reward",
                  type: 3,
                  typeName: "Balance",
                },
                {
                  name: "request_time",
                  type: 4,
                  typeName: "u64",
                },
                {
                  name: "status",
                  type: 2,
                  typeName: "u8",
                },
              ],
            },
          },
          path: [
            "inkwhale_project",
            "impls",
            "azero_staking",
            "data",
            "WithdrawalRequestInformation",
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
                      type: 29,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 17,
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
              type: 29,
            },
            {
              name: "E",
              type: 17,
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
              type: 3,
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
                      type: 17,
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
              type: 17,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 31,
        type: {
          def: {
            sequence: {
              type: 27,
            },
          },
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
                      type: 17,
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
              type: 17,
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
                      type: 34,
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
              type: 34,
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
        id: 34,
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
                      type: 35,
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
              type: 35,
            },
          ],
          path: ["Option"],
        },
      },
      {
        id: 35,
        type: {
          def: {
            composite: {
              fields: [
                {
                  name: "staking_amount",
                  type: 3,
                  typeName: "Balance",
                },
                {
                  name: "unclaimed_azero_reward",
                  type: 3,
                  typeName: "Balance",
                },
                {
                  name: "claimed_azero_reward",
                  type: 3,
                  typeName: "Balance",
                },
                {
                  name: "unclaimed_inw_reward",
                  type: 3,
                  typeName: "Balance",
                },
                {
                  name: "claimed_inw_reward",
                  type: 3,
                  typeName: "Balance",
                },
                {
                  name: "last_updated",
                  type: 4,
                  typeName: "u64",
                },
              ],
            },
          },
          path: [
            "inkwhale_project",
            "impls",
            "azero_staking",
            "data",
            "StakeInformation",
          ],
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
                      type: 37,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 17,
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
              type: 37,
            },
            {
              name: "E",
              type: 17,
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
              type: 38,
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
        id: 38,
        type: {
          def: {
            composite: {
              fields: [
                {
                  name: "waiting_list",
                  type: 19,
                  typeName: "Vec<u128>",
                },
                {
                  name: "total_azero",
                  type: 3,
                  typeName: "Balance",
                },
                {
                  name: "total_inw",
                  type: 3,
                  typeName: "Balance",
                },
              ],
            },
          },
          path: [
            "inkwhale_project",
            "impls",
            "azero_staking",
            "data",
            "OngoingExpiredWaitingList",
          ],
        },
      },
      {
        id: 39,
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
                      type: 17,
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
              type: 17,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 40,
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
                      type: 17,
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
              type: 17,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 41,
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
        id: 42,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 43,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 17,
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
              type: 43,
            },
            {
              name: "E",
              type: 17,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 43,
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
              type: 7,
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
        id: 44,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 45,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 17,
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
              type: 45,
            },
            {
              name: "E",
              type: 17,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 45,
        type: {
          def: {
            primitive: "bool",
          },
        },
      },
      {
        id: 46,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 41,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 17,
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
              type: 41,
            },
            {
              name: "E",
              type: 17,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 47,
        type: {
          def: {
            variant: {
              variants: [
                {
                  fields: [
                    {
                      type: 48,
                    },
                  ],
                  index: 0,
                  name: "Ok",
                },
                {
                  fields: [
                    {
                      type: 17,
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
              type: 48,
            },
            {
              name: "E",
              type: 17,
            },
          ],
          path: ["Result"],
        },
      },
      {
        id: 48,
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
              type: 7,
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
        id: 49,
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
        id: 50,
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

export default my_azero_staking;