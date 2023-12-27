import public_sale_5ire from "./5ire/public_sale";
import public_sale_alephzero from "./alephzeroTestnet/public_sale";
import public_sale_alephzero_testnet from "./alephzero/public_sale";

import psp22_standard_5ire from "./5ire/psp22_standard";
import psp22_standard_alephzero from "./alephzeroTestnet/psp22_standard";
import psp22_standard_alephzero_testnet from "./alephzero/psp22_standard";

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
