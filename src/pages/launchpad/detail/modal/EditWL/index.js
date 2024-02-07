import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  Stack,
  Tabs,
  TabList,
  Tab,
  Heading,
  TabPanels,
  TabPanel,
  Button,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import IWInput from "components/input/Input";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import { useAppContext } from "contexts/AppContext";
import { useEffect, useMemo, useState } from "react";
import { AiFillExclamationCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { formatNumDynDecimal, formatTokenAmount } from "utils";
import { execContractQuery } from "utils/contracts";
import { launchpad } from "utils/contracts";
import AddBulk from "./AddBulk";
import AddSingleWL from "./AddSingle";
import { appChain } from "constants";

const EditWL = ({ visible, setVisible, launchpadData }) => {
  const currentAccount = useSelector((s) => s.wallet.currentAccount);
  const { api } = useAppContext();
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [selectedMode, setSelectedMode] = useState(0);
  const [availableTokenAmount, setAvailableTokenAmount] = useState(0);
  const [queries, setQueries] = useState("");
  const tokenDecimal = parseInt(launchpadData?.projectInfo?.token?.decimals);
  const [selectedWL, setSelectedWL] = useState(null);
  const [whitelist, setWL] = useState([]);
  useEffect(() => {
    (async () => {
      const queryCountWL = await execContractQuery(
        currentAccount?.address,
        api,
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0,
        "launchpadContractTrait::getWhitelistAccountCount",
        selectedPhase
      );
      const countWL = queryCountWL?.toHuman()?.Ok;
      const WLList = await Promise.all(
        new Array(+countWL).fill(0).map(async (e, index) => {
          const queryWLAccount = await execContractQuery(
            currentAccount?.address,
            api,
            launchpad.CONTRACT_ABI,
            launchpadData?.launchpadContract,
            0,
            "launchpadContractTrait::getWhitelistAccount",
            selectedPhase,
            index
          );
          const WLAccount = queryWLAccount?.toHuman()?.Ok;
          const queryWLAccountDetail = await execContractQuery(
            currentAccount?.address,
            api,
            launchpad.CONTRACT_ABI,
            launchpadData?.launchpadContract,
            0,
            "launchpadContractTrait::getWhitelistBuyer",
            selectedPhase,
            WLAccount
          );
          const WLAccountDetail = queryWLAccountDetail?.toHuman()?.Ok;
          const formatedAccountBuyer = {
            account: WLAccount,
            amount: formatTokenAmount(WLAccountDetail?.amount, tokenDecimal),
            price: formatTokenAmount(
              WLAccountDetail?.price,
              appChain?.decimals
            ),
            purchasedAmount: formatTokenAmount(
              WLAccountDetail?.purchasedAmount,
              tokenDecimal
            ),
            claimedAmount: formatTokenAmount(
              WLAccountDetail?.claimedAmount,
              tokenDecimal
            ),
          };
          return formatedAccountBuyer;
        })
      );
      setWL(WLList);
    })();
  }, [launchpadData?.phaseList, queries?.keyword, selectedPhase, tokenDecimal]);

  const fetchPhaseData = async () => {
    const result = await execContractQuery(
      currentAccount?.address,
      api,
      launchpad.CONTRACT_ABI,
      launchpadData?.launchpadContract,
      0,
      "launchpadContractTrait::getAvailableTokenAmount"
    );
    const availableAmount = result.toHuman().Ok;

    setAvailableTokenAmount(formatTokenAmount(availableAmount, tokenDecimal));
  };

  const tableData = {
    columns: [
      {
        accessorKey: "account",
        header: "Address",
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorKey: "purchasedAmount",
        header: "Purchased",
      },
      {
        accessorKey: "claimedAmount",
        header: "Claimed",
      },
      {
        accessorKey: "price",
        header: "Price",
      },
    ],
    data: whitelist || [],
  };

  const isPhaseEditable = useMemo(() => {
    if (selectedPhase >= 0) {
      const phaseData = launchpadData?.phaseList[selectedPhase];
      const phaseDataParse = {
        ...phaseData,
        startDate: new Date(parseInt(phaseData?.startTime?.replace(/,/g, ""))),
        endDate: new Date(parseInt(phaseData?.endTime?.replace(/,/g, ""))),
      };

      if (phaseDataParse?.endDate < new Date()) return false;
      else return true;
    } else {
      return true;
    }
  }, [launchpadData?.phaseList, selectedPhase]);

  const table = useReactTable({
    ...tableData,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    //
    // debugTable: true,
  });

  useEffect(() => {
    if (launchpadData) fetchPhaseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launchpadData]);

  useEffect(() => {
    if (selectedMode !== 0) setSelectedWL(null);
  }, [selectedMode]);

  useEffect(() => {
    if (table) table.setPageSize(4);
  }, [table]);

  useEffect(() => {
    if (!visible) {
      setSelectedWL(null);
      setSelectedPhase(0);
      setSelectedMode(0);
    }
  }, [visible]);

  const phaseHeaderInfo = useMemo(() => {
    const capAmountBN = launchpadData?.phaseList[selectedPhase]?.capAmount;
    const decimals = launchpadData?.projectInfo?.token?.decimals;

    const currPhaseInfo = launchpadData?.phaseList[selectedPhase];
    const currWLPhaseInfo = currPhaseInfo?.whitelist;
    const currPLPhaseInfo = currPhaseInfo?.publicSaleInfor;

    const whitelistTotalAmount = currWLPhaseInfo?.reduce((prev, curr) => {
      return prev + curr?.amount?.replaceAll(",", "") / 10 ** decimals;
    }, 0);

    const whitelistTotalPurchasedAmount = currWLPhaseInfo?.reduce(
      (prev, curr) =>
        prev + curr?.purchasedAmount?.replaceAll(",", "") / 10 ** decimals,
      0
    );

    const whitelistTotalClaimedAmount = currWLPhaseInfo?.reduce(
      (prev, curr) =>
        prev + curr?.claimedAmount?.replaceAll(",", "") / 10 ** decimals,
      0
    );

    return {
      capAmount: capAmountBN?.replaceAll(",", "") / 10 ** decimals,

      isPublic: currPLPhaseInfo?.isPublic,
      publicTotalAmount: currPLPhaseInfo?.totalAmount,
      publicTotalPurchasedAmount: currPLPhaseInfo?.totalPurchasedAmount,
      publicTotalClaimedAmount: currPLPhaseInfo?.totalClaimedAmount,

      whitelistTotalAmount,
      whitelistTotalPurchasedAmount,
      whitelistTotalClaimedAmount,
    };
  }, [
    launchpadData?.phaseList,
    launchpadData?.projectInfo?.token?.decimals,
    selectedPhase,
  ]);

  // ++++++++++++++++++++++++++++++++++++++++++

  const tabsData = [
    {
      label: `${launchpadData?.requireKyc ? "Edit Whitelist" : "Single"}`,
      component: (
        <EditWhitelist
          isPhaseEditable={isPhaseEditable}
          launchpadData={launchpadData}
          selectedPhase={selectedPhase}
          selectedWL={selectedWL}
          setSelectedWL={setSelectedWL}
          availableTokenAmount={availableTokenAmount}
          phaseHeaderInfo={phaseHeaderInfo}
          queries={queries}
          setQueries={setQueries}
          table={table}
          whitelist={whitelist}
        />
      ),
      isDisabled: false,
    },
    {
      label: `${launchpadData?.requireKyc ? "Import KYC address" : "Bulk"}`,
      component: (
        <AddBulk
          launchpadData={launchpadData}
          selectedPhase={selectedPhase}
          availableTokenAmount={availableTokenAmount}
          setSelectedMode={setSelectedMode}
        />
      ),
      isDisabled: false,
    },
  ];

  return (
    <Modal
      isOpen={visible}
      isCentered
      size="6xl"
      onClose={() => setVisible(false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={["2xl", "3xl"]}>
          {launchpadData?.requireKyc
            ? "Manage KYC & Whitelist"
            : "Whitelist Manager"}
        </ModalHeader>
        <ModalCloseButton onClick={() => setVisible(false)} />
        <ModalBody pt="0" sx={{ pb: "28px" }}>
          <Box mb="16px">
            <Flex
              w="full"
              flexDirection={["column", "column", "row"]}
              alignItems={["start", "start", "center"]}
              justifyContent="start"
            >
              <Flex
                alignItems="center"
                mr={["0px", "0px", "40px"]}
                mb={["16px", "16px", "0px"]}
              >
                <Text
                  mr="16px"
                  minW="fit-content"
                  sx={{ fontWeight: "700", color: "#57527E" }}
                >
                  Select Phase
                </Text>
                <Select
                  variant="filled"
                  size="md"
                  onChange={({ target }) => {
                    setSelectedPhase(target.value);
                    setQueries({ keyword: "" });
                  }}
                  value={selectedPhase}
                >
                  {launchpadData?.phaseList.map((item, index) => (
                    <option key={index} value={index}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </Flex>

              {/* <Text>
                Balance:{" "}
                <Text as="span" fontWeight={600}>
                  {`${formatNumDynDecimal(availableTokenAmount)}
                ${launchpadData?.projectInfo?.token?.symbol}`}
                </Text>
              </Text> */}

              <Text>
                Phase Cap:{" "}
                <Text as="span" fontWeight={600}>
                  {`${formatNumDynDecimal(phaseHeaderInfo?.capAmount)}
                ${launchpadData?.projectInfo?.token?.symbol}`}
                </Text>
              </Text>
            </Flex>

            {!isPhaseEditable && (
              <Box
                sx={{
                  bg: "#FED1CA",
                  display: "flex",
                  alignItems: "center",
                  px: "10px",
                  py: "8px",
                  mt: "10px",
                  borderRadius: "4px",
                }}
              >
                <AiFillExclamationCircle />
                <Text sx={{ ml: "8px" }}>You can not edit this phase!</Text>
              </Box>
            )}
          </Box>

          <KycTabs
            tabsData={tabsData}
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default EditWL;

function EditWhitelist({
  isPhaseEditable,
  launchpadData,
  selectedPhase,
  selectedWL,
  setSelectedWL,
  availableTokenAmount,
  phaseHeaderInfo,
  queries,
  setQueries,
  table,
  whitelist,
}) {
  return (
    <Box display={["block", "flex"]}>
      <Box
        sx={{
          maxWidth: "320px",
          minW: "320px",
        }}
        mr={["0px", "20px"]}
      >
        {isPhaseEditable && (
          <AddSingleWL
            launchpadData={launchpadData}
            selectedPhase={selectedPhase}
            selectedWL={selectedWL}
            setSelectedWL={setSelectedWL}
            availableTokenAmount={availableTokenAmount}
            phaseCapAmount={phaseHeaderInfo?.capAmount}
            whitelist={whitelist}
          />
        )}
      </Box>

      <Box sx={{ flex: 1, pt: "30px" }}>
        <Flex mb="16px">
          <IWInput
            size="md"
            value={queries?.keyword}
            width={{ base: "full" }}
            onChange={({ target }) =>
              setQueries({ ...queries, keyword: target.value })
            }
            placeholder="Search"
            inputRightElementIcon={<SearchIcon color="#57527E" />}
          />
        </Flex>
        <TableContainer
          // mt="18px"
          width="full"
          sx={{
            mb: "18px",
            border: "1px solid #E3DFF3",
            borderRadius: 8,
          }}
        >
          <Table variant="simple">
            <Thead>
              {table?.getHeaderGroups().map((headerGroup) => (
                <Tr w="full" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Th key={header.id} colSpan={header.colSpan}>
                        {
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        }
                      </Th>
                    );
                  })}
                  <Th>Action</Th>
                </Tr>
              ))}
            </Thead>

            {whitelist?.length > 0 ? (
              <>
                <Tbody>
                  {table.getRowModel().rows.map((row, index) => {
                    return (
                      <Tr
                        key={row.id}
                        border="1px solid transparent"
                        _hover={{
                          border: "1px solid #93F0F5",
                          background: "#E8FDFF",
                        }}
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <Td key={cell.id}>
                              {formatDataCellTable(
                                whitelist[index],
                                cell.getContext().column.id
                              )}
                            </Td>
                          );
                        })}
                        <Td>
                          <Button
                            size="sm"
                            onClick={() => setSelectedWL(whitelist[index])}
                          >
                            Edit
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
                <Tfoot sx={{ display: "flex" }}>
                  <Box
                    sx={{
                      width: "full",
                      display: "flex",
                      alignItems: "center",
                      py: "8px",
                      pl: "8px",
                    }}
                  >
                    <IconButton
                      aria-label="previousPage"
                      width={"40px"}
                      height={"40px"}
                      variant={"solid"}
                      bg={"#93F0F5"}
                      borderRadius={"42px"}
                      icon={<ChevronLeftIcon size={"80px"} color="#FFF" />}
                      onClick={() => table.previousPage()}
                      isDisabled={!table.getCanPreviousPage()}
                    />
                    <IconButton
                      ml={"4px"}
                      aria-label="previousPage"
                      width={"40px"}
                      height={"40px"}
                      variant={"solid"}
                      bg={"#93F0F5"}
                      borderRadius={"42px"}
                      icon={<ChevronRightIcon size={"80px"} color="#FFF" />}
                      onClick={() => table.nextPage()}
                      isDisabled={!table.getCanNextPage()}
                    />
                    <Box sx={{ width: "64px", ml: "8px" }}>
                      <IWInput
                        size="md"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                        type="number"
                        value={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                          const page = e.target.value
                            ? Number(e.target.value) - 1
                            : 0;
                          table.setPageIndex(page);
                        }}
                      />
                    </Box>{" "}
                    <Text sx={{ mr: "20px", ml: "8px" }}>
                      of {table.getPageCount()}
                    </Text>
                  </Box>
                </Tfoot>
              </>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <div style={{ fontSize: 14 }}>
                  No Whitelist added to this phase
                </div>
              </Box>
            )}
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export function PhaseHeaderInfo({ phaseHeaderInfo, launchpadData }) {
  return (
    <>
      <Box w={["100%", "50%"]} fontSize={["16px", "18px"]}>
        <Text>
          PL Total Amount:{" "}
          <Text as="span" fontWeight={600}>
            {`${formatNumDynDecimal(phaseHeaderInfo?.publicTotalAmount)}
                ${launchpadData?.projectInfo?.token?.symbol}`}
          </Text>
        </Text>
        <Text>
          PL Total Purchased:{" "}
          <Text as="span" fontWeight={600}>
            {`${formatNumDynDecimal(
              phaseHeaderInfo?.publicTotalPurchasedAmount
            )}
                ${launchpadData?.projectInfo?.token?.symbol}`}
          </Text>
        </Text>
        <Text>
          PL Total Claimed:{" "}
          <Text as="span" fontWeight={600}>
            {`${formatNumDynDecimal(phaseHeaderInfo?.publicTotalClaimedAmount)}
                ${launchpadData?.projectInfo?.token?.symbol}`}
          </Text>
        </Text>
      </Box>
      <Box w={["100%", "50%"]} fontSize={["16px", "18px"]}>
        <Text>
          WL Total Amount:{" "}
          <Text as="span" fontWeight={600}>
            {`${formatNumDynDecimal(phaseHeaderInfo?.whitelistTotalAmount)}
                ${launchpadData?.projectInfo?.token?.symbol}`}
          </Text>
        </Text>
        <Text>
          WL Total Purchased:{" "}
          <Text as="span" fontWeight={600}>
            {`${formatNumDynDecimal(
              phaseHeaderInfo?.whitelistTotalPurchasedAmount
            )}
                ${launchpadData?.projectInfo?.token?.symbol}`}
          </Text>
        </Text>
        <Text>
          WL Total Claimed:{" "}
          <Text as="span" fontWeight={600}>
            {`${formatNumDynDecimal(
              phaseHeaderInfo?.whitelistTotalClaimedAmount
            )}
                ${launchpadData?.projectInfo?.token?.symbol}`}
          </Text>
        </Text>
      </Box>
    </>
  );
}

function KycTabs({ tabsData, setSelectedMode, selectedMode }) {
  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      <Tabs onChange={(e) => setSelectedMode(e)} isLazy w="full">
        <TabList>
          {tabsData?.map(({ label }, idx) => (
            <Tab
              px="0"
              mr="20px"
              key={idx}
              justifyContent="start"
              _focus={{ borderWidth: "0px" }}
              minW={{ base: "fit-content", lg: "250px" }}
            >
              <Heading as="h3" size="h3">
                {label}
              </Heading>
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {tabsData?.map(({ component }, idx) => (
            <TabPanel py="18px" key={idx}>
              {component}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Stack>
  );
}
