import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { endSession, getSession } from "../../../session";

import useAuthentication from "../../hooks/useAuthentication.js";

import logo from "../../icons/logo.svg";
import logoText from "../../icons/logo-text.svg";
import userIcon from "../../icons/user-icon.svg";
import "./Header.sass";


const Header = ( { pageUser } ) => {
  const widthMobile = window.matchMedia("(max-width: 768px)").matches;

  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isMobile, setIsMobile] = useState(widthMobile);
  const { user, loading, logout } = useAuthentication();

  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user && location.pathname !== "/register") {
        navigate('/login', { replace: true });
      } else {
        let session = getSession();
        setEmail(session?.email || "");
      }
    }
  }, [navigate, loading, user]);

  useEffect(() => {
    const handleResize = () => setIsMobile(widthMobile);
    window.addEventListener(("resize"), handleResize);
    return () => window.addEventListener(("resize"), handleResize);
  },[]);

  const onLogout = async () => {
    await logout();
    endSession();
    navigate("/login", { replace: true });
  }

  return (
    <header className="header">
      <div className="header__container container">
        <img className="header__logo header__icon" src={isMobile ? logo : logoText} alt="logo" />

        { pageUser === "signIn" &&
          <>
            <div className="header__user">
              <span className="header__user-email">{email}</span>
              <img className="header__user-icon header__icon" src={userIcon} alt="user-icon" />
            </div>
            <button className="header__button" onClick={onLogout}>Выйти</button>
          </>
          }

      </div>
    </header>
  );
};

export default Header;