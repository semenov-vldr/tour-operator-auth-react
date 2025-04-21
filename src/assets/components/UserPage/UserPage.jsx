import "./UserPage.sass";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth.js";

import ButtonCreate from "../ButtonCreate/ButtonCreate";
import TourCard from "../TourCard/TourCard";
import ToursForUser from "./ToursForUser";
import SkeletonCardTemplate from "../SkeletonCardTemplate/SkeletonCardTemplate";



const UserPage = () => {
  const { userId: authUserId, loading: authLoading } = useAuth();
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    if (authUserId) {
      setUserId(authUserId);
    }
  }, [authUserId]);


  const {
    tours: newTours,
    loading: newLoading,
    //error: newError
  } = ToursForUser("new", userId);

  const {
    tours: acceptedTours,
    loading: acceptedLoading,
    //error: acceptedError
  } = ToursForUser(true, userId);

  const {
    tours: rejectedTours,
    loading: rejectedLoading,
    //error: rejectedError
  } = ToursForUser(false, userId);


  return (
    <main className="main userPage">
      <div className="userPage__container container">
        <ButtonCreate />

        {
          !authLoading &&
          <>
            <section className="userPage__section">
              <h2 className="title-section yellow">Новые заявки</h2>

              {
                !newLoading ? (

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
                ) :  <div className="userPage__cards">
                  <SkeletonCardTemplate />
                  <SkeletonCardTemplate />
                </div>
              }
            </section>

            <section className="userPage__section">
              <h2 className="title-section green">Одобренные заявки</h2>

              {
                !acceptedLoading ? (
                  <div className="userPage__cards">
                    {
                      acceptedTours.length > 0 && (
                        acceptedTours.map(acceptedTour => (
                          <TourCard
                            key={acceptedTour.tourId}
                            tour={acceptedTour}
                            showButtons={false}
                            isUser={true}
                          />
                        ))
                      ) || <span>Одобренных заявок нет</span>
                    }
                  </div>
                ) : <div className="userPage__cards">
                  <SkeletonCardTemplate />
                  <SkeletonCardTemplate />
                </div>
              }
            </section>

            <section className="userPage__section">
              <h2 className="title-section red">Отклоненные заявки</h2>

              {
                !rejectedLoading ? (
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
                ) : <div className="userPage__cards">
                  <SkeletonCardTemplate />
                  <SkeletonCardTemplate />
                </div>
              }
            </section>
          </>

        }

      </div>
    </main>
  );
};

export default UserPage;