import { useCallback, useState } from 'react';
import './App.css';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { CallBackPage } from './CallBackPage';

export const showDataAtom = atom<string>('');
const refresh = atom(false);

const wrapUserConfigTime = atom((get) => {
  console.log('wrapUserConfigTime:read');
  return get(userConfigTime);
});

const userConfigTime = atom((get) => {
  console.log('userConfigTime:read');
  get(refresh);
  return new Date().toString();
});

const fetchAtom = atom((get) => {
  console.log('fetchAtom:read');
  return get(userConfigTime);
  // Uncommenting will read wrapUserConfig instead.
  // return get(wrapUserConfigTime);
});

const useTestAPI = () => {
  return useAtomCallback(
    useCallback((get, set) => {
      console.log('event');
      const data = get(fetchAtom);
      set(showDataAtom, data);
    }, [])
  );
};

// write-only pattern
// const writeTestAPI = atom(null, async (get, set) => {
//   console.log("writeTestAPI:write");
//   const data = await get(fetchAtom);
//   set(showDataAtom , data);
// })

function App() {
  const [open, setOpen] = useState(false);
  // write-only pattern
  // const setWriteTestAPI = useSetAtom(writeTestAPI);
  const testAPI = useTestAPI();
  const setRefresh = useSetAtom(refresh);
  useAtomValue(userConfigTime);

  const handleClickOpen = useCallback(async () => {
    await testAPI();
    setOpen(true);
  }, [testAPI]);

  // write-only pattern
  // const handleClickOpenWrite = useCallback(() => {
  //   setWriteTestAPI();
  //   setOpen(true);
  // },[setWriteTestAPI])

  const handleClickClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClickRefresh = useCallback(() => {
    setRefresh((prev) => !prev);
  }, [setRefresh]);

  return (
    <>
      <button onClick={handleClickOpen}>
        CallBackPage:OpenAndUpdate(useAtomCallback)
      </button>
      {/* write-only pattern */}
      {/* <button onClick={handleClickOpenWrite}>CallBackPage:OpenAndUpdate(Write)</button> */}
      <button onClick={handleClickClose}>CallBackPage:Close</button>
      <button onClick={handleClickRefresh}>Dependency: Update</button>
      {open && <CallBackPage />}
    </>
  );
}

export default App;
