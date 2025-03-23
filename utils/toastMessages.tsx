import { toast } from "react-toastify";
import { MdCheckCircle, MdError } from "react-icons/md";

export const showToast = (message: string, type: 'success' | 'error') => {
  const icon = type === 'success' ? <MdCheckCircle className="mr-2 text-green-500" /> : <MdError className="mr-2 text-red-500" />;
  
  toast[type](
    <div className="flex items-center">
      {icon}
      {message}
    </div>,
    {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    }
  );
};
