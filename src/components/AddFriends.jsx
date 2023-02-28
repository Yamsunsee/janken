import { useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "../store";
import { isValidData, addInvitations } from "../utils";

const AddFriends = () => {
  const [{ socket, self, friends }, dispatch] = useStore();
  const [isShow, setShow] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleInvitations = async (event) => {
    if (event.key === "Enter") {
      const name = event.target.value;
      event.target.value = "";
      if (!isValidData(name)) return toast.error("Your friend's name is invalid!");
      else if (name === self.name) return toast.error("Is that you?");
      else if (friends.map((friend) => friend.name).includes(name.toLowerCase()))
        return toast.error(name + " has already been your friend!");
      setLoading(true);
      try {
        const response = await addInvitations(self._id, name);
        if (response.isSuccess) {
          socket.emit("friends-add", name);
          toast.success("Your request has been sent!");
        }
      } catch (error) {
        toast.error(error?.response?.data.message || "The server is busy now! Try again later!");
      }
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between px-8 pt-4 pb-2 text-[#ccc]">
        <div className={`italic ${isShow ? "text-slate-700" : "text-[#ccc]"}`}>Friends</div>
        <div className="flex items-center cursor-pointer hover:text-slate-700">
          {isShow ? (
            <ion-icon name="trash-bin"></ion-icon>
          ) : (
            <div onClick={() => setShow(true)}>
              <ion-icon name="person-add"></ion-icon>
            </div>
          )}
        </div>
      </div>
      {isShow && (
        <div className="relative">
          <input
            type="text"
            placeholder={`${isLoading ? "Sending request" : "Enter your friend's name"}`}
            autoFocus
            onBlur={() => setShow(false)}
            onKeyDown={handleInvitations}
            className="w-full focus:outline-none px-8 py-4 border-y-2 border-dashed border-[#ccc] text-slate-700 placeholder:text-[#ccc] placeholder:italic"
          />
        </div>
      )}
    </div>
  );
};

export default AddFriends;
