import { useAppContext } from "contexts/AppContext";
import { useSelector } from "react-redux";

const Launchpad = () => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  return <div>adsa</div>;
};
export default Launchpad;
