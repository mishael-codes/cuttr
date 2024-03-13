// ****************** React Feather
import * as Icon from "react-feather";

const ErrorModal = ({ error }: { error: string }) => {
  return (
    <div className="bg-background shadow-md shadow-red-600 w-fit rounded-lg text-text p-4 flex items-center justify-between">
      <Icon.AlertCircle className="text-red-600 mr-2" />
      {error}
    </div>
  );
};

export default ErrorModal;
