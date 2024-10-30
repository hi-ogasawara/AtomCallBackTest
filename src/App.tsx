// import React from 'react';
// import logo from './logo.svg';
import { useCallback, useState } from 'react';
import './App.css';
import { CallBackPage } from './CallBackPage';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';

export const showDataAtom = atom<string>("")
const refresh = atom(false);

const wrapUserConfigTime = atom((get) => {
  console.log("wrapUserConfigTime:read");
  return get(userConfigTime);
})

const userConfigTime = atom((get) => {
  console.log("userConfigTime:read");
  get(refresh);
  return new Date().toString();
})

const fetchAtom = atom((get) => {
  console.log("fetchAtom:read");
  return get(userConfigTime);
  // return get(wrapUserConfigTime);
})

const useTestAPI = () => {
  return useAtomCallback(
    useCallback((get , set) => {
      console.log("event");
      const data = get(fetchAtom);
      set(showDataAtom , data);
    },[])
  );
};

// write-only pattern
// const writeTestAPI = atom(null, async (get, set) => {
//   console.log("writeTestAPI:write");
//   const data = await get(fetchAtom);
//   set(showDataAtom , data);
// })

function App() {
  const [open ,setOpen] = useState(false);
  // write-only pattern
  // const setWriteTestAPI = useSetAtom(writeTestAPI);
  const testAPI = useTestAPI();
  const settRefresh = useSetAtom(refresh);
  useAtomValue(userConfigTime);

  const handleClickOpen = useCallback(async() => {
    await testAPI();
    setOpen(true);
    return;
  },[testAPI])

  // write-only pattern
  // const handleClickOpenWrite = useCallback(() => {
  //   setWriteTestAPI();
  //   setOpen(true);
  // },[setWriteTestAPI])

  const handleClickClose = useCallback(() => {
    setOpen(false);
  },[])

  const handleClickRefresh = useCallback(() => {
    settRefresh((prev) => !prev);
  },[settRefresh]);

  return (
    <>
      <button onClick={handleClickOpen}>CallBackPage:OpenAndUpdate(useAtomCallback)</button>
      {/* write-only pattern */}
      {/* <button onClick={handleClickOpenWrite}>CallBackPage:OpenAndUpdate(Write)</button> */}
      <button onClick={handleClickClose}>CallBackPage:Close</button>
      <button onClick={handleClickRefresh}>depend: update</button>
      {open && (<CallBackPage/>)}
    </>
  );
}

export default App;
