// ****************** React Feather
import * as Icon from "react-feather";
const SuccessModal = ({ success }: { success: string }) => {
  return (
    <div className="bg-background shadow-md shadow-green-600 w-fit rounded-lg text-text p-4 flex items-center justify-between">
      <Icon.CheckCircle className="text-green-600 mr-2" />
      {success}
    </div>
  );
};

export default SuccessModal;
