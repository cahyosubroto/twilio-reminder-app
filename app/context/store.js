"use client"
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { produce } from 'immer';
import {v4 as uuidv4} from 'uuid';

export const AddReminder = 'ADD_REMINDER';
export const RemoveReminder = 'REMOVE_REMINDER';
export const ClearReminder = 'CLEAR_REMINDER';

const ReminderContext = createContext();

function reminderReducer(reminders = [], action) {
  switch (action.type) {
    case AddReminder:
      const reminderObj = {
        text: action.text,
        date: action.date,
        id: uuidv4(),
      };
      if (
        reminders.findIndex(
          (reminder) =>
            reminder.text.toLowerCase().trim() ===
            action.text.toLowerCase().trim()
        ) > -1
      ) {
        return reminders;
      }
      reminders.push(reminderObj);
      break;
    case RemoveReminder:
      return [...reminders.filter((reminder) => reminder.id !== action.id)];
    case ClearReminder:
      return [];

    default:
      return reminders;
  }
}

function useImmerReducer(reducer, initialState) {
  return useReducer(produce(reducer), initialState);
}

export function ReminderProvider({ children }) {
  const [state, dispatch] = useImmerReducer(reminderReducer, [], () => {
    const data = localStorage.getItem('reminders');
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(state));
  }, [state]);

  return (
    <ReminderContext.Provider value={{ state, dispatch }}>
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminder() {
  return useContext(ReminderContext);
}
