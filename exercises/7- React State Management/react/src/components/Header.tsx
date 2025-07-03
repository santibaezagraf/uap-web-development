import { BoardsList } from "./BoardList"

export function Header() {
    return (
        <header>
            <h1 className="font-montserrat font-normal text-5xl bg-[rgba(241,236,230,255)] m-0 text-center py-3">
            <span className="text-gray-500">TO</span>   <span className="text-orange-500">DO</span>
            </h1>
            <BoardsList/>
        </header>
    )
};