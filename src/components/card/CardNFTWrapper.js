import { Button, Heading, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import ImageCloudFlare from "components/image-cf/ImageCF";
import ConfirmModal from "components/modal/ConfirmModal";
import { Fragment } from "react-is";

export default function IWCardNFTWrapper(props) {
  const { data, action, actionHandler, unstakeFee } = props;

  return (
    <>
      <Wrap spacing={{ base: "10px", md: "30px" }} w="full">
        {data?.map(({ nftName, avatar, tokenID }, idx) => {
          return (
            <Fragment key={idx}>
              <WrapItem>
                <VStack
                  spacing="12px"
                  borderWidth="1px"
                  borderRadius="10px"
                  p={{ base: "10px", lg: "24px" }}
                  w={{ base: "160px", sm: "170px", md: "270px" }}
                >
                  <ImageCloudFlare
                    borderWidth="1px"
                    w={{ base: "180px", lg: "222px" }}
                    h={{ base: "180px", lg: "222px" }}
                    size="500"
                    alt={nftName}
                    borderRadius="5px"
                    src={avatar}
                  />
                  <Heading
                    w="full"
                    as="h4"
                    size="h4"
                    mt="2px"
                    textAlign="left"
                    fontWeight="semibold"
                    lineHeight={{ base: "20px", lg: "25px" }}
                    fontSize={{ base: "16px", lg: "20px" }}
                  >
                    {nftName}
                  </Heading>
                  <ConfirmModal
                    action={action}
                    buttonVariant="primary"
                    buttonLabel={action}
                    onClick={() => actionHandler(tokenID)}
                    message={formatMessageNFTPool(action, nftName, unstakeFee)}
                  />
                </VStack>
              </WrapItem>
            </Fragment>
          );
        })}
      </Wrap>
    </>
  );
}

const formatMessageNFTPool = (action, nftName, unstakeFee) => {
  if (action === "Stake NFT") {
    return (
      <>
        You are staking NFT {nftName}.<br />
        Unstaking later will cost you {Number(unstakeFee)?.toFixed(0)} $INW.
        Continue?
      </>
    );
  }

  if (action === "Unstake NFT") {
    return (
      <>
        You are unstaking NFT {nftName}.<br />
        Unstaking will cost you {Number(unstakeFee)?.toFixed(0)} $INW. Continue?
      </>
    );
  }
};
