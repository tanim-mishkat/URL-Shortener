import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const AuthPage = () => {
  const [login, setLogin] = useState(true);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {login ? (
        <LoginForm setLogin={setLogin} />
      ) : (
        <RegisterForm setLogin={setLogin} />
      )}
    </div>
  );
};

export default AuthPage;
