import { BsDot } from "react-icons/bs";
import { AiOutlineLock } from "react-icons/ai";

export const UpcomingStatusTag = () => {
  return (
    <div
      style={{
        position: "absolute",
        right: "8px",
        top: "8px",
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
      <AiOutlineLock style={{ marginRight: "4px" }} color="#57527E" />
      Upcoming
    </div>
  );
};

export const LiveStatusTag = () => {
  return (
    <div
      style={{
        position: "absolute",
        right: "4px",
        top: "8px",
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
        position: "absolute",
        right: "4px",
        top: "8px",
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
