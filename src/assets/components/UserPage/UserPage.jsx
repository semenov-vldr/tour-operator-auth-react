import "./UserPage.sass";
import { useState, useEffect } from "react";

import { db } from "../../../firebase.js";
import useAuth from "../../hooks/useAuth.js";

import ButtonCreate from "../ButtonCreate/ButtonCreate";
import TourCard from "../TourCard/TourCard";
import useAdminTours from "../AdminPage/useAdminTours";


const UserPage = () => {
  const userId = useAuth();


  const [loading, setLoading] = useState(true);


  const {
    tours: newTours,
    loading: newLoading,
    //error: newError
  } = useAdminTours("new", userId);

  const {
    tours: acceptedTours,
    loading: acceptedLoading,
    //error: acceptedError
  } = useAdminTours(true, userId);

  const {
    tours: rejectedTours,
    loading: rejectedLoading,
    //error: rejectedError
  } = useAdminTours(false, userId);




  useEffect(() => {
    if (userId) {
      Promise.all([
      ]).then(() => setLoading(false));
    }

  }, [userId, db]);
// ------------------------------


  return (
    <main className="main userPage">
      <div className="userPage__container container">
        <ButtonCreate />

        {
          loading ? (
            <span>Загрузка...</span>
          ) : (
            <>

              <section className="userPage__section">
                <h2 className="title-section yellow">Новые заявки</h2>

                <div className="userPage__cards">

                  {
                    newTours.length > 0 ? (
                      newTours.map(newTour => (
                        <TourCard
                          key={newTour.tourId}
                          tour={newTour}
                          showButtons={false}
                        />
                      ))
                    ) : <div>Новых заявок нет</div>
                  }
                </div>

              </section>

              <section className="userPage__section">
                <h2 className="title-section green">Одобренные заявки</h2>

                <div className="userPage__cards">
                  {
                    acceptedTours.length > 0 && (
                      acceptedTours.map(acceptedTour => (
                        <TourCard
                          key={acceptedTour.tourId}
                          tour={acceptedTour}
                          showButtons={false}
                        />
                      ))
                    ) || <span>Одобренных заявок нет</span>
                  }
                </div>
              </section>

              <section className="userPage__section">
                <h2 className="title-section red">Отклоненные заявки</h2>

                <div className="userPage__cards">
                  {
                    rejectedTours.length > 0 && (
                      rejectedTours.map(rejectedTour => (
                        <TourCard
                          key={rejectedTour.tourId}
                          tour={rejectedTour}
                          showButtons={false}
                        />
                      ))
                    ) || <span>Отклоненных заявок нет</span>
                  }
                </div>
              </section>
            </>
          )
        }


      </div>
    </main>
  );
};

export default UserPage;