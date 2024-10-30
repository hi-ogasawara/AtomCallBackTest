import { useAtomValue } from "jotai"
import { showDataAtom } from "./App"

export function CallBackPage() {
    const date = useAtomValue(showDataAtom);
    return <label>{date}</label>
}