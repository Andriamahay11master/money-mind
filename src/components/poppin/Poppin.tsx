import Link from "next/link";
import './poppin.scss'
interface PoppinProps {
    title: string
    message: string
    linkBtn: string
    valBtn: string
}

export function Poppin({ title, message, linkBtn, valBtn} : PoppinProps) {
    return (
        <div className="poppin">
            <div className="poppin-content">
                <h1 className="poppin-title">{title}</h1>
                <p className="poppin-message">{message}</p>
                <Link className="btn btn-primary poppin-btn" href={linkBtn}>{valBtn}</Link>
            </div>
        </div>
    );
}