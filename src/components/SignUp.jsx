import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { isValidData, signUp } from "../utils";

const SignUp = ({ toggle, handleToggle }) => {
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const input = useRef();

  useEffect(() => {
    if (toggle) {
      input.current.focus();
    } else {
      setName("");
      setPassword("");
    }
  }, [toggle]);

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!isValidData(name, password)) {
      toast.error(
        "Please enter a username and password that are at least 3 characters long and contain only the letters a-z, A-Z, or 0-9!"
      );
      setLoading(false);
      return;
    }
    try {
      const formData = { name, password };
      const response = await signUp(formData);
      if (!response.isSuccess) return;
      toast.success("Your account has been created! Please sign in to continue!");
      handleToggle(false);
    } catch (error) {
      toast.error(error?.response?.data.message || "The server is busy now! Try again later!");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 flex items-center">
      <form onSubmit={handleSignUp} className="flex flex-col gap-8 w-full">
        <div className="text-5xl font-bold">Sign up</div>
        <div>
          <div>
            Username <span className="text-red-500">*</span>
          </div>
          <input
            required
            ref={input}
            type="text"
            value={name}
            onChange={handleChangeName}
            className="focus:outline-none border border-slate-700 w-full px-4 py-2 mt-2"
          />
        </div>
        <div>
          <div>
            Password <span className="text-red-500">*</span>
          </div>
          <input
            required
            type="password"
            value={password}
            onChange={handleChangePassword}
            className="focus:outline-none border border-slate-700 w-full px-4 py-2 mt-2"
          />
        </div>
        <button type="submit" className={`button ${isLoading ? "disabled" : null}`}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default SignUp;
