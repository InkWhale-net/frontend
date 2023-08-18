import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Switch,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { APICall } from "api/client";
import { AzeroLogo } from "components/icons/Icons";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import { useAppContext } from "contexts/AppContext";
import { parseUnits } from "ethers";
import UploadImage from "pages/launchpad/UploadImage";
import Tokenomic from "pages/launchpad/create/components/ProjectInfor/Tokenomic";
import SectionContainer from "pages/launchpad/create/components/sectionContainer";
import { verifyWhitelist } from "pages/launchpad/create/utils";
import { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";
import { dayToMilisecond } from "utils";
import { millisecondsInADay } from "utils";
import { delay } from "utils";
import { formatNumDynDecimal } from "utils";
import { formatTokenAmount } from "utils";
import { execContractTx } from "utils/contracts";
import { execContractQuery } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";

const EditInfor = ({ visible, setVisible, launchpadData }) => {
  const currentAccount = useSelector((s) => s.wallet.currentAccount);
  const { api } = useAppContext();
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(-1);
  const [availableTokenAmount, setAvailableTokenAmount] = useState(0);
  const tokenDecimal = parseInt(launchpadData?.projectInfo?.token?.decimals);
  const [onCreateNew, setOnCreateNew] = useState(true);
  const [newData, setNewData] = useState(null);
  const dispatch = useDispatch();
  const [projectInfor, setProjectInfor] = useState(null);
  // useEffect(() => {
  //   if (!visible) {
  //     setOnCreateNew(false);
  //     setNewData(null);
  //     setSelectedPhaseIndex(-1);
  //   } else {
  //     if (launchpadData) fetchPhaseData();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [visible, launchpadData]);
  useEffect(() => {
    if (visible === true)
      setProjectInfor(launchpadData?.projectInfo?.projectInfor);
  }, [visible]);
  return (
    <Modal
      onClose={() => setVisible(false)}
      isOpen={visible}
      isCentered
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Project Information</ModalHeader>

        <ModalCloseButton onClick={() => setVisible(false)} />
        <ModalBody sx={{ pb: "28px", maxHeight: "80vh", overflow: "auto" }}>
          <SimpleGrid
            w="full"
            columns={{ base: 1, lg: 3 }}
            spacingX={{ lg: "20px" }}
            spacingY={{ base: "20px", lg: "32px" }}
            mb={{ base: "30px" }}
          >
            <UploadImage
              label="Avatar Image"
              keyInput={`project-infor-1`}
              previewSize={{ width: "120px", height: "120px" }}
              limitedSize={{
                width: "500",
                height: "500",
              }}
              previewUrl={projectInfor?.previewAvatar}
              updatePreviewImage={(value) =>
                setProjectInfor((prev) => ({ ...prev, previewAvatar: value }))
              }
              iconUrl={projectInfor?.avatarImage}
              setImageIPFSUrl={(value) =>
                setProjectInfor((prev) => ({ ...prev, avatarImage: value }))
              }
            />
            <UploadImage
              isDisabled={!projectInfor?.avatarImage}
              label="Featured Image"
              keyInput={`project-infor-2`}
              previewSize={{ width: "180px", height: "120px" }}
              limitedSize={{
                width: "400",
                height: "260",
              }}
              previewUrl={projectInfor?.previewFeatureImage}
              updatePreviewImage={(value) =>
                setProjectInfor((prev) => ({
                  ...prev,
                  previewFeatureImage: value,
                }))
              }
              iconUrl={projectInfor?.featureImage}
              setImageIPFSUrl={(value) =>
                setProjectInfor((prev) => ({ ...prev, featureImage: value }))
              }
            />
            <UploadImage
              isDisabled={
                !(projectInfor?.avatarImage && projectInfor?.featureImage)
              }
              label="Header Image"
              keyInput={`project-infor-3`}
              previewSize={{ width: "180px", height: "120px" }}
              limitedSize={{
                width: "1920",
                height: "600",
              }}
              previewUrl={projectInfor?.previewHeaderImage}
              updatePreviewImage={(value) =>
                setProjectInfor((prev) => ({
                  ...prev,
                  previewHeaderImage: value,
                }))
              }
              iconUrl={projectInfor?.headerImage}
              setImageIPFSUrl={(value) =>
                setProjectInfor((prev) => ({ ...prev, headerImage: value }))
              }
            />
          </SimpleGrid>
          <Box w={{ base: "full" }}>
            <SectionContainer title="Project Name" isRequiredLabel>
              <IWInput
                maxLength={60}
                value={projectInfor?.name}
                onChange={({ target }) => {
                  setProjectInfor({ ...projectInfor, name: target.value });
                }}
                placeholder="Project Name"
              />
            </SectionContainer>
            <SectionContainer title="Project Description" isRequiredLabel>
              <IWTextArea
                maxLength={300}
                value={projectInfor?.description}
                onChange={({ target }) =>
                  setProjectInfor({
                    ...projectInfor,
                    description: target.value,
                  })
                }
                placeholder="Project Description"
              />
            </SectionContainer>
            {/* <Tokenomic updateTokenomic={updateTokenomic} /> */}
            <SimpleGrid columns={[1, 1, 2]} spacing={4}>
              <SectionContainer title="Website">
                <IWInput
                  value={projectInfor?.website}
                  onChange={({ target }) =>
                    setProjectInfor({ ...projectInfor, website: target.value })
                  }
                  placeholder="Project Website"
                />
              </SectionContainer>
              <SectionContainer title="Twitter">
                <IWInput
                  value={projectInfor?.twitter}
                  onChange={({ target }) =>
                    setProjectInfor({ ...projectInfor, twitter: target.value })
                  }
                  placeholder="Project Twitter"
                />
              </SectionContainer>
              <SectionContainer title="Discord">
                <IWInput
                  value={projectInfor?.discord}
                  onChange={({ target }) =>
                    setProjectInfor({ ...projectInfor, discord: target.value })
                  }
                  placeholder="Project Discord"
                />
              </SectionContainer>
              <SectionContainer title="Telegram">
                <IWInput
                  value={projectInfor?.telegram}
                  onChange={({ target }) =>
                    setProjectInfor({ ...projectInfor, telegram: target.value })
                  }
                  placeholder="Project Telegram"
                />
              </SectionContainer>
            </SimpleGrid>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mt: "20px" }}>
            <Button>Update information</Button>
          </Box>
        </ModalBody>
        {/* <ModalFooter>
          
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
};
export default EditInfor;
