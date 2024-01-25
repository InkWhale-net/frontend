import AddressCopier from "components/address-copier/AddressCopier";
import IWCardOneColumn from "components/card/CardOneColumn";
import { chainDenom } from "utils";
import { formatTextAmount } from "utils";
import { formatNumDynDecimal } from "utils";
import { psp22_contract } from "utils/contracts";

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
          title: `${chainDenom[process.env.REACT_APP_CHAIN]} Balance`,
          content: `${balance?.azero || 0} ${
            chainDenom[process.env.REACT_APP_CHAIN]
          }`,
        },
        {
          title: "INW Balance",
          content: `${
            formatNumDynDecimal(formatTextAmount(balance?.inw)) || 0
          } INW`,
        },
        // {
        //   title: "INW V2 Balance",
        //   content: `${
        //     formatNumDynDecimal(formatTextAmount(balance?.inw2)) || 0
        //   } INW`,
        // },
        {
          title: !tokenInfo?.title ? "" : `${tokenInfo?.title} Balance`,
          content: `${formatNumDynDecimal(
            formatTextAmount(tokenInfo?.content)
          )} ${tokenInfo?.title}`,
          isHide: tokenInfo?.address === psp22_contract.CONTRACT_ADDRESS,
        },
      ]}
    />
  );
};
export default MyAccountTab;
