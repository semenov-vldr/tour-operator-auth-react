import Header from "../assets/components/Header/Header.jsx"
import UserPage from "../assets/components/UserPage/UserPage.jsx"

const Admin = () => {

  return (
    <>
      <Header pageUser={false}  />
      <UserPage />
    </>
  );
};

export default Admin;