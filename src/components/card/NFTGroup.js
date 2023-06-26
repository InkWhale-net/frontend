import { CloseIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { closeBulkDialog } from "redux/slices/bulkStakeSlide";

import { Box, IconButton, Slide } from "@chakra-ui/react";
import ConfirmModal from "components/modal/ConfirmModal";
import { useAppContext } from "contexts/AppContext";
import useBulkStake from "hook/useBulkStake";
import { toast } from "react-hot-toast";
import { toastMessages } from "constants";
import { isPoolEnded } from "utils";
import { isPoolNotStart } from "utils";

const MAX_NFT_ACTION = 5;

const NFTGroup = ({
  mode,
  tokenSymbol,
  address,
  balance,
  apy,
  poolContract,
  tokenContract,
  rewardPool,
  nftInfo,
  tokenDecimal,
  multiplier,
  NFTtokenContract,
  startTime,
  duration,
  setRefetchData,
  refetchData,
  ...rest
}) => {
  const dispatch = useDispatch();
  const { currentAccount } = useSelector((s) => s.wallet);
  const { listNFTStake, action, unstakeFee } = useSelector((s) => s.bulkStake);
  const { api } = useAppContext();
  const { doBulkStake, doBulkUnStake } = useBulkStake({
    poolContract,
    NFTtokenContract,
  });
  const handleBulkStake = async () => {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }
    if (isPoolEnded(startTime, duration)) {
      toast.error("Pool is ended!");
      return;
    }

    if (isPoolNotStart(startTime)) {
      toast.error("Pool is not start!");
      return;
    }

    if (!rewardPool || parseInt(rewardPool) <= 0) {
      toast.error("There is no reward balance in this pool!");
      return;
    }
    await doBulkStake(() => setRefetchData(!refetchData));
  };

  const handleBulkUnStake = async () => {
    await doBulkUnStake(() => setRefetchData(!refetchData));
  };

  const onBulkAction = () => {
    if (action === "Unstake NFT") {
      handleBulkUnStake();
    } else {
      handleBulkStake();
    }
  };

  return (
    <Box position="relative">
      <Box>
        <Slide
          direction="bottom"
          in={listNFTStake?.length > 0}
          style={{
            zIndex: 10,
            maxHeight: "200px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{ display: "flex", justifyContent: "center" }}
            width={{ base: "full", lg: "320px" }}
            pb={{ base: "20px" }}
          >
            <ConfirmModal
              action="bulkStake"
              buttonVariant="primary"
              buttonLabel={`Bulk ${action?.replace("NFT", "")} (${
                listNFTStake?.length || 0
              }) NFTs`}
              disableBtn={false}
              onValidate={() => {
                if (listNFTStake.length > MAX_NFT_ACTION) {
                  toast.error(`Maximum bulk ${action} is ${MAX_NFT_ACTION} `);
                  return false;
                }
                return true;
              }}
              onClick={onBulkAction}
              message={
                <>
                  You are bulk {action?.replace("NFT", "")} (
                  {listNFTStake?.length || 0}) NFTs <br /> Unstaking{" "}
                  {action !== "Unstake NFT" && "later"} will cost you{" "}
                  {Number(unstakeFee * listNFTStake?.length)?.toFixed(0)} INW.
                  Continue?
                </>
              }
            />
            <IconButton
              borderRadius="0"
              icon={<CloseIcon color="#93F0F5" />}
              variant="link"
              onClick={() => {
                dispatch(closeBulkDialog());
              }}
            />
          </Box>
        </Slide>
      </Box>
    </Box>
  );
};

export default NFTGroup;
