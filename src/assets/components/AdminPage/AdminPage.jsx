import "../UserPage/UserPage.sass";

import TourCard from "../TourCard/TourCard";
import NavigateToTravelAgencies from "../NavigateToTravelAgencies/NavigateToTravelAgencies";
import useAdminTours from "./useAdminTours";



const AdminPage = () => {

  const {
    tours: newTours,
    loading: newLoading,
    //error: newError
  } = useAdminTours("new");

  const {
    tours: acceptedTours,
    loading: acceptedLoading,
    //error: acceptedError
  } = useAdminTours(true);

  const {
    tours: rejectedTours,
    loading: rejectedLoading,
    //error: rejectedError
  } = useAdminTours(false);



  return (
    <main className="main userPage">
      <div className="userPage__container container">

        <NavigateToTravelAgencies route="there" />

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
                              showButtons={true}
                            />
                          ))
                        ) : <div>Новых заявок нет</div>
                      }
                    </div>

                  ) : <span>Загрузка...</span>
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
                            />
                          ))
                        ) || <span>Новых одобренных нет</span>
                      }
                    </div>

                  ) : <span>Загрузка...</span>
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

                  ) : <span>Загрузка...</span>
                }
              </section>
            </>



      </div>
    </main>
  );
};

export default AdminPage;