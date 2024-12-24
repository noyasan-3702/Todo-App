import React from "react";
import DatePicker from 'react-datepicker';
import { useState, useEffect, useId } from "react";
import 'react-datepicker/dist/react-datepicker.css';
import './App.css'

function List() {

    // ローカルストレージに一時保存された問い合わせ内容を配列形式で取得
    const [formDataList, setFormDataList] = useState([]);
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("formDataList")) || [];
        setFormDataList(data);
    }, []);

    // 日付選択できる処理
    const [selectedDate, setSelectedDate] = useState(null);
    const handleChange = (date) => {
      setSelectedDate(date);
    };
    const handleError = (error) => {
      console.error("エラーが発生しました:", error);
    };

    // ポップアップの表示・非表示を管理
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // ポップアップを開く
    const openPopup = () => {
        setIsPopupVisible(true);
    };

    // ポップアップを閉じる
    const closePopup = () => {
        setIsPopupVisible(false);
    };

    // Taskのidを作成
    const myId = useId();

    // Taskの進捗中・完了済みを管理
    const [todos, setTodos] = useState([]);

    // Taskを進捗中・完了済みにする処理
    const handleCheckboxChange = (id) => {
        setTodos(
            todos.map((todo) => {
                if (todo.id === id) {
                    return { ...todo, completed: !todo.completed };
                }
                return todo;
            })
        );
    };
        
    const todoItems = todos.filter((todo) => !todo.completed);
    const completedItems = todos.filter((todo) => todo.completed);

    {/* HTMLを表示 */}
    return (
        <>
        <div className="Todo-container">
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
                                    <button class="closebtn" onClick={closePopup}>✕</button>
                                </div>
                                <div className="list-1">
                                    <div className="taskname-input">
                                        <label className="my-taskcheck">
                                            <input type="checkbox" className="taskcheck" disabled/>
                                            <span className="checkmark"></span>
                                        </label>
                                        <input className="taskname" placeholder="タスク名を入力"/>
                                    </div>
                                    <DatePicker
                                        className="day-input"
                                        selected={selectedDate}
                                        onChange={handleChange}
                                        onError={handleError}
                                        dateFormat="yyyy/MM/dd"
                                        placeholderText="日付を選択"
                                    />
                                    {selectedDate && <p>選択された日付: {selectedDate.toLocaleDateString()}</p>}
                                </div>
                            </div>
                        </li>
                    )}
                    <li className="task">
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
                                    <input type="checkbox" className="taskcheck"></input>
                                    <span className="checkmark"></span>
                                    <div className="taskname">お買い物してくる</div>
                                </label>
                                <div className="day">期限：12/25</div>
                            </div>
                        </div>
                    </li>
                </ul>
                {/* 完了済エリア */}
                <ul className="taskmanager">
                    <h3>Complete</h3>
                    <li className="task">
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
                                    <input type="checkbox" className="taskcheck"></input>
                                    <span className="checkmark"></span>
                                    <div className="taskname">お買い物してくる</div>
                                </label>
                                <div className="day">期限：12/25</div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        </>
    );
}

export default List;