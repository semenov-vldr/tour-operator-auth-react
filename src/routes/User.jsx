import Header from "../assets/components/Header/Header.jsx"
import UserPage from "../assets/components/UserPage/UserPage.jsx"

const User = () => {
  return (
    <>
      <Header pageUser={true} />
      <UserPage />
    </>
  );
};

export default User;