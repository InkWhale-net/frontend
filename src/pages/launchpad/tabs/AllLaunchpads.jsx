import { Box, SimpleGrid } from "@chakra-ui/react";
import { useAppContext } from "contexts/AppContext";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";
import LaunchpadTag from "../components/LaunchpadTag";

const AllLaunchpads = ({ isOwner }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { launchpads } = useSelector((s) => s.launchpad);
  const { api } = useAppContext();
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

  const dispatch = useDispatch();

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
    dispatch(fetchLaunchpads({}));
  };

  const launchpadList = useMemo(() => {
    if (isOwner) {
      return launchpads?.filter((el) => el.owner == currentAccount?.address);
    } else {
      return launchpads?.filter((el) => el.isActive === true);
    }
  }, [isOwner, launchpads, currentAccount]);
  if (!(launchpadList?.length > 0)) return <div>No data</div>;
  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{ display: "flex", alignItems: "center", paddingLeft: "12px" }}
        >
        </Box>
      </Box>
      <SimpleGrid
        columns={{
          base: 1,
          // sm: 2,
          md: 2,
          lg: 3,
        }}
        spacing={4}
        sx={{ marginTop: "8px" }}
      >
        {launchpadList?.map((obj, index) => {
          return (
            <LaunchpadTag
              launchpadData={{
                ...obj,
                phaseList: JSON.parse(obj?.phaseList),
              }}
              key={`launchpad-tag-${index}`}
            />
          );
        })}
      </SimpleGrid>
    </div>
  );
};

export default AllLaunchpads;
