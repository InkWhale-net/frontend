// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import StakingTable from "./components/Table";
// import { Box, SimpleGrid, Text } from "@chakra-ui/react";
// import IWCard from "components/card/Card";
// import { useAppContext } from "contexts/AppContext";
// import { useDispatch, useSelector } from "react-redux";
// import { formatChainStringToNumber } from "utils";
// import { getWithdrawalRequestListByUser } from "api/azero-staking/azero-staking";
// import { formatNumDynDecimal } from "utils";
// import { fetchUserBalance } from "redux/slices/walletSlice";
// import { delay } from "utils";

// function Claim() {
//   const { api } = useAppContext();
//   const dispatch = useDispatch();

//   const { currentAccount } = useSelector((s) => s.wallet);

//   const [userRequestList, setUserRequestList] = useState([]);

//   const fetchUserRequestList = useCallback(async () => {
//     const requestedList = await getWithdrawalRequestListByUser(
//       api,
//       currentAccount
//     );

//     if (requestedList?.length) {
//       const formattedRequestedList = requestedList.map((i) => {
//         const withdrawalAmount =
//           formatChainStringToNumber(i.amount) / Math.pow(10, 12);

//         const azeroReward =
//           formatChainStringToNumber(i.azeroReward) / Math.pow(10, 12);

//         const totalAzero =
//           formatChainStringToNumber(i.totalAzero) / Math.pow(10, 12);

//         const inwReward =
//           formatChainStringToNumber(i.inwReward) / Math.pow(10, 12);

//         const requestTime =
//           formatChainStringToNumber(i.requestTime) * Math.pow(10, 0);

//         const requestStatus = getRequestStatus(i.status);

//         return {
//           ...i,
//           withdrawalAmount,
//           azeroReward,
//           totalAzero,
//           inwReward,
//           requestStatus,
//           requestTime: new Date(requestTime).toLocaleString(),
//         };
//       });

//       setUserRequestList(formattedRequestedList);
//     } else {
//       setUserRequestList([]);
//     }
//   }, [api, currentAccount]);

//   useEffect(() => {
//     fetchUserRequestList();
//   }, [fetchUserRequestList]);

//   const stakingInfo = useMemo(() => {
//     let ret = [];

//     if (userRequestList?.length) {
//       const availableList = userRequestList.reduce(
//         (prev, curr) => {
//           let ret = prev;
//           // 0: waiting, 1: is claimable, 2: claimed

//           if (parseInt(curr.status) === 1) {
//             ret[0] = prev[0] + curr.totalAzero;
//             ret[1] = prev[1] + curr.inwReward;
//             ret[4] = prev[4] + 1;
//           }

//           if (parseInt(curr.status) === 0) {
//             ret[2] = prev[2] + curr.totalAzero;
//             ret[3] = prev[3] + curr.inwReward;
//             ret[5] = prev[5] + 1;
//           }

//           return ret;
//         },
//         [0, 0, 0, 0, 0, 0]
//       );

//       ret = availableList;
//     } else {
//       ret = ret.concat([0, 0, 0, 0, 0, 0]);
//     }
//     return ret;
//   }, [userRequestList]);

//   async function handleCallback() {
//     delay(1000).then(() => {
//       fetchUserRequestList();
//       dispatch(fetchUserBalance({ currentAccount, api }));
//     });
//   }

//   return (
//     <div>
//       <IWCard w="full" variant="outline" mb="24px">
//         <SimpleGrid columns={[1, 1, 3]} spacing={"24px"}>
//           <HeaderInfo info={stakingInfo} />
//         </SimpleGrid>
//       </IWCard>

//       <StakingTable tableBody={userRequestList} cb={handleCallback} />
//     </div>
//   );
// }

// export default Claim;

// function HeaderInfo({ info }) {
//   const formattedInfo = [
//     {
//       title: "Available to claim",
//       data: [
//         { amount: info && info[0], type: "AZERO" },
//         { amount: info && info[1], type: "INW" },
//       ],
//     },
//     {
//       title: "My pending amount",
//       data: [
//         { amount: info && info[2], type: "AZERO" },
//         { amount: info && info[3], type: "INW" },
//       ],
//     },
//     {
//       title: "My requests",
//       data: [
//         { amount: info && info[4], type: "Claimable" },
//         { amount: info && info[5], type: "Pending" },
//       ],
//     },
//   ];

//   return formattedInfo?.map((i) => (
//     <Box key={i.title} minH="80px" px="12px">
//       <Text fontWeight={700}>{i.title}</Text>
//       {i?.data?.map((d, idx) => (
//         <Text key={idx}>
//           {formatNumDynDecimal(d.amount)} {d.type}
//         </Text>
//       ))}
//     </Box>
//   ));
// }

export function getRequestStatus(status) {
  switch (parseInt(status)) {
    case 0:
      return "Pending";
    case 1:
      return "Claimable";
    case 2:
      return "Claimed";
    default:
      return "n/a";
  }
}
// pub status: u8 // 0: waiting, 1: is claimable, 2: claimed
