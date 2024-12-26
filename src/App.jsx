import React from "react";
import DatePicker from 'react-datepicker';
import { useState, useEffect, useId } from "react";
import { v4 as uuidv4 } from 'uuid';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import { IconContext } from 'react-icons'; //IconContextをインポート
import { FaRegCalendarAlt } from "react-icons/fa"; // カレンダーアイコンの呼び出し

function App() {
  const [tasks, setTasks] = useState([]);                       // 進行中タスクの状況を管理
  const [newTaskName, setNewTaskName] = useState('');           // 新規作成するタスク名を管理
  const [time, setTime] = useState(new Date());                 // 現在時刻を管理
  const [selectedDate, setSelectedDate] = useState(null);       // DatePickerを管理
  const [isPopupVisible, setIsPopupVisible] = useState(false);  // ポップアップの表示・非表示を管理

  /*================================================================================*/
  // 現在時刻表示レイアウト //

  useEffect(() => { // 毎秒現在時刻を更新する処理
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer); // クリーンアップ
  }, []);

  const formatTime = (date) => { // 時刻のフォーマットを設定
    return date.toLocaleTimeString("en-US", {
      hour12: false, // 24時間表示
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => { // 日付のフォーマットを設定
    return date.toLocaleDateString("ja-JP", {
      weekday: "short",  // 曜日 (例: 金)
      year: "numeric",   // 年 (例: 2024年)
      month: "long",     // 月 (例: 1月)
      day: "numeric",    // 日 (例: 1日)
    });
  };


  // ローカルストレージに一時保存された問い合わせ内容を配列形式で取得
  const [formDataList, setFormDataList] = useState([]);
  useEffect(() => {
      const data = JSON.parse(localStorage.getItem("formDataList")) || [];
      setFormDataList(data);
  }, []);

/*================================================================================*/
  // ポップアップ処理 //
  const openPopup = () => {setIsPopupVisible(true)};    // ポップアップを開く
  const closePopup = () => {setIsPopupVisible(false)};  // ポップアップを閉じる

  /*================================================================================*/
  // カレンダーPopup //
  
  const handleDateChange = (date, id) => { // 日付選択した時の処理
    setTasks(tasks.map(task =>
        task.id === id ? { ...task, endday: date ? date.toISOString() : null } : task
    ));
};

/*================================================================================*/
  // タスク処理 //

  // 新規作成処理 //
  const handleAddTask = () => { 
    if (newTaskName.trim() === '') return; // 空の場合は追加しない
    const myId = uuidv4(); // Taskのidを作成

    // 新規作成するタスクの各項目の初期値を設定
    const newTask = {           
      id: myId,                                                 // idを設定
      taskname: newTaskName,                                    // タスク名を設定
      startday: new Date().toISOString(),                       // 開始日を設定
      endday: selectedDate ? selectedDate.toISOString() : null, // 終了日を設定
      contents: "",                                             // タスクの内容を設定
      other: "",                                                // その他を設定
      completed: false,                                         // タスクの完了状態を設定
    }
    setTasks([...tasks, newTask]);  // タスクを追加
    setNewTaskName('');             // タスク名入力欄をクリア
    setSelectedDate(null);          // 終了日入力欄をクリア
    closePopup();                   // 追加後ポップアップを閉じる
  };

  //　タスク完了処理
  const handleCompleteTask = (id) => {
    setTasks(
      tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task // 値を反転
          // true→false、false→trueに変更される(データ型のみ？)
      )
    );
  };

  // 進行中のタスクを取得
  const todoTasks = tasks.filter(task => !task.completed);

  // 完了済のタスクを取得
  const completedTasks = tasks.filter(task => task.completed);

  {/* HTMLを表示する */}
  return (
    <>
      <div className="Todo-container">
        <div className="header-area">
          <h1 className="Title">ToDo App</h1>
          <div className="clock-area">
            <div className="time-display">{formatTime(time)}</div>
            <div className="date-display">{formatDate(time)}</div>
          </div>
          <button className="btn0" onClick={openPopup}>タスクを追加</button>
          <div className="Title-area" >
            <h3>To Do</h3>
            <h3>Complete</h3>
          </div>
        </div>
        <div className="body-area">
          <div className="list-area">
              {/* 進行中エリア */}
              <ul className="taskmanager">
                  {/* task新規作成Popup */}
                  {isPopupVisible && (
                      <li className="task">
                          <div className="Todocell">
                              <div className="Situation-green">
                                  <h4 className="Situation-Title">新しいタスクの作成</h4>
                                  <button className="closebtn" onClick={closePopup}>✕</button>
                              </div>
                              <div className="list-1">
                                  <div className="taskname-input">
                                      <label className="my-taskcheck">
                                          <input 
                                            type="checkbox" 
                                            className="taskcheck"
                                          />
                                          <span className="checkmark"></span>
                                      </label>
                                      <input 
                                        className="taskname" 
                                        placeholder="タスク名を入力"
                                        value={newTaskName}
                                        onChange={(e) => setNewTaskName(e.target.value)}
                                      />
                                  </div>
                                  <label className="my-datechoice">
                                    <IconContext.Provider value={{ size: '25px' }}>
                                      <FaRegCalendarAlt className="day-input-icon" />
                                    </IconContext.Provider>
                                    <DatePicker
                                        className="day-input"
                                        dateFormat="yyyy/MM/dd"
                                        selected={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        locale="ja"
                                        placeholderText="日付を選択"
                                        portalId="root" // 必須: ポップアップがbody直下に配置される
                                        popperPlacement="bottom" // ポップアップの表示位置を明示的に設定
                                        popperContainer={({ children }) => <div>{children}</div>} // ポップアップを直下に表示
                                      />
                                  </label>
                                  <button onClick={handleAddTask}>登録</button>
                              </div>
                          </div>
                      </li>
                  )}
                  {/* 入力内容をループで表示 */}
                  {todoTasks.map(data => (
                  <li className="task" key={data.id}>
                      <div className="Todocell">
                          {/* 進捗バー */}
                          <div className="Situation-green">
                              <h4 className="Situation-Title">進行中</h4>
                              <button id="btn_menu" className="btn_menu">
                                  <span><span></span></span>
                              </button>
                          </div>
                          {/* 内容 */}
                          <div className="list-1">
                              <label className="my-taskcheck">
                                  <input 
                                    type="checkbox" 
                                    className="taskcheck"
                                    onChange={() => handleCompleteTask(data.id)}
                                    checked={data.completed}
                                  />
                                  <span className="checkmark"></span>
                                  <div className="taskname">{data.taskname}</div>
                              </label>
                              <label className="my-datechoice">
                                <IconContext.Provider value={{ size: '25px' }}>
                                  <FaRegCalendarAlt className="day-input-icon" />
                                </IconContext.Provider>
                                <DatePicker
                                    className="day-input"
                                    selected={data.endday ? new Date(data.endday) : null}
                                    onChange={(date) => handleDateChange(date, data.id)}
                                    dateFormat="yyyy/MM/dd"
                                    placeholderText="日付を選択"
                                    portalId="root" // 必須: ポップアップがbody直下に配置される
                                    popperPlacement="bottom" // ポップアップの表示位置を明示的に設定
                                    popperContainer={({ children }) => <div>{children}</div>} // ポップアップを直下に表示
                                  />
                              </label>
                          </div>
                      </div>
                  </li>
                ))}
              </ul>
              {/* 完了済エリア */}
              <ul className="taskmanager">
                  {completedTasks.map(data => (
                    <li className="task" key={data.id}>
                        <div className="Todocell">
                            {/* 進捗バー */}
                            <div className="Situation-blue">
                                <h4 className="Situation-Title">完了済み</h4>
                                <button id="btn_menu" className="btn_menu">
                                    <span><span></span></span>
                                </button>
                            </div>
                            {/* 内容 */}
                            <div className="list-1">
                                <label className="my-taskcheck">
                                    <input 
                                      type="checkbox" 
                                      className="taskcheck"
                                      onChange={() => handleCompleteTask(data.id)}
                                      checked={data.completed}
                                    />
                                    <span className="checkmark"></span>
                                    <div className="taskname">{data.taskname}</div>
                                </label>
                                <label className="my-datechoice">
                                  <IconContext.Provider value={{ size: '25px' }}>
                                    <FaRegCalendarAlt className="day-input-icon" />
                                  </IconContext.Provider>
                                </label>
                                {data.endday && (
                                  <div className="endday">
                                    {new Date(data.endday).toLocaleDateString("ja-JP")}
                                  </div>
                                )}
                            </div>
                        </div>
                    </li>
                  ))}
              </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
