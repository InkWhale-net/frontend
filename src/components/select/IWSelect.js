import { FormControl, FormLabel, Heading, Select } from "@chakra-ui/react";
import React from "react";

function IWSelect({ label, dataList }) {
  return (
    <FormControl>
      {label && (
        <FormLabel>
          <Heading as="h4" size="h4" mb="12px">
            {" "}
            {label}
          </Heading>
        </FormLabel>
      )}

      <Select id="token" defaultValue="Select token">
        {dataList.map((item, idx) => (
          <option key={idx} value={item}>
            {item}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

export default IWSelect;
