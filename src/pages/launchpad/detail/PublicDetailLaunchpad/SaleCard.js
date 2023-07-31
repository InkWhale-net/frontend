import { Box, Button, Heading, Progress } from "@chakra-ui/react";
import IWInput from "components/input/Input";

const SaleCard = () => {
  return (
    <Box
      sx={{
        border: "2.8px solid #93F0F5",
        borderRadius: "8px",
        paddingTop: "16px",
        paddingLeft: "8px",
        paddingRight: "8px",
        paddingBottom: "12px",
      }}
    >
      <Heading sx={{ textAlign: "center" }} size="md">
        Sale end in
      </Heading>
      <Box
        display="flex"
        sx={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        {["00", "00", "00", "00"].map((e, index) => {
          return (
            <>
              <Box
                sx={{
                  background: "#FEEEBD",
                  width: "40px",
                  height: "40px",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  fontWeight: "bold",
                  borderRadius: "4px",
                }}
              >
                00
              </Box>
              {index < 3 && (
                <Box
                  sx={{
                    fontWeight: "bold",
                    marginLeft: "4px",
                    marginRight: "4px",
                  }}
                >
                  :
                </Box>
              )}
            </>
          );
        })}
      </Box>
      <Box sx={{ marginTop: "12px" }}>
        <Heading size="md">Progress {`(20.00%)`}</Heading>
        <Progress sx={{ marginTop: "4px" }} w="full" value={20} size="sm" />
      </Box>
      <Box sx={{ marginTop: "12px" }}>
        <IWInput
          onChange={({ target }) => {
            // setSelectedContractAddr(target.value)
          }}
          value={"0.0"}
          label={`Amount (max)`}
          inputRightElementIcon={
            <Button w="50px" height={"40px"} onClick={() => {}}>
              Max
            </Button>
          }
        />
      </Box>
      <Button
        sx={{ w: "100px", height: "40px", marginTop: "8px" }}
        onClick={() => {}}
      >
        Buy
      </Button>
    </Box>
  );
};

export default SaleCard;
