import "../UserPage/UserPage.sass";
import { useState, useEffect } from "react";

import { db } from "../../../firebase.js";

import TourCard from "../TourCard/TourCard";
import NavigateToTravelAgencies from "../NavigateToTravelAgencies/NavigateToTravelAgencies";

import useNewAdminTours from "./useNewAdminTours";
import NewAcceptedTours from "./NewAcceptedTours";
import fetchNewRejectedTours from "./fetchNewRejectedTours";


const AdminPage = () => {

  const { newToursAdmin } = useNewAdminTours();
  const { acceptedToursAdmin } = NewAcceptedTours();
  const { rejectedToursAdmin } = fetchNewRejectedTours();

  const [loading, setLoading] = useState(true);



  useEffect(() => {
      Promise.all([])
        .then(() => setLoading(false));
  }, [db]);



  return (
    <main className="main userPage">
      <div className="userPage__container container">

        <NavigateToTravelAgencies route="there" />

        {
          loading ? (
            <span>Загрузка...</span>
          ) : (

            <>
              <section className="userPage__section">
                <h2 className="title-section yellow">Новые заявки</h2>

                <div className="userPage__cards">

                  {
                    newToursAdmin.length > 0 ? (
                      newToursAdmin.map(newTourAdmin => (
                        <TourCard
                          userId={newTourAdmin.userId}
                          key={newTourAdmin.tourId}
                          tour={newTourAdmin}
                          showButtons={true}
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
                    acceptedToursAdmin.length > 0 && (
                      acceptedToursAdmin.map(acceptedTour => (
                        <TourCard
                          userId={acceptedTour.userId}
                          key={acceptedTour.tourId}
                          tour={acceptedTour}
                          showButtons={false}
                        />
                      ))
                    ) || <span>Новых одобренных нет</span>
                  }
                </div>
              </section>

              <section className="userPage__section">
                <h2 className="title-section red">Отклоненные заявки</h2>

                <div className="userPage__cards">
                  {
                    rejectedToursAdmin.length > 0 && (
                      rejectedToursAdmin.map(rejectedTour => (
                        <TourCard
                          userId={rejectedTour.userId}
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

export default AdminPage;