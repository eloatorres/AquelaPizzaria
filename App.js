import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { AppProvider } from './context/AppContext';
import { useEffect } from 'react';
import { createTables } from './database/DbService';


export default function App() {
  useEffect(() => {
    createTables();
  }, []);

  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}