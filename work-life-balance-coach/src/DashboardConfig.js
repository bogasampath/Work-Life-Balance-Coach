import React, { useEffect, useState } from "react";
import { Form, Col, Input, Modal, Image } from "antd";
import "./DashboardConfig.css";
import logo from "./work-life-balance-logo.png";
import settings from "./settings.png";

const taskDone = 0;

const DashboardConfig = (props) => {
  const [taskDone, setTaskDone] = useState(0);
  const [totaltasks, setTotalTasks] = useState(0);

  const [tasks, setTasks] = useState([
    { name: "totalTasks", value: totaltasks },
    { name: "taskDone", value: taskDone },
  ]);
  const [data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userResponse, setUserResponse] = useState(false);

  const quotes = [
    "Believe in yourself! Have faith in your abilities! Be led by the dreams in your heart.",
    "Strength is the product of struggle. Work hard, stay consistent, and be patient.",
    "Never give up. You always get what you work for.",
    "All our dreams can come true, if we have the courage to pursue them. Nothing can be done without hope and confidence.",
  ];

  const quote_time = 3600000;
  const posture_time = 2500000;
  const break_time =
    parseInt(data?.breakInterval) >= 1
      ? parseInt(data?.breakInterval) * 60 * 60 * 1000
      : 2500000;

  useEffect(() => {
    lunch_break();
    Notification.requestPermission();

    const interval = setInterval(() => {
      let randomNum;
      randomNum = parseInt(0 + Math.random() * (4 - 0));
      notifyUser(quotes[randomNum]);
      lunch_break();
    }, quote_time);

    const backPosture = setInterval(() => {
      notifyUser(
        "Hey! remember straight and proper posture is good for you,\n and please drink water"
      );
    }, posture_time);

    const shortBreaks = setInterval(() => {
      notifyUser("Hey, its time to take quick break and walk around a bit");
    }, break_time);

    return () => (
      clearInterval(backPosture),
      clearInterval(interval),
      clearInterval(shortBreaks)
    );
  }, []);
  const lunch_break = () => {
    const time = new Date();

    if (time.getHours() >= 13 && time.getHours() <= 14) {
      console.log(time.getHours());
      notifyUser("Hey! its time for Lunch..!");
    }
  };

  async function notifyUser(notifiactionText = "Notifiactions are enabled..!") {
    if (!("Notification" in window)) {
      alert("Browser does not support");
    } else if (Notification.permission === "granted") {
      const notifiaction = new Notification("Work-Life-Balance", {
        body: notifiactionText,
        icon: logo,
      });
      setTasks((prev) => prev + 1);
      notifiaction.onclick = (e) => {
        setTaskDone((prev) => prev + 1);
      };
    } else if (Notification.permission !== "denied") {
      await Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          const notifiaction = new Notification(notifiactionText);
        }
      });
    }
  }

  const showModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(data);
    setIsModalOpen(false);
  };

  const enableNotification = async () => {
    await notifyUser().then(() => {
      setUserResponse(true);
    });
  };

  const diableNotification = () => {
    userResponse(true);
  };
  const myJSON = JSON.stringify(tasks);
  return (
    <div>
      <img className="logo" src={logo} alt="Work-Life-Balance" />
      <img
        className="settings"
        src={settings}
        alt="settings"
        onClick={showModal}
      />

      {!userResponse && !(!Notification.permission === "granted") ? (
        <div>
          <title>Notifiactions</title>
          <p>please check & Enable Notifications..!</p>
          <button onClick={enableNotification}>OK</button>
        </div>
      ) : Notification.permission === "granted" ? (
        <div className="data-box">
          <div>Hi {data?.name ? data?.name : "Guest"}</div>
          <p>Total Tasks: {totaltasks}</p>
          <p>Task Done: {taskDone}</p>
          <p>{myJSON}</p>
        </div>
      ) : (
        <>Please Enable Notifiactions</>
      )}
      {/* <div className={`form ${isModalOpen ? "showForm" : "hideForm"}`}>
        <form onSubmit={handleSubmit}>
          <Col>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={data.name || ""}
                onChange={handleChange}
              />
            </label>
          </Col>
          <Col>
            <label>
              Total working Hours:
              <input
                type="number"
                name="totalHours"
                value={data.totalHours || ""}
                onChange={handleChange}
                //defaultValue={"1"}
              />
              <span>Hrs</span>
            </label>
          </Col>
          <Col>
            <label>
              break reminder:
              <input
                type="number"
                name="breakInterval"
                value={data.breakInterval || ""}
                onChange={handleChange}
              />
              <span>Hrs</span>
            </label>
          </Col>

          <input type="submit" value="Submit" />
        </form>
      </div> */}

      <div id="myModal" className={`modal ${isModalOpen ? "modal-show" : ""}`}>
        <div className="modal-content">
          <span className="close" onClick={() => setIsModalOpen(false)}>
            &times;
          </span>
          <form onSubmit={handleSubmit}>
            <Col>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={data.name || ""}
                  onChange={handleChange}
                />
              </label>
            </Col>
            <Col>
              <label>
                Total working Hours:
                <input
                  type="number"
                  name="totalHours"
                  value={data.totalHours || ""}
                  onChange={handleChange}
                  //defaultValue={"1"}
                />
                <span>Hrs</span>
              </label>
            </Col>
            <Col>
              <label>
                break reminder:
                <input
                  type="number"
                  name="breakInterval"
                  value={data.breakInterval || ""}
                  onChange={handleChange}
                />
                <span>Hrs</span>
              </label>
            </Col>

            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardConfig;
