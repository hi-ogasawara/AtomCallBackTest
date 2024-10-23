// import React from 'react';
// import logo from './logo.svg';
import { useCallback, useState } from 'react';
import './App.css';
import { CallBackPage } from './CallBackPage';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';

function App() {
  const [open ,setOpen] = useState(false)
  const  testAPI = useTestAPI()
  const settRefresh = useSetAtom(refresh)
  useAtomValue(userConfig);

  const handleClick = useCallback(async() => {
    await testAPI();
    setOpen(true)
    return
  },[testAPI])

  const handleClose = useCallback(() => {
    setOpen(false)
  },[])

  const handleRefresh = useCallback(() => {
    settRefresh((prev) => !prev)
  },[settRefresh])

  return (
    <>
      <button onClick={handleClick}>CallBackPage:OpenAndUpdate</button>
      <button onClick={handleClose}>CallBackPage:Close</button>
      <button onClick={handleRefresh}>depend: update</button>
      {open && (<CallBackPage/>)}
    </>
  );
}

export default App;

const refresh = atom(false);

const userConfig = atom(async(get) => {
  console.log("userConfig:read")
  get(refresh);
  await sleep(1000);
  return { time:  new Date().toString()}
})

const wrapUserConfig = atom(async(get) => {
  console.log("wrapUserConfig:read")
  const config = await get(userConfig);
  return config
})

const fetchAtom = atom(async(get) => {
  console.log("fetchAtom:read");
  // const config = await get(userConfig);
  const config = await get(wrapUserConfig);
  return config.time
})

export const showDataAtom = atom<string>("")

export const useTestAPI = () => {
  return useAtomCallback(
    useCallback(async (get , set) => {
      console.log("event")
      const data = await get(fetchAtom)
      set(showDataAtom , data)
    },[])
  );
};

export function sleep(waitMillisec: number) {
  return new Promise((resolve) => setTimeout(resolve, waitMillisec));
}
