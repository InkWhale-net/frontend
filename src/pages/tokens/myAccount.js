import AddressCopier from "components/address-copier/AddressCopier";
import IWCardOneColumn from "components/card/CardOneColumn";
import { formatTextAmount } from "utils";
import { formatNumDynDecimal } from "utils";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";

const MyAccountTab = ({ address, balance, tokenInfo }) => {
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
          title: "Azero Balance",
          content: `${balance?.azero || 0} AZERO`,
        },
        {
          title: "INW Balance",
          content: `${
            formatNumDynDecimal(formatTextAmount(balance?.inw)) || 0
          } INW`,
        },
        {
          title: "INW V2 Balance",
          content: `${
            formatNumDynDecimal(formatTextAmount(balance?.inw2)) || 0
          } INW`,
        },
        {
          title: !tokenInfo?.title ? "" : `${tokenInfo?.title} Balance`,
          content: `${formatNumDynDecimal(
            formatTextAmount(tokenInfo?.content)
          )} ${tokenInfo?.title}`,
          isHide: tokenInfo?.address == psp22_contract_v2.CONTRACT_ADDRESS,
        },
      ]}
    />
  );
};
export default MyAccountTab;
