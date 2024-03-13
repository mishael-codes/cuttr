// ****************** React Feather
import * as Icon from "react-feather"
const LinkIconAnimation = ({index, marginTop}: {index: string, marginTop: string}) => {

  return (
    <div className={`absolute h-[80vh] w-full ${index} ${marginTop} hidden md:block`}>
        <Icon.Link className="absolute text-accent top-0 left-[10%] scale-150 linkIcon1" />
        <Icon.Link className="absolute text-accent top-0 right-[10%] scale-150 linkIcon1" />
        <Icon.Link className="absolute text-accent top-[20%] left-[10%] scale-150 linkIcon2" />
        <Icon.Link className="absolute text-accent top-[20%] right-[10%] scale-150 linkIcon2" />
        <Icon.Link className="absolute text-accent top-[40%] left-[10%] scale-150 linkIcon3" />
        <Icon.Link className="absolute text-accent top-[40%] right-[10%] scale-150 linkIcon3" />
        <Icon.Link className="absolute text-accent top-[60%] left-[10%] scale-150 linkIcon4" />
        <Icon.Link className="absolute text-accent top-[60%] right-[10%] scale-150 linkIcon4" />
      </div>
  );
};

export default LinkIconAnimation;