import React, { createContext, useState } from 'react';

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [fileUri, setFileUri] = useState(null);
  const [files, setFiles] = useState([]); // Добавлено

  return (
    <FileContext.Provider value={{ fileUri, setFileUri, files, setFiles }}> 
      {children}
    </FileContext.Provider>
  );
};
