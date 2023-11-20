import {
  Box,
  Button,
  Center,
  FormErrorMessage,
  Heading,
  Image,
  Spacer,
  Square,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { ipfsClient } from "api/client";
import { Buffer } from "buffer";
import { BsImage } from "react-icons/bs";
// import { APICall } from "../../api/client";
import RequiredMark from "../../components/RequiredMark";
const supportedFormat = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

const UploadImage = ({
  label,
  setImageIPFSUrl,
  isDisabled = false,
  previewSize = { width: "120", height: "300" },
  iconUrl,
  limitedSize = { width: "300", height: "300" },
  setIsUploadIconIPFSUrl,
  updatePreviewImage,
  previewUrl,
  keyInput,
  errorLabel,
  direction = "vertical",
}) => {
  const [imgURL, setImgURL] = useState(null);

  // const [newIconData, setNewIconData] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const avatarProfileSize = useBreakpointValue([260, 360]);
  const ref = useRef();

  useEffect(() => {
    if (!iconUrl) {
      setImagePreviewUrl("");
    }
  }, [iconUrl]);

  const retrieveNewIcon = (e) => {
    let data;
    if (e) data = e.target.files[0];

    if (!supportedFormat.includes(data?.type)) {
      toast.error(
        `Please use .png .jpeg .jpeg, .gif format, the ${
          e.target?.files[0] && e.target.files[0].type.split("/")[1]
        } format is not supported.`
      );
      ref.current.value = null;
      // setNewIconData(null);
      setImagePreviewUrl("");
      return;
    }

    if (data?.size >= 524288) {
      toast.error(
        `Maximum size support is 512KB, your image size is ${(
          data?.size / 1048576
        ).toFixed(1)}MB.`
      );
      ref.current.value = null;
      // setNewIconData(null);
      setImagePreviewUrl("");
      return;
    }

    setImgURL(null);

    const reader = new window.FileReader();

    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      // setNewIconData(Buffer(reader.result));

      const uploadPromise = () =>
        new Promise(function (resolve) {
          const created = ipfsClient.add(Buffer(reader.result));

          if (created) {
            resolve(created);
          }
        });

      toast.promise(
        uploadPromise().then(async (created) => {
          setImageIPFSUrl(created?.path);
          setImgURL(created?.path);
        }),
        {
          loading: "Uploading...",
          success: `Upload Icon successful!`,
          error: "Could not upload Icon.",
        }
      );
    };

    e.preventDefault();

    if (e.target.value !== "") {
      const src = URL.createObjectURL(e.target.files[0]);

      setImagePreviewUrl(src);
      if (src) updatePreviewImage(src);
    }
  };

  return (
    <VStack h="full" justifyContent="flex-start" alignItems="start">
      <Heading size="md" mb={{ base: "6px" }}>
        {label || " "}
        <RequiredMark ml="4px" isRequired />
      </Heading>
      <FormErrorMessage>{errorLabel}</FormErrorMessage>

      <Box
        sx={{
          display: "flex",
          flexDirection: direction === "vertical" ? "column" : "row",
          alignItems: direction === "horizontal" ? "flex-end" : null,
        }}
      >
        <Box>
          {imagePreviewUrl || previewUrl ? (
            <Box width={previewSize?.width} height={previewSize?.height}>
              <Image
                h="full"
                w="full"
                alt="avatar"
                boxShadow="base"
                objectFit="cover"
                objectPosition="center"
                src={previewUrl || imagePreviewUrl}
                borderRadius="4px"
              />
            </Box>
          ) : (
            <Box
              sx={{
                width: previewSize?.width,
                height: previewSize?.height,
                border: "2px dashed #E3DFF3",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BsImage size="60px" color="#E3DFF3" />
            </Box>
          )}
        </Box>

        <Center w="full" justifyContent="center">
          <VStack>
            <label
              htmlFor={`inputTag-${keyInput}`}
              style={{ cursor: "pointer" }}
            >
              <input
                disabled={isDisabled}
                ref={ref}
                style={{ display: "none" }}
                id={`inputTag-${keyInput}`}
                onChange={retrieveNewIcon}
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif"
              />
              <Button
                as={Text}
                isDisabled={isDisabled}
                variant="outline"
                fontSize={["sm", "md"]}
                px={["16px", "32px"]}
                height="40px"
                mt={"4px"}
                ml={direction === "horizontal" ? "4px" : null}
              >
                {!imagePreviewUrl ? "Select image" : "Pick another"}
              </Button>
            </label>
          </VStack>
          <Spacer />
        </Center>
      </Box>
      <Text ml={2} fontSize="14px" color="brand.grayLight">
        Recommended file size is {limitedSize.width}x{limitedSize.height} px
      </Text>
    </VStack>
  );
};

export default UploadImage;
