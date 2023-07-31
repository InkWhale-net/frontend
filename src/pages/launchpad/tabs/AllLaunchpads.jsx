import { SearchIcon } from "@chakra-ui/icons";
import { Box, Select, SimpleGrid, Text } from "@chakra-ui/react";
import IWInput from "components/input/Input";
import { useAppContext } from "contexts/AppContext";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LaunchpadTag from "../components/LaunchpadTag";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";

const AllLaunchpads = ({}) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { launchpads } = useSelector((s) => s.launchpad);
  const { api } = useAppContext();
  const dispatch = useDispatch();
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
    pageSize: 20,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const queryLaunchpads = async () => {
    let queryBody = {};
    dispatch(fetchLaunchpads(queryBody));
  };
  useEffect(() => {
    if (currentAccount) queryLaunchpads();
  }, [queries, currentAccount]);

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
      <SimpleGrid columns={3} spacing={4} sx={{ marginTop: "8px" }}>
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
