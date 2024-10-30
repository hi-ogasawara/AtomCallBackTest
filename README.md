# AtomCallBackTest
Checking the behavior of write-only atom and useAtomCallback

## Atoms not used in components are read
I thought it would not read for the following reasons, but it does
 - write-only atom “get” does not track dependencies
 - fetchAtom is not used in the component (“useAtomValue”　or "useAtom" is not set)

### Even though read-only atom (fetchAtom) is used only with useAtomCallBack When “userConfigTime” is used in a component, fetchAtom is read.
1. Update data with the “CallBackPage:OpenAndUpdate” button.
2. “Dependency: Update” button Update dependencies.
3. Console log shows fetchAtom:read (fetchAtom is being read).
*The same event occurs with write-only atom instead of useAtomCallBack To confirm, uncomment the write-only pattern.

### NOTE
#### If you change a dependency without ever updating it, fetchAtom is not read.
1. Reload.
2. “Dependency: Update” button Update dependencies.
3. The console log does not show fetchAtom:read (fetchAtom is not read).
*The same event occurs with write-only atom instead of useAtomCallBack To confirm, uncomment the write-only pattern.

#### Instead of userConfigTime in fetchAtom Get (uncomment) wrapUserConfigTime. If the dependency is updated after this, wrapUserConfigTime is read instead of fetchAtom.
1. Comment out return get(userConfigTime) and uncomment return get(wrapUserConfigTime) in fetchAtom.
2. Update data with the “CallBackPage:OpenAndUpdate” button.
3. “Dependency: Update” button Update dependencies.
4. wrapUserConfigTime:read appears in console log (read to wrapUserConfigTime).
*The same event occurs with write-only atom instead of useAtomCallBack To confirm, uncomment the write-only pattern.

## Inference from the above
It is likely that atom has been read in the following conditions.
 - write-only atom is used at least once.
 - The atom that is a dependency within the atom that the write-only atom is getting is used in the component.  
   (userConfigTime in fetchAtom in useTestAPI is used by the component.)  
   (In this case, dependencies are only tracked up to the first level.)  
