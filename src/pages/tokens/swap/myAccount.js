import AddressCopier from "components/address-copier/AddressCopier";
import IWCardOneColumn from "components/card/CardOneColumn";
import { appChain } from "constants";
import { formatTextAmount } from "utils";
import { formatNumDynDecimal } from "utils";
import psp22_contract from "utils/contracts/psp22_contract";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";

const MyAccountTab = ({ address, balance, tokenInfo, tokenV2Info }) => {
  console.log('tokenInfo', tokenInfo)
  return (
    <IWCardOneColumn
      title="My Account"
      data={[
        {
          title: "Account Address",
          content: !address ? (
            "No account selected"
          ) : (
            <AddressCopier address={address} />
          ),
        },
        {
          title: `${appChain?.unit} Balance`,
          content: `${balance?.azero || 0} ${appChain?.unit}`,
        },
        {
          title: !tokenInfo?.title ? "" : `${tokenInfo?.title} Balance (V1)`,
          content: `${formatNumDynDecimal(
            formatTextAmount(tokenInfo?.content)
          )} ${tokenInfo?.title}`,
          isHide:
            tokenInfo?.address === psp22_contract_v2.CONTRACT_ADDRESS ||
            tokenInfo?.address === psp22_contract.CONTRACT_ADDRESS,
        },
        {
          title: !tokenV2Info?.title ? "" : `${tokenV2Info?.title} Balance (V2)`,
          content: `${formatNumDynDecimal(
            formatTextAmount(tokenV2Info?.content)
          )} ${tokenV2Info?.title}`,
          isHide:
            tokenV2Info?.address === psp22_contract_v2.CONTRACT_ADDRESS ||
            tokenV2Info?.address === psp22_contract.CONTRACT_ADDRESS,
        },
      ]}
    />
  );
};
export default MyAccountTab;
