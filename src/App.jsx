import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Do from "./Do";
import List from "./List";
import Fin from "./Fin";
import './App.css'

function App() {

  // 毎秒現在時刻を更新する
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // クリーンアップ
  }, []);

  // 時刻のフォーマット
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false, // 24時間表示
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // 日付のフォーマット
  const formatDate = (date) => {
    return date.toLocaleDateString("ja-JP", {
      weekday: "short",  // 曜日 (例: 金)
      year: "numeric",   // 年 (例: 2024年)
      month: "long",     // 月 (例: 1月)
      day: "numeric",    // 日 (例: 1日)
    });
  };

  {/* HTMLを表示する */}
  return (
    <>
    <Router>
      <div className="Todo-container">
        <div className="header-area">
          <h1 className="Title">ToDo App</h1>
          <div className="clock-area">
            <div className="time-display">{formatTime(time)}</div>
            <div className="date-display">{formatDate(time)}</div>
          </div>
        </div>
        <nav className="body-area">
          <Link to="/Do">
            <button className="btn0">今日やることぉ</button>
          </Link>
          <Link to="/List">
            <button className="btn0">いちらぁん</button>
          </Link>
          <Link to="/Fin">
            <button className="btn0">おわったやつら</button>
          </Link>
        </nav>
        <Routes>
          <Route path="/Do" element={<Do />} />
          <Route path="/List" element={<List />} />
          <Route path="/Fin" element={<Fin />} />
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App;
