import { ShowIfProps } from "../Configuration/types";

const ShowIf: React.FC<ShowIfProps> = ({ condition, render, renderElse }) => {
  if (condition) {
    return <>{render()}</>;
  }
  if (renderElse) {
    return <>{renderElse()}</>;
  }
  return null;
};

export default ShowIf;
