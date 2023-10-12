"use client";
import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Store, AddReminder, RemoveReminder, ClearReminder, useReminder } from "../context/store";

export default function FirstPage() {
  const { state, dispatch } = useReminder()
  const [text, setText] = useState("");
  const [date, setDate] = useState("");

  const clearAll = () => {
    dispatch({ type: ClearReminder });
    setText("");
    setDate("");
  };

  const makeSend = (text, dateInMilliseconds) =>{
    console.log(dateInMilliseconds, "Date time in miliseconds")
    fetch(`/api/twilio?message=${text}&time=${dateInMilliseconds}`)
  }

  return (
    <div className="container p-10">
      <h1 className="text-xl font-bold text-center mb-3">Reminder App</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim() === "" || date.trim() === "") {
            return;
          }
          dispatch({
            type: AddReminder,
            text,
            date,
          });
          // Convert the date to milliseconds
          const dateWhenAdded = new Date().getTime() - 1000;
          const dateSecheduledInMiliseconds = new Date(date).getTime();
          const dateInMilliseconds = dateSecheduledInMiliseconds - dateWhenAdded;
          makeSend(text, dateInMilliseconds)
          setText("");
          setDate("");
        }}
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-2">
            <label htmlFor="text" className="block">Reminder:</label>
          </div>
          <div className="col-span-10">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              id="text"
              className="block w-full rounded border border-gray-300 p-2 text-black"
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-2">
            <label htmlFor="date" className="block">Date:</label>
          </div>
          <div className="col-span-10">
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              id="date"
              className="block w-full rounded border border-gray-300 p-2 text-black"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-info mt-4 bg-blue-700 rounded-xl p-2">Add</button>
      </form>
      <ul className="list-group mt-4">
        <TransitionGroup>
          {state.length > 0 ? (
            state.map(({ id, text, date }, idx) => {
              return (
                <CSSTransition
                  key={id}
                  timeout={500}
                  className="item list-group-item d-flex justify-between items-center"
                >
                  <li className="flex items-center">
                    <span className="mr-4">{text}</span>
                    <span>{date}</span>
                    <span
                      onClick={() => dispatch({ type: RemoveReminder, id })}
                      style={{ cursor: "pointer" }}
                      className="ml-2 text-red-500 cursor-pointer"
                    >
                      &#10006;
                    </span>
                    <span
                      onClick={() => makeSend(text)}
                      style={{ cursor: "pointer" }}
                      className="ml-2 text-red-500 cursor-pointer"
                    >
                      &#x260F;
                    </span>
                  </li>
                </CSSTransition>
              );
            })
          ) : (
            <CSSTransition timeout={500} className="item">
              <h2 className="text-danger text-capitalize">
                there is no reminder yet!
              </h2>
            </CSSTransition>
          )}
        </TransitionGroup>
      </ul>
      {state.length > 0 && (
        <button
          type="button"
          
          className="text-white cursor-pointer mt-4 bg-red-500 rounded-xl p-2"
          onClick={clearAll}
        >
          Clear
        </button>
      )}
    </div>

  );
}
