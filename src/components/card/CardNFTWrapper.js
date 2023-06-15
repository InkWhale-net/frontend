import {
  Box,
  Button,
  Heading,
  Icon,
  IconButton,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import ImageCloudFlare from "components/image-cf/ImageCF";
import ConfirmModal from "components/modal/ConfirmModal";
import { useState } from "react";
import { Fragment } from "react-is";
import { PlusSquareIcon } from "@chakra-ui/icons";

const NFTCard = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const { nftName, avatar, tokenID } = props.cardData;
  const { action, actionHandler, unstakeFee, updateSelectedBulk } = props;
  return (
    <Fragment>
      <WrapItem>
        <VStack
          spacing="12px"
          borderWidth="1px"
          borderRadius="10px"
          p={{ base: "10px", lg: "24px" }}
          w={{ base: "160px", sm: "170px", md: "270px" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          border={isHovered ? "4px solid #93F0F5" : "4px solid #FFF"}
        >
          <ImageCloudFlare
            borderWidth="1px"
            w={{ base: "none", lg: "222px" }}
            h={{ base: "none", lg: "222px" }}
            size="500"
            alt={nftName}
            borderRadius="5px"
            src={avatar}
          />
          <Box
            sx={{
              position: "absolute",
              display: "flex",
              justifyContent: "flex-end",
            }}
            w={{ base: "none", lg: "222px" }}
          >
            {isHovered && (
              <IconButton
                mr={{ base: "10px" }}
                aria-label="Search database"
                icon={<PlusSquareIcon w={"42px"} h={"42px"} color="#93F0F5" />}
                variant="link"
                onClick={() => updateSelectedBulk(props.cardData, props.action)}
              />
            )}
          </Box>
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
};

export default function IWCardNFTWrapper(props) {
  const { data, action, actionHandler, unstakeFee } = props;

  return (
    <>
      <Wrap spacing={{ base: "10px", md: "30px" }} w="full">
        {data?.map((cardData, idx) => {
          return <NFTCard {...props} cardData={cardData} key={idx} />;
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
        Unstaking later will cost you {Number(unstakeFee)?.toFixed(0)} INW.
        Continue?
      </>
    );
  }

  if (action === "Unstake NFT") {
    return (
      <>
        You are unstaking NFT {nftName}.<br />
        Unstaking will cost you {Number(unstakeFee)?.toFixed(0)} INW. Continue?
      </>
    );
  }
};
