import React from "react";
import { useState, useEffect } from "react";
import './App.css'

function List() {

    // ローカルストレージに一時保存された問い合わせ内容を配列形式で取得
    const [formDataList, setFormDataList] = useState([]);
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("formDataList")) || [];
        setFormDataList(data);
    }, []);

    // 項目を削除する処理
    const handleDelete = (index) => {

        // 指定したインデックスを除外
        const updatedList = formDataList.filter((_, i) => i !== index); 

        // 状態を更新
        setFormDataList(updatedList); 

        // ローカルストレージを更新
        localStorage.setItem("formDataList", JSON.stringify(updatedList)); 
    };



    {/* HTMLを表示 */}
    return (
        <>
        <div className="Todo-container">
            {/* 一覧エリア */}
            <div className="list-area">
                <h1>タスク一覧</h1>

                {/* 入力内容をループで表示 */}
                {formDataList.map((data, index) => (
                    <table className="Todolist">
                        <tr className="Situation">
                            <td colspan="5">進行中</td>
                        </tr>
                        <tr className="list-0">
                            <th className="no">No.</th>
                            <th className="task">タスク名</th>
                            <th className="day">開始日</th>
                            <th className="day">完了予定日</th>
                            <th colspan="3" className="Action">Action</th>
                        </tr>
                        <tr key={index} className="list-1">
                            <td rowspan="3"></td>
                            <td rowspan="3"></td>
                            <td rowspan="3"></td>
                            <td rowspan="3"></td>
                            <td>
                                <button className="btn" onClick={() => handleDelete(index)}>完了</button>
                            </td>
                        </tr>
                        <tr className="list-1">
                            <td>
                                <button className="btn" onClick={() => handleDelete(index)}>編集</button>
                            </td>
                        </tr>
                        <tr className="list-1">
                            <td>
                                <button className="btn" onClick={() => handleDelete(index)}>削除</button>
                            </td>
                        </tr>
                    </table>
                ))}
            </div>
        </div>
        </>
    );
}

export default List;