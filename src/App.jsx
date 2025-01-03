import React, { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IconContext } from 'react-icons'; //IconContextをインポート
import { FaRegCalendarAlt } from "react-icons/fa"; // カレンダーアイコンの呼び出し
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ja from 'date-fns/locale/ja';
import './App.css';

/*================================================================================*/
function App() {
  const [tasks, setTasks] = useState([]);                             // 進行中タスクの状況を管理
  const [newTaskName, setNewTaskName] = useState('');                 // 新規作成するタスク名を管理
  const [time, setTime] = useState(new Date());                       // 現在時刻を管理
  const [selectedDate, setSelectedDate] = useState(new Date());       // DatePickerを管理
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);  // メニューpopupの表示・非表示を管理
  const popupRefs = useRef({});                                       // ポップアップの参照を保持

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

/*================================================================================*/
  // ローカルストレージに一時保存された問い合わせ内容を配列形式で取得
  const [formDataList, setFormDataList] = useState([]);
  useEffect(() => {
      const data = JSON.parse(localStorage.getItem("formDataList")) || [];
      setFormDataList(data);
  }, []);

  /*================================================================================*/
  // メニューPopup //

  // ボタンがクリックされたらメニューPopupを表示
  const handleMenuButtonClick = (id) => {
    console.log('ボタンがクリックされました！');
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isMenuOpen: !task.isMenuOpen } : task 
      // キー(id)が見つかったら、Popupの表示・非表示の値（true/false）を反転して更新
    ));
  };

  // メニューPopupの外側がクリックされたかどうかを判定
  const handleGlobalClick = useCallback((event, id) => {
    console.log('Popupを閉じました');
    // キー(id)に対応したPopupが表示されていて、そのPopupの要素以外がクリックされたら？に対応したPopupが表示されていて、そのPopupの要素以外がクリックされたら？
    if (popupRefs.current[id] && !popupRefs.current[id].contains(event.target)) {
      setTasks(prevTasks => prevTasks.map(task =>
        task.id === id ? { ...task, isMenuOpen: false } : task
      ));
    }
  }, []);
  // contains()メソッドはあるDOM要素が別のDOM要素を含んでいるかどうかをチェックする

  useEffect(() => {
    const handleGlobalClick = (event) => {
        setTasks(prevTasks => prevTasks.map(task => { // ★重要な修正
            if (task.isMenuOpen && popupRefs.current[task.id] && !popupRefs.current[task.id].contains(event.target)) {
              return { ...task, isMenuOpen: false };
            }
            return task;
        }));
    };

    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
}, [popupRefs]);

  /*================================================================================*/
  // カレンダーPopup //
  
  const handleDateChange = (date, id) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === id) {
        return { ...task, endday: date ? date.toISOString() : null };
      }
      return task;
    }));
  }
/*================================================================================*/
  // 新規作成Popup //

  const openAddPopup = () => {setIsAddPopupVisible(true)};    // ポップアップを開く
  const closeAddPopup = () => {setIsAddPopupVisible(false)};  // ポップアップを閉じる

/*================================================================================*/
  // タスク処理 //

  // 新規作成処理 //
  const handleAddTask = () => { 
    if (newTaskName.trim() === '') return; // 空の場合は追加しない

    // 新規作成するタスクの各項目の初期値を設定
    const newTask = {           
      id: uuidv4(),                                             // idを設定
      taskname: newTaskName,                                    // タスク名を設定
      startday: new Date().toISOString(),                       // 開始日を設定(今日の日付)
      endday: selectedDate ? selectedDate.toISOString() : "",   // 終了日を設定(カレンダーPopupで選択された日付)
      contents: "",                                             // タスクの内容を設定
      other: "",                                                // その他を設定
      completed: false,                                         // タスクの完了状態を設定
      isMenuOpen: false,                                        // メニューPopupを非表示に設定
      // ISO形式 - 例 2024-03-15T10:30:45.500Z(YYYY-MM-DDTHH:mm:ss.sssZ)
    }
    setTasks([...tasks, newTask]);  // タスクを追加
    setNewTaskName('');             // タスク名入力欄をクリア
    setSelectedDate(null);          // 終了日入力欄をクリア
    closeAddPopup();                // 追加後ポップアップを閉じる

    // ログを表示
    console.log(newTask.id)
    console.log(newTask.taskname)
    console.log(newTask.startday)
    console.log(newTask.endday)
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

  // 進行中のタスクを取得する
  const todoTasks = tasks.filter(task => !task.completed);

  // 完了済のタスクを取得する
  const completedTasks = tasks.filter(task => task.completed);

/*================================================================================*/
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
          <button className="btn0" onClick={openAddPopup}>タスクを追加</button>
          <div className="Title-area" >
            <h3>To Do</h3>
            <h3>Complete</h3>
          </div>
        </div>
        <div className="body-area">
          <div className="list-area">
            {/* 進行中エリア */}
            <ul className="taskmanager1">
              {/* task新規作成Popup */}
              {isAddPopupVisible && (
                <li className="task">
                  <div className="Todocell">
                    <div className="Situation-green">
                      <h4 className="Situation-Title">新しいタスクの作成</h4>
                      <button className="closebtn" onClick={closeAddPopup}>✕</button>
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
                          value={selectedDate} // 初期値を設定
                          onChange={(date) => setSelectedDate(date)} // 日付変更時の処理
                          dateFormat="yyyy/MM/dd"
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
                      <button 
                        id="btn_menu" 
                        className="btn_menu"
                        onClick={() => handleMenuButtonClick(data.id)}
                      >
                        <span><span></span></span>
                      </button>
                    </div>
                    {/* メニューPopup */}
                    {data.isMenuOpen && (
                      <div className="menuPopup" ref={el => popupRefs.current[data.id] = el}>
                        <p>これは『{data.taskname}』のポップアップです。</p>
                        <p>共通のコンテンツを表示します。</p>
                        <p>●編集</p>
                        <p>●削除</p>
                      </div>
                    )}
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
            <ul className="taskmanager2">
              {completedTasks.map(data => (
                <li className="task" key={data.id}>
                  <div className="Todocell">
                      {/* 進捗バー */}
                      <div className="Situation-blue">
                        <h4 className="Situation-Title">完了済み</h4>
                        <button 
                          id="btn_menu" 
                          className="btn_menu"
                          onClick={() => handleMenuButtonClick(data.id)}
                        >
                            <span><span></span></span>
                        </button>
                      </div>
                    {/* メニューPopup */}
                    {data.isMenuOpen && (
                      <div className="menuPopup" ref={el => popupRefs.current[data.id] = el}>
                        <p>これは『{data.taskname}』のポップアップです。</p>
                        <p>共通のコンテンツを表示します。</p>
                        <p>●削除</p>
                      </div>
                    )}
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