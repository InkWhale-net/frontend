import { ContractPromise } from "@polkadot/api-contract";
import { web3FromSource } from "@polkadot/extension-dapp";
import { APICall } from "api/client";
import { useAppContext } from "contexts/AppContext";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {batchTxResponseErrorHandler} from "utils";
import {
  delay,
  formatNumToBN,
  formatTextAmount,
  formatTokenAmount,
  getEstimatedGasBatchTx,
} from "utils";
import { execContractQuery, execContractTx } from "utils/contracts";
import nft_pool_contract from "utils/contracts/nft_pool_contract";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";

import psp34_standard from "utils/contracts/psp34_standard";

export default function useBulkStake({ poolContract, NFTtokenContract }) {
  const dispatch = useDispatch();
  const { listNFTStake, action, unstakeFee } = useSelector((s) => s.bulkStake);
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();

  const hasUnapprovedTx = async () => {
    let resultArray = [];

    await Promise.all(
      listNFTStake?.map(async (tokenInfor) => {
        const queryResult = await execContractQuery(
          currentAccount?.address,
          api,
          psp34_standard.CONTRACT_ABI,
          NFTtokenContract,
          0,
          "psp34::allowance",
          currentAccount?.address,
          poolContract,
          { u64: tokenInfor?.tokenID }
        );
        return queryResult.toHuman().Ok;
      })
    ).then((res) => (resultArray = res));
    return (
      resultArray?.length !==
      resultArray.reduce((acc, r) => (r ? acc + 1 : acc), 0)
    );
  };

  const handleApproveTx = async (updateData) => {
    // if (hasNullPrice) {
    //   toast.error("Price can not be zero!");
    //   return;
    // }
    toast("Step 1: Approving NFT transfer...");

    let unsubscribe;
    let approveTxALL;

    const address = currentAccount?.address;
    const { signer } = await web3FromSource(currentAccount?.meta?.source);

    toast("Estimated transaction fee...");

    // Change to get gasEst for every single tx to 1 for all
    const value = 0;
    let gasLimit;

    const nftPsp34Contract = new ContractPromise(
      api,
      psp34_standard.CONTRACT_ABI,
      NFTtokenContract
    );

    gasLimit = await getEstimatedGasBatchTx(
      address,
      nftPsp34Contract,
      value,
      "psp34::approve",
      poolContract, //   operator_address
      { u64: listNFTStake[0].tokenID },
      true
    );

    await Promise.all(
      listNFTStake.map(async (info) => {
        return nftPsp34Contract.tx["psp34::approve"](
          { gasLimit, value },
          poolContract, //   operator_address
          { u64: info?.tokenID },
          true
        );
      })
    ).then((res) => (approveTxALL = res));
    // dispatch(
    //   setTxStatus({
    //     type: "APPROVE_MULTI_LISTING",
    //     step: START,
    //     tokenIDArray: list,
    //   })
    // );

    api.tx.utility
      .batch(approveTxALL)
      .signAndSend(address, { signer }, ({ events, status, dispatchError }) => {
        if (status?.isFinalized) {
          let totalSuccessTxCount = null;

          events.forEach(
            ({ event, event: { data, method, section, ...rest } }) => {
              if (api.events.utility?.BatchInterrupted.is(event)) {
                totalSuccessTxCount = data[0]?.toString();
              }

              if (api.events.utility?.BatchCompleted.is(event)) {
                totalSuccessTxCount = listNFTStake?.length;
                toast.success(
                  totalSuccessTxCount === 1
                    ? "NFT have been approved successfully"
                    : "All NFTs have been approved successfully"
                );
              }
            }
          );
          // eslint-disable-next-line no-extra-boolean-cast
          if (totalSuccessTxCount !== listNFTStake?.length) {
            toast.error(
              listNFTStake?.length === 1
                ? "Approval is not successful!"
                : `Approval are not fully successful! ${totalSuccessTxCount} approvals completed successfully.`
            );

            // dispatch(clearTxStatus());
          } else {
            handleBulkStaking(updateData);
          }
        }
        batchTxResponseErrorHandler({
          status,
          dispatchError,
          dispatch,
          txType: "APPROVE_MULTI_STAKE",
          api,
          currentAccount,
          isApprovalTx: true,
        });
      })
      .then((unsub) => (unsubscribe = unsub))
      .catch((error) => toast.error(error.message || "Unknow error occured"));

    return unsubscribe;
  };

  const handleBulkStaking = async (updateData) => {
    // if (hasNullPrice) {
    //   toast.error("Price can not be zero!");
    //   return;
    // }

    toast.success(listNFTStake?.length > 0 && `Bulk Stakeing process...`);

    let unsubscribe;
    let stakingTxALL;

    const address = currentAccount?.address;
    const { signer } = await web3FromSource(currentAccount?.meta?.source);

    toast.success("Estimated transaction fee...");

    // Change to get gasEst for every single tx to 1 for all
    const value = 0;
    let gasLimit;

    const marketplaceContract = new ContractPromise(
      api,
      nft_pool_contract.CONTRACT_ABI,
      poolContract
    );

    gasLimit = await getEstimatedGasBatchTx(
      address,
      marketplaceContract,
      value,
      "stake",
      { u64: listNFTStake[0].tokenID }
    );
    // TODOS: monitor gas is ok for different price above

    await Promise.all(
      listNFTStake.map(async (info) => {
        const ret = marketplaceContract.tx["stake"](
          { gasLimit, value },
          { u64: info?.tokenID }
        );

        return ret;
      })
    ).then((res) => (stakingTxALL = res));

    api.tx.utility
      .batch(stakingTxALL)
      .signAndSend(
        address,
        { signer },
        async ({ events, status, dispatchError }) => {
          if (status?.isFinalized) {
            let totalSuccessTxCount = null;

            events.forEach(
              async ({ event, event: { data, method, section, ...rest } }) => {
                if (api.events.utility?.BatchInterrupted.is(event)) {
                  totalSuccessTxCount = data[0]?.toString();
                }

                if (api.events.utility?.BatchCompleted.is(event)) {
                  toast.success(
                    listNFTStake?.length === 1
                      ? "NFT has been staked successfully                  "
                      : "All NFTs have been staked successfully"
                  );
                }
              }
            );

            await listNFTStake.map(
              async (info) =>
                await APICall.askBEupdateNFTFromArtZero({
                  collection_address: NFTtokenContract,
                  token_id: info?.tokenID,
                })
            );
            // eslint-disable-next-line no-extra-boolean-cast
            if (!!totalSuccessTxCount) {
              toast.error(
                listNFTStake?.length === 1
                  ? "The staking is not fully successful!                "
                  : `Bulk staking are not fully successful! ${totalSuccessTxCount} staking completed successfully.`
              );
            }
            updateData();
            batchTxResponseErrorHandler({
              status,
              dispatchError,
              dispatch,
              txType: "MULTI_STAKE",
              api,
              currentAccount,
              isApprovalTx: true,
            });
          }
        }
      )
      .then((unsub) => (unsubscribe = unsub))
      .catch((error) => toast.error("The staking fail", error?.message));

    return unsubscribe;
  };
  const doBulkUnStake = async (updateData) => {
    // if (hasNullPrice) {
    //   toast.error("Price can not be zero!");
    //   return;
    // }
    const numberNft = listNFTStake?.length;

    toast.success(numberNft > 0 && `Bulk unstakeing process...`);
    if (
      +formatTextAmount(currentAccount?.balance?.inw2) <
      +unstakeFee * +numberNft
    ) {
      toast.error(
        `You don't have enough INW V2. Unstake costs ${
          +unstakeFee * +numberNft
        } INW V2`
      );
      return;
    }

    //Approve
    toast.success("Step 1: Approving INW V2...");
    let approve = await execContractTx(
      currentAccount,
      "api",
      psp22_contract_v2.CONTRACT_ABI,
      psp22_contract_v2.CONTRACT_ADDRESS,
      0, //-> value
      "psp22::approve",
      poolContract,
      formatNumToBN(unstakeFee * numberNft)
    );
    if (!approve) return;

    await delay(3000);
    if (!approve) return;

    let unsubscribe;
    let stakingTxALL;

    const address = currentAccount?.address;
    const { signer } = await web3FromSource(currentAccount?.meta?.source);

    toast.success("Estimated transaction fee...");

    // Change to get gasEst for every single tx to 1 for all
    const value = 0;
    let gasLimit;

    const marketplaceContract = new ContractPromise(
      api,
      nft_pool_contract.CONTRACT_ABI,
      poolContract
    );

    gasLimit = await getEstimatedGasBatchTx(
      address,
      marketplaceContract,
      value,
      "unstake",
      { u64: listNFTStake[0].tokenID }
    );
    // TODOS: monitor gas is ok for different price above

    await Promise.all(
      listNFTStake.map(async (info) => {
        const ret = marketplaceContract.tx["unstake"](
          { gasLimit, value },
          { u64: info?.tokenID }
        );

        return ret;
      })
    ).then((res) => (stakingTxALL = res));

    api.tx.utility
      .batch(stakingTxALL)
      .signAndSend(
        address,
        { signer },
        async ({ events, status, dispatchError }) => {
          if (status?.isFinalized) {
            let totalSuccessTxCount = null;

            events.forEach(
              async ({ event, event: { data, method, section, ...rest } }) => {
                if (api.events.utility?.BatchInterrupted.is(event)) {
                  totalSuccessTxCount = data[0]?.toString();
                }

                if (api.events.utility?.BatchCompleted.is(event)) {
                  toast.success(
                    listNFTStake?.length === 1
                      ? "NFT has been unstaked successfully                  "
                      : "All NFTs have been unstaked successfully"
                  );
                }
              }
            );

            await listNFTStake.map(
              async (info) =>
                await APICall.askBEupdateNFTFromArtZero({
                  collection_address: NFTtokenContract,
                  token_id: info?.tokenID,
                })
            );
            // eslint-disable-next-line no-extra-boolean-cast
            if (!!totalSuccessTxCount) {
              toast.error(
                listNFTStake?.length === 1
                  ? "The unstaking is not fully successful!                "
                  : `Bulk unstaking are not fully successful! ${totalSuccessTxCount} staking completed successfully.`
              );
            }
            updateData();
            batchTxResponseErrorHandler({
              status,
              dispatchError,
              dispatch,
              txType: "MULTI_UNSTAKE",
              api,
              currentAccount,
              isApprovalTx: true,
            });
          }
        }
      )
      .then((unsub) => (unsubscribe = unsub))
      .catch((error) => toast.error("The unstaking fail", error?.message));

    return unsubscribe;
  };

  const doBulkStake = async (updateData) => {
    const hasUnapproved = await hasUnapprovedTx();

    if (hasUnapproved) {
      await handleApproveTx(updateData);
      return;
    }
    await handleBulkStaking(updateData);
  };

  return {
    doBulkStake,
    doBulkUnStake,
  };
}
