import {useNavigate} from "react-router-dom";

const ButtonNavigateToTravelAgencies = ({route}) => {
  let navigate = useNavigate();

  const routes = {
    there: "/travel-agencies",
    back: "/admin",
  };

  const buttonText = {
    there: "Все партнеры",
    back: "Назад",
  }

  function navigateTo() {
    const path = routes[route];
    if (path) {
      navigate(path, { replace: true });
    } else {
      console.warn(`Неизвестный route: {route}`);
    }
  };


  return (
    <button onClick={navigateTo} className="button button-outline">
      {buttonText[route] || "Неизветный route"}
    </button>
  );
};

export default ButtonNavigateToTravelAgencies;