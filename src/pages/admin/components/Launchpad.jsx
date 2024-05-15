import {
  Box,
  Button,
  Divider,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { APICall } from "api/client";
import AddressCopier from "components/address-copier/AddressCopier";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import { useAppContext } from "contexts/AppContext";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { delay } from "utils";
import { execContractQuery, execContractTx, execContractTxAndCallAPI } from "utils/contracts";
import launchpad_generator from "utils/contracts/launchpad_generator";

const LPRow = ({ obj, fetchLP, index }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const history = useHistory();
  const doxxedUpdateMuation = useMutation(async (data) => {
    await APICall.updateDoxxed(data)
    await delay(2000)
    await fetchLP();
  })
  const activeLPMutation = useMutation(async ({ contractAddress, newValue }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await execContractTxAndCallAPI(
          currentAccount,
          api,
          launchpad_generator.CONTRACT_ABI,
          launchpad_generator.CONTRACT_ADDRESS,
          0, //-> value
          "launchpadGeneratorTrait::setIsActiveLaunchpad",
          async () => {
            await APICall.askBEupdate({
              type: "launchpad",
              poolContract: contractAddress,
            });
            await delay(2000);
            await fetchLP();
            resolve()
          },
          contractAddress,
          newValue
        );
        if (!result) reject("UPDATE FAIL")
      } catch (error) {
        console.log(error);
        reject("UPDATE FAIL")
      }
    })
  })
  const loadingStatusActive = {
    isLoading: activeLPMutation.isLoading,
    isDisabled: activeLPMutation.isLoading
  }
  return <Tr>
    <Td>{index}</Td>
    <Td><Text sx={{
      fontWeight: "bold",
      textDecor: "underline"
    }} _hover={{
      color: "#93F0F5",
      cursor: "pointer"
    }} onClick={() => {
      history.push({
        pathname: `/launchpad/${obj?.launchpadContract}`,
      })
    }}>{obj?.projectInfo?.projectInfor?.name}</Text></Td>
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
          {...loadingStatusActive}
          size="sm"
          bg={"#D7D5E5"}
          onClick={() => activeLPMutation.mutate({ contractAddress: obj?.launchpadContract, newValue: false })
          }
        >
          Deactive
        </Button>
      ) : (
        <Button
          {...loadingStatusActive}
          size="sm"
          onClick={() =>
            activeLPMutation.mutate({ contractAddress: obj?.launchpadContract, newValue: true })
          }
        >
          Active
        </Button>
      )}
    </Td>
    <Td>
      {obj?.isDoxxed ? (
        <Button
          isLoading={doxxedUpdateMuation.isLoading}
          isDisabled={doxxedUpdateMuation.isLoading}
          size="sm"
          bg={"#D7D5E5"}
          onClick={() =>
            doxxedUpdateMuation.mutate({
              contractAddress: obj?.launchpadContract,
              newValue: false
            })
          }
        >
          Set NO
        </Button>
      ) : (
        <Button
          isLoading={doxxedUpdateMuation.isLoading}
          isDisabled={doxxedUpdateMuation.isLoading}
          size="sm"
          onClick={() =>
            doxxedUpdateMuation.mutate({
              contractAddress: obj?.launchpadContract,
              newValue: true
            })
          }
        >
          Set YES
        </Button>
      )}
    </Td>
  </Tr>
}
const Launchpad = () => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const [launchpads, setLaunchpads] = useState([]);

  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [isContractOwner, setIsContractOwner] = useState(false);
  const [lpAdminList, setLPAdminList] = useState([]);
  const grantNewAdmin = async () => {
    try {
      if (currentAccount?.address == newAddress) {
        toast.error("Address must not current account");
        return;
      }
      const haveRole = await execContractQuery(
        currentAccount?.address,
        "api",
        launchpad_generator.CONTRACT_ABI,
        launchpad_generator.CONTRACT_ADDRESS,
        0,
        "accessControl::hasRole",
        process.env.REACT_APP_LP_ADMIN_ROLE_STRING,
        newAddress
      );
      if (haveRole.toHuman().Ok) {
        toast("This address is adready admin");
        return;
      }

      const result = await execContractTx(
        currentAccount,
        api,
        launchpad_generator.CONTRACT_ABI,
        launchpad_generator.CONTRACT_ADDRESS,
        0, //-> value
        "accessControl::grantRole",
        process.env.REACT_APP_LP_ADMIN_ROLE_STRING,
        newAddress
      );
      setNewAddress("");
      if (result) toast.success("Admin granted");
      else toast.error("Admin grant fail");
      await fetchLP();
      await fetchLPAdmin();
    } catch (error) {
      console.log(error);
    }
  };

  const revokeAdminRole = async (address) => {
    try {
      const currentAddress = address || newAddress;

      if (currentAccount?.address == newAddress) {
        toast.error("Address must not current account");
        return;
      }
      const haveRole = await execContractQuery(
        currentAccount?.address,
        "api",
        launchpad_generator.CONTRACT_ABI,
        launchpad_generator.CONTRACT_ADDRESS,
        0,
        "accessControl::hasRole",
        process.env.REACT_APP_LP_ADMIN_ROLE_STRING,
        currentAddress
      );
      if (!haveRole.toHuman().Ok) {
        toast("This address is not admin");
        return;
      }

      const result = await execContractTx(
        currentAccount,
        api,
        launchpad_generator.CONTRACT_ABI,
        launchpad_generator.CONTRACT_ADDRESS,
        0, //-> value
        "accessControl::revokeRole",
        process.env.REACT_APP_LP_ADMIN_ROLE_STRING,
        currentAddress
      );
      setNewAddress("");
      if (result) toast.success("Role revoked");
      else toast.error("Role revoke fail");
      await fetchLP();
      await fetchLPAdmin();
    } catch (error) {
      console.log(error);
    }
  };

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
      const queryOwner = await execContractQuery(
        currentAccount?.address,
        "api",
        launchpad_generator.CONTRACT_ABI,
        launchpad_generator.CONTRACT_ADDRESS,
        0,
        "ownable::owner"
      );
      setIsContractOwner(queryOwner.toHuman().Ok == currentAccount?.address);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchLP = async () => {
    try {
      const { ret, status, message } = await APICall.getLaunchpad({});
      if (status === "OK") {
        setLaunchpads(
          ret?.dataArray.map((e) => ({
            ...e,
            projectInfo: JSON.parse(e?.projectInfo),
          }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const launchpadRender = launchpads?.map((e) => ({
    ...e,
    phaseList: JSON.parse(e?.phaseList),
  }));

  useEffect(() => {
    if (currentAccount) getIsAdmin();
    else setIsAdmin(false);
  }, [currentAccount]);

  useEffect(() => {
    if (isAdmin) fetchLP();
  }, [isAdmin]);
  const fetchLPAdmin = useCallback(async () => {
    if (currentAccount?.address) {
      const haveRoleQuery = await execContractQuery(
        currentAccount?.address,
        "api",
        launchpad_generator.CONTRACT_ABI,
        launchpad_generator.CONTRACT_ADDRESS,
        0,
        "accessControlEnumerable::getRoleMemberCount",
        process.env.REACT_APP_LP_ADMIN_ROLE_STRING
      );
      const adminAcount = haveRoleQuery.toHuman().Ok;

      const adminList = await Promise.all(
        Array.from({ length: adminAcount }).map(async (e, index) => {
          const roleMemberQuery = await execContractQuery(
            currentAccount?.address,
            "api",
            launchpad_generator.CONTRACT_ABI,
            launchpad_generator.CONTRACT_ADDRESS,
            0,
            "accessControlEnumerable::getRoleMember",
            process.env.REACT_APP_LP_ADMIN_ROLE_STRING,
            index
          );
          return roleMemberQuery.toHuman().Ok;
        })
      );
      setLPAdminList(adminList);
    }
  }, [currentAccount?.address]);
  useEffect(() => {
    fetchLPAdmin();
  }, [currentAccount, fetchLPAdmin]);
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
      maxW="1800px"
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isContractOwner ? "column" : "row",
            alignItems: isContractOwner ? "flex-start" : "center",
          }}
        >
          Launchpad admin: <AddressCopier address={currentAccount?.address} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: isContractOwner ? "column" : "row",
            alignItems: isContractOwner ? "flex-start" : "center",
          }}
        >
          Your Role: <Heading size="md">Admin</Heading>
        </Box>
        {isContractOwner && (
          <Box>
            <IWInput
              placeholder="New admin address"
              value={newAddress}
              size="sm"
              onChange={({ target }) => setNewAddress(target.value)}
            />
            <Button
              isDisabled={!(newAddress?.length > 0)}
              size="sm"
              sx={{ marginTop: "8px" }}
              onClick={() => grantNewAdmin()}
            >
              GRANT ADMIN ROLE
            </Button>
            <Button
              isDisabled={!(newAddress?.length > 0)}
              size="sm"
              sx={{ marginTop: "8px", ml: "4px" }}
              onClick={() => revokeAdminRole()}
            >
              REVOKE ADMIN ROLE
            </Button>
          </Box>
        )}
      </Box>
      {isContractOwner && (
        <Box>
          <Text sx={{ fontWeight: "700", color: "#57527E", mt: "32px" }}>
            LAUNCHPAD ADMIN LIST
          </Text>
          <Divider />
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>No.</Th>
                  <Th>Account address</Th>
                  <Th>Role</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {lpAdminList.map((obj, index) => {
                  return (
                    <Tr>
                      <Td>{index}</Td>
                      <Td>{obj && <AddressCopier address={obj} />}</Td>
                      <Td>Admin</Td>
                      <Td>
                        <Button
                          isDisabled={currentAccount?.address == obj}
                          size="sm"
                          onClick={() => revokeAdminRole(obj)}
                        >
                          Revoke role
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="end" mt="20px" mb="8px">
        <Text sx={{ fontWeight: "700", color: "#57527E" }}>
          LAUNCHPAD LIST
        </Text>
        <Button size="sm" onClick={() => {
          APICall.askBEupdate({
            type: "launchpad",
            poolContract: "new",
          });
        }}>Refetch list BE</Button>
      </Box>
      <Divider />
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
                <Th>Doxxed</Th>
              </Tr>
            </Thead>
            <Tbody>
              {launchpadRender?.map((obj, index) => <LPRow index={index} key={`index-row-lp`} obj={obj} fetchLP={fetchLP} />)}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </SectionContainer>
  );
};
export default Launchpad;
