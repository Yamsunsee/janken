import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { toast } from "react-toastify";
import { isValidData, signIn } from "../utils";

const SignIn = ({ toggle }) => {
  const [state, dispatch] = useStore();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setRemember] = useState(false);
  const input = useRef();

  useEffect(() => {
    const remember = JSON.parse(localStorage.getItem("janken-remember"));
    if (remember) {
      setRemember(true);
      setName(remember.name);
      setPassword(remember.password);
    }
  }, []);

  useEffect(() => {
    if (toggle) {
      setName("");
      setPassword("");
    } else {
      input.current.focus();
    }
  }, [toggle]);

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!isValidData(name, password)) {
      toast.error("Your username or password is invalid!");
      setLoading(false);
      return;
    }
    try {
      const formData = { name, password };
      const response = await signIn(formData);
      if (!response.isSuccess) return;
      dispatch({ type: "CHANGE_SELF", payload: response.data });
      localStorage.setItem("janken-data", JSON.stringify(response.data));
      if (isRemember) {
        localStorage.setItem("janken-remember", JSON.stringify(formData));
      } else {
        localStorage.removeItem("janken-remember");
      }
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data.message || "The server is busy now! Try again later!");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 flex items-center">
      <form onSubmit={handleSignIn} className="flex flex-col gap-8 w-full">
        <div className="text-5xl font-bold">Sign in</div>
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
        <div>
          <input
            type="checkbox"
            id="checkbox"
            className="mr-1 accent-slate-700"
            checked={isRemember}
            onChange={() => setRemember((prev) => !prev)}
          />
          <label htmlFor="checkbox">Remember me</label>
        </div>
        <button type="submit" className={`button ${isLoading ? "disabled" : null}`}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default SignIn;
