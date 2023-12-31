import public_sale_5ire from "./5ire/public_sale";
import public_sale_alephzero from "./alephzeroTestnet/public_sale";
import public_sale_alephzero_testnet from "./alephzero/public_sale";

import psp22_standard_5ire from "./5ire/psp22_standard";
import psp22_standard_alephzero from "./alephzeroTestnet/psp22_standard";
import psp22_standard_alephzero_testnet from "./alephzero/psp22_standard";

import token_generator_5ire from "./5ire/token_generator";
import token_generator_alephzero from "./alephzeroTestnet/token_generator";
import token_generator_alephzero_testnet from "./alephzero/token_generator";

import pool_generator_5ire from "./5ire/pool_generator";
import pool_generator_alephzero from "./alephzeroTestnet/pool_generator";
import pool_generator_alephzero_testnet from "./alephzero/pool_generator";

import pool_contract_5ire from "./5ire/pool_contract";
import pool_contract_alephzero from "./alephzeroTestnet/pool_contract";
import pool_contract_alephzero_testnet from "./alephzero/pool_contract";

import nft_pool_generator_5ire from "./5ire/nft_pool_generator";
import nft_pool_generator_alephzero from "./alephzeroTestnet/nft_pool_generator";
import nft_pool_generator_alephzero_testnet from "./alephzero/nft_pool_generator";

import nft_pool_contract_5ire from "./5ire/nft_pool_contract";
import nft_pool_contract_alephzero from "./alephzeroTestnet/nft_pool_contract";
import nft_pool_contract_alephzero_testnet from "./alephzero/nft_pool_contract";

import lp_pool_generator_5ire from "./5ire/lp_pool_generator";
import lp_pool_generator_alephzero from "./alephzeroTestnet/lp_pool_generator";
import lp_pool_generator_alephzero_testnet from "./alephzero/lp_pool_generator";

import lp_pool_contract_5ire from "./5ire/lp_pool_contract";
import lp_pool_contract_alephzero from "./alephzeroTestnet/lp_pool_contract";
import lp_pool_contract_alephzero_testnet from "./alephzero/lp_pool_contract";

import launchpad_generator_5ire from "./5ire/launchpad_generator";
import launchpad_generator_alephzero from "./alephzeroTestnet/launchpad_generator";
import launchpad_generator_alephzero_testnet from "./alephzero/launchpad_generator";

import launchpad_contract_5ire from "./5ire/launchpad_contract";
import launchpad_contract_alephzero from "./alephzeroTestnet/launchpad_contract";
import launchpad_contract_alephzero_testnet from "./alephzero/launchpad_contract";

import psp22_standard_ob3_v1_alephzero from "./alephzeroTestnet/psp22_standard_ob3_v1";
import psp22_standard_ob3_v1_alephzero_testnet from "./alephzero/psp22_standard_ob3_v1";

export const public_sale_contract = {
  "5irechain-testnet": public_sale_5ire,
  alephzero: public_sale_alephzero,
  "alephzero-testnet": public_sale_alephzero_testnet,
}[process.env.REACT_APP_CHAIN];

export const psp22_standard_contract = {
  "5irechain-testnet": psp22_standard_5ire,
  alephzero: psp22_standard_alephzero,
  "alephzero-testnet": psp22_standard_alephzero_testnet,
}[process.env.REACT_APP_CHAIN];

export const token_generator_contract = {
  "5irechain-testnet": token_generator_5ire,
  alephzero: token_generator_alephzero,
  "alephzero-testnet": token_generator_alephzero_testnet,
}[process.env.REACT_APP_CHAIN];

export const pool_generator_contract = {
  "5irechain-testnet": pool_generator_5ire,
  alephzero: pool_generator_alephzero,
  "alephzero-testnet": pool_generator_alephzero_testnet,
}[process.env.REACT_APP_CHAIN];

export const pool_contract = {
  "5irechain-testnet": pool_contract_5ire,
  alephzero: pool_contract_alephzero,
  "alephzero-testnet": pool_contract_alephzero_testnet,
}[process.env.REACT_APP_CHAIN];

export const nft_pool_generator_contract = {
  "5irechain-testnet": nft_pool_generator_5ire,
  alephzero: nft_pool_generator_alephzero,
  "alephzero-testnet": nft_pool_generator_alephzero_testnet,
}[process.env.REACT_APP_CHAIN];

export const nft_pool_contract = {
  "5irechain-testnet": nft_pool_contract_5ire,
  alephzero: nft_pool_contract_alephzero,
  "alephzero-testnet": nft_pool_contract_alephzero_testnet,
}[process.env.REACT_APP_CHAIN];

export const lp_pool_generator_contract = {
  "5irechain-testnet": lp_pool_generator_5ire,
  alephzero: lp_pool_generator_alephzero,
  "alephzero-testnet": lp_pool_generator_alephzero_testnet,
}[process.env.REACT_APP_CHAIN];

export const lp_pool_contract = {
  "5irechain-testnet": lp_pool_contract_5ire,
  alephzero: lp_pool_contract_alephzero,
  "alephzero-testnet": lp_pool_contract_alephzero_testnet,
}[process.env.REACT_APP_CHAIN];

export const launchpad_generator_contract = {
  "5irechain-testnet": launchpad_generator_5ire,
  alephzero: launchpad_generator_alephzero,
  "alephzero-testnet": launchpad_generator_alephzero_testnet,
}[process.env.REACT_APP_CHAIN];

export const launchpad_contract = {
  "5irechain-testnet": launchpad_contract_5ire,
  alephzero: launchpad_contract_alephzero,
  "alephzero-testnet": launchpad_contract_alephzero_testnet,
}[process.env.REACT_APP_CHAIN];

export const psp22_standard_ob3_v1_contract = {
  "5irechain-testnet": launchpad_contract_5ire,
  alephzero: psp22_standard_ob3_v1_alephzero,
  "alephzero-testnet": psp22_standard_ob3_v1_alephzero_testnet,
}[process.env.REACT_APP_CHAIN];
