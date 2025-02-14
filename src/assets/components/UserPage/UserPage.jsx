import "./UserPage.sass"
import ButtonCreateTest from "../ButtonCreate/ButtonCreateTest";
import CloseIcon from "../../icons/close.svg"

const UserPage = () => {
  return (

    <main className="main userPage">
      <div className="userPage__container container">

        <ButtonCreateTest />

        <section className="userPage__section">
          <h2 className="title-section yellow">Заявки в ожидании</h2>

          <div className="userPage__cards">

            <article className="userPage__card">
              <div className="userPage__card-top">
                <span className="userPage__card-sender">ООО «Тревел Технологии»</span>
                <button className="userPage__card-close">
                  <img src={CloseIcon} />
                </button>
              </div>

              <h3 className="userPage__card-title">Тур в Адыгею. Плато Лаго-Наки</h3>
              <div className="userPage__card-data">
                <div className="userPage__card-data-item">
                  <span>Количество чел:</span>
                  50-60</div>
                <div className="userPage__card-data-item">
                  <span>Дата:</span>
                  01.01.2025 - 08.01.2025</div>
              </div>
              <div className="userPage__card-buttons">
                <button className="button button-cancel">Отклонить</button>
                <button className="button button-success">Принять</button>
                <button className="button button-outline">Подробнее</button>
              </div>
            </article>



          </div>
        </section>


      </div>
    </main>
  );
};

export default UserPage;