import React, { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IconContext } from 'react-icons'; //IconContextをインポート
import { FaRegCalendarAlt } from "react-icons/fa"; // カレンダーアイコンの呼び出し
import DatePicker, { registerLocale }  from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ja from 'date-fns/locale/ja';
import './App.css';


function App() {
  const [tasks, setTasks] = useState([]);                             // 進行中タスクの状況を管理
  const [newTaskName, setNewTaskName] = useState('');                 // 新規作成するタスク名を管理
  const [nameError, setNameError] = useState(false);                  // エラー状態を管理するstate
  const [time, setTime] = useState(new Date());                       // 現在時刻を管理
  const [selectedDate, setSelectedDate] = useState();                 // DatePickerを管理
  const [formDate, setFormDate] = useState(new Date());               // 日付の初期値を設定
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);  // メニューpopupの表示・非表示を管理
  const popupRefs = useRef({});                                       // ポップアップの参照を保持
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);// 編集popupの表示・非表示を管理
  const [editedTask, setEditedTask] = useState(null);                 // 初期値をnullに変更


 /**
 * 現在時刻表示
 * 現在時刻表示の内部処理
 */
  // 現在時刻表示 //

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


 /**
 * メニューPopup
 * メニューPopupの内部処理
 */

  // ボタンがクリックされたらメニューPopupを表示
  const handleMenuButtonClick = (id) => {
    const button = document.getElementById('btn_menu');
    button.classList.toggle('active');
  
    setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            isMenuOpen: button.classList.contains('active')
          };
        }
        return task;
      })
    );
  };


 /**
 * カレンダーPopup
 * カレンダーPopupの内部処理
 */
  
  // タスク進行中のDatePicker変更ハンドラ
  const handleDateChange = (date, id) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === id) {
        return { ...task, endday: date ? date.toISOString() : null };
      }
      return task;
    }));
  }

  // 日付の形式を変更する(yyyy-mm-dd形式)
  const formatEditDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString); // ISO文字列またはタイムスタンプからDateオブジェクトを生成
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Invalid date string:", error);
      return "";
    }
  }


/**
 * 新規作成Popup
 * 新規作成Popupの内部処理
 */

  // ポップアップを開く
  const openAddPopup = () => {setIsAddPopupVisible(true)};    

  // ポップアップを閉じる
  const closeAddPopup = () => {
    setNewTaskName('');             // タスク名入力欄をクリア
    setSelectedDate(null);          // 終了日入力欄をクリア
    setIsAddPopupVisible(false)     
  };  


/**
 * タスク新規作成
 * タスク新規作成処理
 */

  // タスク新規作成時の制御処理 //
  const handleTaskNameChange = (e) => {
    const inputValue = e.target.value;
    setNewTaskName(inputValue); // 入力値をstateにセット
    if (inputValue.length > 20) {
      setNameError(true); // エラー状態をtrueに
      alert("タスク名は20文字以内で入力してください。");
      setNewTaskName(inputValue.slice(0, 20));//20文字で入力を制限
      setNewTaskName('')
      setIsAddPopupVisible(false) // ポップアップを閉じる
    } else {
      setNameError(false); // エラー状態をfalseに
    }
  };

  // 新規作成処理 //
  const handleAddTask = () => { 
    if (newTaskName.trim() === '') return; // 空の場合は追加しない

    // 新規作成するタスクの各項目の初期値を設定
    const newTask = {           
      id: uuidv4(),                                             // idを設定
      taskname: newTaskName,                                    // タスク名を設定
      startday: new Date().toLocaleDateString(),                // 開始日を設定(今日の日付)
      endday: formDate ? formDate.toLocaleDateString() : null,  // 終了日を設定(カレンダーPopupで選択された日付)
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
  };


/**
 * タスク編集
 * タスク編集時の制御処理
 */

  const handleEditTaskNameChange = (e) => {
    const inputValue = e.target.value;
    handleChange(e); // handleChangeを呼び出す
    if (inputValue.length > 20) {
      setNameError(true);
      alert("タスク名は20文字以内で入力してください。");
      e.target.value = inputValue.slice(0, 20); // 入力文字数を制限
      handleChange({target: {name: 'taskname', value: inputValue.slice(0, 20)}}); // 親コンポーネントのstateも更新
    } else {
      setNameError(false);
    }
  };

  // 編集ポップアップを閉じる
  const closeEditPopup = () => {setIsEditPopupVisible(false)};

  // 入力された内容をリアルタイムで更新
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({...editedTask, [name]: value}); 
  };

  // 編集した内容を保存する処理
  const handleSaveEdit = () => {
    setTasks(tasks.map(task =>
      task.id === editedTask.id ? editedTask : task
    ));
    setIsEditPopupVisible(false); // ポップアップを閉じる
    setEditingTaskId(null); // 編集中のタスクIDをリセット
  };


/**
 * タスク完了
 * タスク完了時の処理
 */

  const handleCompleteTask = (id) => {
    setTasks(
      tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task // 値を反転
          // true→false、false→trueに変更される(データ型のみ？)
      )
    );
  };


/**
 * タスク削除
 * タスク削除時の処理
 */

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // タスクの内容を編集する処理
  const handleEditTask = (id) => {
    const taskToEdit = (tasks.find(task => task.id === id)); // 編集対象のタスクの内容を初期値に設定
    if (taskToEdit) { // taskToEditが存在するか確認
      setEditedTask(taskToEdit); // 編集対象のタスクをセット
      setIsEditPopupVisible(true); // 編集ポップアップを開く
    }
  };


/**
 * タスク表示
 * タスク表示の処理
 */

  // 進行中のタスクを取得する
  const todoTasks = tasks.filter(task => !task.completed);

  // 完了済のタスクを取得する
  const completedTasks = tasks.filter(task => task.completed);


  {/* HTMLを表示する */}
  return (
    <>
      <div className="Todo-container">
        {/* task編集Popup */}
        {isEditPopupVisible && (
          <div className="popup-area">
            <div className="popup-body">
              {/* 編集フォーム */}
              <div className="popup">
                <div className="Situation-green">
                  <h4 className="Situation-Title">タスクの編集</h4>
                  <button className="closebtn" onClick={closeEditPopup}>✕</button>
                </div>
                <form>
                  <div className="popup-input-area">
                    <h4>タスク名</h4>
                    <label>
                      <textarea 
                        name='taskname'
                        className="popup-textarea"
                        value={editedTask.taskname || ""} // 空の場合のエラー回避
                        onChange={handleEditTaskNameChange}/>
                    </label>
                  </div>
                  <div className="popup-input-area">
                    <h4>開始日</h4>
                    <label>
                      <input
                        type="date"
                        name='startday'
                        className="popup-textarea"
                        value={formatEditDate(editedTask.startday) || ""} // 空の場合のエラー回避 
                        onChange={handleChange}/> 
                    </label>
                  </div>
                  <div className="popup-input-area">
                    <h4>終了日</h4>
                    <label>
                      <input
                        type="date"
                        name='endday'
                        className="popup-textarea"
                        value={formatEditDate(editedTask.endday) || ""} // 空の場合のエラー回避
                        onChange={handleChange}/>
                    </label>
                  </div>
                  <div className="popup-input-area">
                    <h4>メモ内容</h4>
                    <label>
                      <textarea 
                        name='contents'
                        className="popup-textarea"
                        value={editedTask.contents || ""} // 空の場合のエラー回避
                        onChange={handleChange}/>
                    </label>
                  </div>
                  <div className="popup-input-area">
                    <h4>その他</h4>
                    <label>
                      <textarea 
                        name='other'
                        className="popup-textarea"
                        value={editedTask.other || ""} // 空の場合のエラー回避 
                        onChange={handleChange}/>
                    </label>
                  </div>
                </form>
                <button className="btn0" onClick={handleSaveEdit}>保存</button>
              </div>
            </div>
          </div>
        )}
        {/* ヘッター部分 */}
        <div className="header-area">
          <h1 className="Title">ToDo App</h1>
          {/* 時間と日付 */}
          <div className="clock-area">
            <div className="time-display">{formatTime(time)}</div>
            <div className="date-display">{formatDate(time)}</div>
          </div>
          <button className="btn0" onClick={openAddPopup}>タスクを追加</button>
          <div className="Title-area" >
            <h3 className="ToDo">To Do</h3>
            <h3 className="Complete">Complete</h3>
          </div>
        </div>
        {/* ボディ部分 */}
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
                          maxlength="20"
                          onChange={handleTaskNameChange}
                        />
                      </div>
                      <label className="my-datechoice">
                        <IconContext.Provider value={{ size: '25px' }}>
                          <FaRegCalendarAlt className="day-input-icon" />
                        </IconContext.Provider>
                        <DatePicker 
                          className="day-input"
                          selected={formDate} // 初期値を設定(今日の日付)
                          onChange={(selectedDate) => {setFormDate(selectedDate || formDate)}} // 日付変更時の処理
                          minDate={new Date()} // 過去日を設定できないようにする
                          dateFormat="yyyy/MM/dd"
                          placeholderText="完了予定日を選択"
                          portalId="root" // ポップアップがbody直下に配置される
                          popperPlacement="bottom" // ポップアップの表示位置を明示的に設定
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
                    <div className={data.taskname === "誕生日" ? "Situation-orange" : "Situation-green"}> {/* クラス名を条件分岐 */}
                      <h4 className="Situation-Title">
                        {data.taskname === "誕生日" ? "★進行中★" : "進行中"} {/* タイトル条件分岐 */}
                      </h4>
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
                      <div 
                        className="menuPopup" 
                        ref={el => popupRefs.current[data.id] = el}>
                        <label onClick={() => handleEditTask(data.id)}>●編集</label>
                        <label onClick={() => handleDeleteTask(data.id)}>●削除</label>
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
                        <label onClick={() => handleDeleteTask(data.id)}>●削除</label>
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