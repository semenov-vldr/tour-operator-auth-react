import Header from "../assets/components/Header/Header";
import UserPage from "../assets/components/UserPage/UserPage";

const Admin = () => {

  return (
    <>
      <Header pageUser="signIn" />
      <UserPage isUser={false} />
    </>
  );
};

export default Admin;