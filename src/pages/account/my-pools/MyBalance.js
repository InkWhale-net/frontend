import { Stack } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";

import { IWTable } from "components/table/IWTable";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { execContractQuery } from "utils/contracts";
import { psp22_contract } from "utils/contracts";
import { formatTokenAmount } from "utils";
import { formatNumDynDecimal } from "utils";

const MyBalance = ({ scrollRef }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { allTokensList } = useSelector((s) => s.allPools);

  const [listToken, setListToken] = useState([]);

  const tableData = {
    tableHeader: [
      {
        name: "name",
        hasTooltip: false,
        tooltipContent: "",
        label: "Token Name",
      },
      {
        name: "symbol",
        hasTooltip: false,
        tooltipContent: "",
        label: "Token Symbol",
      },
      {
        name: "decimal",
        hasTooltip: false,
        tooltipContent: "",
        label: "Token Decimal",
      },
      {
        name: "balance",
        hasTooltip: false,
        tooltipContent: "",
        label: "Balance",
      },
    ],

    tableBody: listToken,
  };
  const getBalance = async () => {
    const balanceList = await Promise.all(
      allTokensList.map(async (e) => {
        let queryResult = await execContractQuery(
          currentAccount?.address,
          "api",
          psp22_contract.CONTRACT_ABI,
          e?.contractAddress,
          0,
          "psp22::balanceOf",
          currentAccount?.address
        );
        const rawBalance = queryResult.toHuman().Ok;

        if (rawBalance == "0") return;
        else {
          const tokenBalance = formatTokenAmount(rawBalance, +e?.decimal);
          return {
            ...e,
            balance: formatNumDynDecimal(tokenBalance),
            showIcon: true,
          };
        }
      })
    );
    setListToken(balanceList.filter((e) => !!e));
  };
  useEffect(() => {
    if (allTokensList?.length > 0 && currentAccount) getBalance();
  }, [allTokensList, currentAccount]);
  return (
    <>
      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="My Balances"
        description={<span>Your token balances</span>}
        scrollRef={scrollRef}
      >
        <Stack
          w="full"
          spacing="30px"
          alignItems="start"
          direction={{ base: "column" }}
        >
          <IWTable {...tableData} isDisableRowClick={true} />
        </Stack>
      </SectionContainer>
    </>
  );
};

export default MyBalance;
