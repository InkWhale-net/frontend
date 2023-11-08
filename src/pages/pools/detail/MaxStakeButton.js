import { Box, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
export const MaxStakeButton = ({ disabled, setStakeMax, setUnstakeMax }) => {
  return (
    <Menu>
      <MenuButton disabled={disabled}>
        <Box
          sx={{
            w: "60px",
            bg: "#A4F4F9",
            fontSize: "14px",
            borderRadius: "4px",
            color: "#57527E",
            fontWeight: "700",
          }}
        >
          Max
        </Box>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => setStakeMax && setStakeMax()}>Stake</MenuItem>
        <MenuItem onClick={() => setUnstakeMax && setUnstakeMax()}>
          Unstake
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
