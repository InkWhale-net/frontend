import SectionContainer from "components/container/SectionContainer";
import { InfiniteTable } from "components/table/InfiniteTable";
import { useAppContext } from "contexts/AppContext";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { moveINWToBegin } from "utils";
import { formatTokenAmountNumber } from "utils";
import { roundUp } from "utils";
import { execContractQuery } from "utils/contracts";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";

const PAGINATION_AMOUNT = 32;

const TokenTag = () => {
  return <div>dasd</div>;
};

export default function PSP22Tokens() {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { allTokensList } = useSelector((s) => s.allPools);
  const { api } = useAppContext();
  const [listToken, setListToken] = useState([]);
  const addTotalSupply = async (_allTokensList) => {
    const processedTokenList = await Promise.all(
      _allTokensList.map(async (e) => {
        let queryResult = await execContractQuery(
          currentAccount?.address,
          "api",
          psp22_contract_v2.CONTRACT_ABI,
          e?.contractAddress,
          0,
          "psp22::totalSupply"
        );
        const rawTotalSupply = queryResult.toHuman().Ok;
        let queryResult1 = await execContractQuery(
          currentAccount?.address,
          "api",
          psp22_contract_v2.CONTRACT_ABI,
          e?.contractAddress,
          0,
          "psp22Metadata::tokenDecimals"
        );
        const decimals = queryResult1.toHuman().Ok;
        const totalSupply = roundUp(
          +formatTokenAmountNumber(rawTotalSupply, decimals),
          0
        );
        return {
          ...e,
          totalSupply,
        };
      })
    );

    setListToken(moveINWToBegin(processedTokenList));
  };
  useEffect(() => {
    if (allTokensList?.length > 0 && !!api) addTotalSupply(allTokensList);
  }, [allTokensList, api, currentAccount]);
  const tableData = {
    tableHeader: [
      {
        name: "contractAddress",
        hasTooltip: false,
        tooltipContent: "",
        label: "Contract Address",
      },
      {
        name: "creator",
        hasTooltip: false,
        tooltipContent: "",
        label: "Owner",
      },
      {
        name: "name",
        hasTooltip: false,
        tooltipContent: "",
        label: "Name",
      },
      {
        name: "symbol",
        hasTooltip: false,
        tooltipContent: "",
        label: "Symbol",
      },
      {
        name: "tokenIconUrl",
        hasTooltip: false,
        tooltipContent: "",
        label: "Icon",
      },
      {
        name: "decimal",
        hasTooltip: false,
        tooltipContent: "",
        label: "Decimal",
      },
      {
        name: "totalSupply",
        hasTooltip: false,
        tooltipContent: "",
        label: "Total supply",
      },
    ],
  };
  return (
    <SectionContainer
      mt={{ base: "0px", xl: "8px" }}
      title="PSP22 Tokens"
      description={``}
    >
      {listToken?.filter((el) => !!el)?.length > 0 && (
          <InfiniteTable
            {...tableData}
            tableBody={listToken || []}
            // getNext={() => (hasMorePage ? setCurrentPage(currentPage + 1) : "")}
            // hasMore={hasMorePage}
            isDisableRowClick={true}
          />
        )}
    </SectionContainer>
  );
}
