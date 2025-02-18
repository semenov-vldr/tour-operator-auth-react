import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { endSession, getSession, isLoggedIn } from "../../../session";

import logo from "../../icons/logo.svg"
import logoText from "../../icons/logo-text.svg"
import userIcon from "../../icons/user-icon.svg"
import "./Header.sass"


const Header = ( { pageUser = false } ) => {
  const widthMobile = window.matchMedia("(max-width: 768px)").matches;

  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isMobile, setIsMobile] = useState(widthMobile);

  useEffect(() => {
    if (!isLoggedIn()) {
      // navigate("/login");
    }
    let session = getSession();
    setEmail(session.email);
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(widthMobile);
    window.addEventListener(("resize"), handleResize);
    return () => window.addEventListener(("resize"), handleResize);
  },[]);

  const onLogout = () => {
    endSession();
    navigate("/login");
  }


  return (
    <header className="header">
      <div className="header__container container">
        <img className="header__logo header__icon" src={isMobile ? logo : logoText} alt="logo" />

        { pageUser? (
          <>
            <div className="header__user">
              <span className="header__user-email">{email}</span>
              <img className="header__user-icon header__icon" src={userIcon} alt="user-icon" />
            </div>
            <button className="header__button" onClick={onLogout}>Выйти</button>
          </>
          ): (
            <span>Admin</span>
          )
        }


      </div>
    </header>
  );
};

export default Header;