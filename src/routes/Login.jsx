import { useState } from "react";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";

const Login = () => {
  const [isSignUp, setSignUp] = useState(false);

  return (
    <div className="min-h-screen flex justify-center items-center select-none">
      <div className="w-[60rem] h-[30rem] grid grid-cols-2 shadow-2xl relative text-slate-700 font-semibold">
        <div
          className={`w-[30rem] absolute h-full bg-white transform transition-all duration-500 flex flex-col justify-center items-center ${
            isSignUp ? "translate-x-full border-l" : "border-r"
          }`}
        >
          <div
            className={`absolute text-2xl 2xl:text-3xl transform transition-all ${
              isSignUp ? "-translate-y-20 opacity-0" : "-translate-y-3/4 delay-300"
            }`}
          >
            Not a member yet?
          </div>
          <div
            onClick={() => setSignUp(true)}
            className={`absolute transform transition-[transform,opacity] button ${
              isSignUp ? "translate-y-32 opacity-0" : "translate-y-3/4 delay-300 cursor-pointer"
            }`}
          >
            Sign up
          </div>
          <div
            className={`absolute transform transition-all text-2xl 2xl:text-3xl ${
              isSignUp ? "-translate-y-3/4 delay-300" : "-translate-y-20 opacity-0"
            }`}
          >
            Already have an account?
          </div>
          <div
            onClick={() => setSignUp(false)}
            className={`absolute transform transition-[transform,opacity] button ${
              isSignUp ? "translate-y-3/4 delay-300 cursor-pointer" : "translate-y-32 opacity-0"
            }`}
          >
            Sign in
          </div>
        </div>
        <SignUp toggle={isSignUp} handleToggle={setSignUp} />
        <SignIn toggle={isSignUp} />
      </div>
    </div>
  );
};

export default Login;
