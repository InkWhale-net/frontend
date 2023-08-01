import {
  Box,
  Button,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { APICall } from "api/client";
import AddressCopier from "components/address-copier/AddressCopier";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import { useAppContext } from "contexts/AppContext";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";
import { delay } from "utils";
import { execContractTx } from "utils/contracts";
import { execContractQuery } from "utils/contracts";
import launchpad_generator from "utils/contracts/launchpad_generator";

const Launchpad = () => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { launchpads } = useSelector((s) => s.launchpad);
  const { api } = useAppContext();
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const getIsAdmin = async () => {
    try {
      const haveRole = await execContractQuery(
        currentAccount?.address,
        "api",
        launchpad_generator.CONTRACT_ABI,
        launchpad_generator.CONTRACT_ADDRESS,
        0,
        "accessControl::hasRole",
        process.env.REACT_APP_LP_ADMIN_ROLE_STRING,
        currentAccount?.address
      );
      setIsAdmin(haveRole.toHuman().Ok);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchLP = async () => {
    try {
      let queryBody = {};
      dispatch(fetchLaunchpads(queryBody));
    } catch (error) {
      console.log(error);
    }
  };
  const launchpadRender = launchpads?.map((e) => ({
    ...e,
    phaseList: JSON.parse(e?.phaseList),
  }));
  const activeLPHandler = async (lpContract, value) => {
    try {
      await execContractTx(
        currentAccount,
        api,
        launchpad_generator.CONTRACT_ABI,
        launchpad_generator.CONTRACT_ADDRESS,
        0, //-> value
        "launchpadGeneratorTrait::setIsActiveLaunchpad",
        lpContract,
        value
      );
      await delay(2000);
      await APICall.askBEupdate({
        type: "launchpad",
        poolContract: lpContract,
      });
      await toast.promise(
        delay(10000).then(() => {
          if (currentAccount) fetchLP();
        }),
        {
          loading: "Please wait up to 10s for the data to be updated! ",
          success: "Done !",
          error: "Could not fetch data!!!",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (currentAccount) getIsAdmin();
    else setIsAdmin(false);
  }, [currentAccount]);
  useEffect(() => {
    if (isAdmin) fetchLP();
  }, [isAdmin]);
  if (!isAdmin)
    return (
      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="LAUNCHPAD ADMINISTRATION"
        description="You are not admin"
      ></SectionContainer>
    );
  return (
    <SectionContainer
      mt={{ base: "0px", xl: "20px" }}
      title="LAUNCHPAD ADMINISTRATION"
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          Contract Owner: <AddressCopier address={currentAccount?.address} />
        </Box>
        <Box>
          Your Role <Heading size="md">Admin</Heading>
        </Box>
        <Box>
          <IWInput type="number" placeholder="Search" value={newAddress} />
          <Button isDisabled size="md" sx={{ marginTop: "8px" }}>
            GRANT ADMIN
          </Button>
        </Box>
      </Box>
      <Box>
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>No.</Th>
                <Th>Name</Th>
                <Th>Phase</Th>
                <Th>LP Contract</Th>
                <Th>Active</Th>
              </Tr>
            </Thead>
            <Tbody>
              {launchpadRender?.map((obj, index) => {
                return (
                  <Tr>
                    <Td>{index}</Td>
                    <Td>{obj?.projectInfo?.projectInfor?.name}</Td>
                    <Td>
                      {obj?.phaseList?.map((phaseObj, phaseIndex) => {
                        return <Box>{`${phaseIndex}: ${phaseObj?.name}`}</Box>;
                      })}
                    </Td>
                    <Td>
                      <AddressCopier address={obj?.launchpadContract} />
                    </Td>
                    <Td>
                      {obj?.isActive ? (
                        <Button
                          size="sm"
                          bg={"#D7D5E5"}
                          onClick={() =>
                            activeLPHandler(obj?.launchpadContract, false)
                          }
                        >
                          Deactive
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() =>
                            activeLPHandler(obj?.launchpadContract, true)
                          }
                        >
                          Active
                        </Button>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </SectionContainer>
  );
};
export default Launchpad;
