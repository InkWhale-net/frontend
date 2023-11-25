import { BsDot } from "react-icons/bs";

export const RequireKyc = () => {
  return (
    <div
      style={{
        background: "#93F0F5",
        paddingLeft: "12px",
        paddingRight: "12px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: "14px",
        color: "#57527E",
        marginRight: "4px",
      }}
    >
      KYC
    </div>
  );
};
export const UpcomingStatusTag = () => {
  return (
    <div
      style={{
        background: "#E3DFF3",
        paddingLeft: "8px",
        paddingRight: "12px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: "14px",
        color: "#57527E",
      }}
    >
      <BsDot size={"20px"} color="#57527E" />
      Upcoming
    </div>
  );
};

export const LiveStatusTag = () => {
  return (
    <div
      style={{
        background: "#E1FFD6",
        paddingLeft: "8px",
        paddingRight: "12px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: "14px",
        color: "#57527E",
      }}
    >
      <BsDot size={"20px"} color="#9CDE85" />
      On-going
    </div>
  );
};
export const EndStatusTag = () => {
  return (
    <div
      style={{
        background: "#FFE1E1",
        paddingLeft: "8px",
        paddingRight: "12px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: "14px",
        color: "#57527E",
      }}
    >
      <BsDot size={"20px"} color="#FF9595" />
      Ended
    </div>
  );
};
