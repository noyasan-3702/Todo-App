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
  const [endtasks, setEndTasks] = useState([]);                 // 完了済みタスクの状況を管理
  const [newTaskName, setNewTaskName] = useState('');           // 新規作成するタスク名を管理
  const [isChecked, setIsChecked] = useState(false);            // チェックボックスの状態を管理
  const [endday, setEndday] = useState('');                     // タスクの終了日を管理
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

  const openPopup = () => { // ポップアップを開く
      setIsPopupVisible(true); 
  };
  const closePopup = () => { // ポップアップを閉じる
      setIsPopupVisible(false); 
  };

  /*================================================================================*/
  // カレンダーPopup //
  
  const handleDateChange = (date) => { // 日付選択できる処理
    setSelectedDate(date);  // 選択した日付を保存
  };
  const handleError = (error) => {
    console.error("エラーが発生しました:", error);
  };

/*================================================================================*/
  // タスク処理 //

  // 新規作成処理 //
  const handAddTask = () => { // 新しくタスクを追加する処理
    if (newTaskName.trim() === '') return; // 空の場合は追加しない
    const myId = uuidv4(); // Taskのidを作成

    // 新規作成するタスクの各項目の初期値を設定
    const newTask = {           
      id: myId,                                                 // idを設定
      taskname: newTaskName,                                    // タスク名を設定
      startday: "",                                             // 開始日を設定
      endday: selectedDate ? selectedDate.toISOString() : null, // 終了日を設定
      contents: "",                                             // タスクの内容を設定
      other: "",                                                // その他を設定
      completed: false,                                         // タスクの完了状態を設定
    }
    setTasks([...tasks, newTask]); // タスクを追加

    // 入力欄をクリア
    setNewTaskName(''); 
    setEndday(''); 
    setSelectedDate(null); 

    closePopup(); // 追加後ポップアップを閉じる
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

  const completedTasks = tasks.filter(task => task.completed);


  const todoTasks = tasks.filter(task => !task.completed);


  // Taskの進捗中・完了済みを管理
  const [todos, setTodos] = useState([]);

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
        </div>
        <div className="body-area">
          <h1>タスク一覧</h1>
          <button className="btn0" onClick={openPopup}>タスクを追加</button>
          <div className="list-area">
              {/* 進行中エリア */}
              <ul className="taskmanager">
                  <h3>To Do</h3>
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
                                        selected={selectedDate}
                                        onChange={handleDateChange}
                                        onError={handleError}
                                        dateFormat="yyyy/MM/dd"
                                        locale="ja"
                                        placeholderText="日付を選択"
                                        popperContainer={({ children }) => <div>{children}</div>} // ポップアップを直下に表示
                                      />
                                  </label>
                              </div>
                              <button onClick={handAddTask}>登録</button>
                          </div>
                      </li>
                  )}
                  {/* 入力内容をループで表示 */}
                  {tasks && tasks.map(data => (
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
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    onError={handleError}
                                    dateFormat="yyyy/MM/dd"
                                    value={data.endday}
                                    locale="ja"
                                    placeholderText="日付を選択"
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
                  <h3>Complete</h3>
                  {endtasks && endtasks.map(data => (
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
                                  <DatePicker
                                      className="day-input"
                                      selected={selectedDate}
                                      onChange={handleDateChange}
                                      onError={handleError}
                                      dateFormat="yyyy/MM/dd"
                                      value={data.endday}
                                      locale="ja"
                                      placeholderText="日付を選択"
                                      popperContainer={({ children }) => <div>{children}</div>} // ポップアップを直下に表示
                                    />
                                </label>
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
