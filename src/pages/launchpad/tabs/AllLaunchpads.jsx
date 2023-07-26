import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import LaunchpadTag from "../components/LaunchpadTag";
import { useMutation, useQuery } from "react-query";
import { APICall } from "api/client";
import IWInput from "components/input/Input";
import SectionContainer from "components/container/SectionContainer";
import { SearchIcon } from "@chakra-ui/icons";
import IWSelect from "components/select/IWSelect";
import { useSelector } from "react-redux";
import { useAppContext } from "contexts/AppContext";
import { getIPFSData } from "utils";

const AllLaunchpads = ({}) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const [launchpads, setLaunchpads] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  // status:
  // 0: all
  // 1: upcoming
  // 2: live
  // 3: end
  const [queries, setQueries] = useState({
    keyword: null,
    status: 0,
  });

  const statusOption = ["All status", "Upcoming", "Live", "Ended"];

  const [sortby, setSortby] = useState(null);
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const { isLoading, mutate } = useMutation(async () => {
    await new Promise(async (resolve) => {
      try {
        let queryBody = {};
        const { ret, status, message } = await APICall.getLaunchpad(queryBody);
        if (status === "OK") {
          setLaunchpads(
            ret.map((e) => ({ ...e, launchpadInfo: JSON.parse(e?.projectInfo) }))
          );
          //   const launchpadList = await Promise.all(
          //     ret.map(async (e) => {
          //       const projectInfor = await getIPFSData(e?.projectInfoUri);
          //       if (projectInfor)
          //         return {
          //           projectInfor,
          //           launchpadContract: e?.launchpadContract,
          //           tokenContract: e?.tokenContract,
          //         };
          //     })
          //   );
          //   setLaunchpads(launchpadList.filter((e) => !!e));
        }
        resolve();
      } catch (error) {
        console.log(error);
        resolve();
      }
    });
  }, "get-pagination-launchpads");

  useEffect(() => {
    mutate();
  }, [queries, currentAccount, api]);

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <IWInput
          value={queries?.keyword}
          width={{ base: "full" }}
          onChange={
            ({ target }) => {}
            //   setKeywords({ ...keywords, queryAddress: target.value })
          }
          placeholder="Search with From/To"
          inputRightElementIcon={<SearchIcon color="#57527E" />}
        />
        <Box
          sx={{ display: "flex", alignItems: "center", paddingLeft: "12px" }}
        >
          <Text sx={{ whiteSpace: "nowrap" }}>Filter by:</Text>
          <Select
            variant="flushed"
            sx={{ border: "none", fontWeight: "bold" }}
            style={{ width: "120px", paddingLeft: "4px" }}
            value={queries?.status}
            id="lanchpad-status"
            onChange={({ target }) => {
              setQueries((prev) => {
                return { ...prev, status: target.value };
              });
            }}
          >
            {statusOption.map((label, index) => (
              <option value={index}>{label}</option>
            ))}
          </Select>
          {/* <Text sx={{ whiteSpace: "nowrap" }}>Sort by:</Text>
          <Select
            variant="flushed"
            sx={{ border: "none", fontWeight: "bold" }}
            style={{ width: "120px", paddingLeft: "4px" }}
            value={queries?.status}
            id="lanchpad-status"
            onChange={({ target }) => {
              setQueries((prev) => {
                return { ...prev, status: target.value };
              });
            }}
          >
            {statusOption.map((label, index) => (
              <option value={index}>{label}</option>
            ))}
          </Select> */}
        </Box>
      </Box>
      <SimpleGrid columns={3} spacing={4}>
        {launchpads?.map((obj, index) => {
          return (
            <LaunchpadTag LaunchpadData={obj} key={`launchpad-tag-${index}`} />
          );
        })}
      </SimpleGrid>
    </div>
  );
};

export default AllLaunchpads;
