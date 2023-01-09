import { useEffect, useState } from "react";
import { useStore } from "../store";
import { getInvitations, removeInvitations, addFriends } from "../utils";

const Notifications = () => {
  const [{ socket, self }, dispatch] = useStore();
  const [isShow, setShow] = useState(false);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    self._id && fetchInvitations();
  }, [self]);

  const fetchInvitations = async () => {
    const response = await getInvitations(self._id);
    if (response.isSuccess) {
      setInvitations(response.data);
    }
  };

  useEffect(() => {
    socket.on("invitations", () => {
      fetchInvitations();
    });
  }, [socket]);

  const handleAcceptInvitations = async (data) => {
    setInvitations((prev) => prev.filter((invitation) => invitation.name === data.name));
    const response = await addFriends(self._id, data._id);
    if (response.isSuccess) {
      socket.emit("friends-accept", data.name);
      fetchInvitations();
    }
  };

  const handleDeclineInvitations = async (data) => {
    setInvitations((prev) => prev.filter((invitation) => invitation.name === data.name));
    const response = await removeInvitations(self._id, data._id);
    if (response.isSuccess) {
      fetchInvitations();
    }
  };

  return (
    <div
      onClick={() => setShow((prev) => !prev)}
      className={`notifications ${invitations.length > 0 ? "active" : null} ${isShow ? "show" : null}`}
    >
      <ion-icon name="notifications"></ion-icon>
      {isShow && (
        <div className="notifications-items">
          {invitations.length > 0 ? (
            invitations.map((invitation) => (
              <div
                key={invitation.name}
                onClick={(event) => event.stopPropagation()}
                className="flex justify-between items-center p-4 border border-dashed border-white hover:border-[#ccc]"
              >
                <div className="italic">
                  <span className="font-bold text-slate-700">{invitation.name}</span>'s friend request
                </div>
                <div className="flex gap-1">
                  <div
                    onClick={() => handleAcceptInvitations(invitation)}
                    className="text-2xl flex justify-center items-center hover:text-green-500 cursor-pointer"
                  >
                    <ion-icon name="checkmark-circle"></ion-icon>
                  </div>
                  <div
                    onClick={() => handleDeclineInvitations(invitation)}
                    className="text-2xl flex justify-center items-center hover:text-red-500 cursor-pointer"
                  >
                    <ion-icon name="close-circle"></ion-icon>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="italic text-[#ccc] text-center">No notifications</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
