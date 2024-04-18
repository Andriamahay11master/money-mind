import './alert.scss';

interface AlertProps {
    icon : string
    type: string
    message : string
    state : boolean
}

export default function Alert({icon, type, message, state} : AlertProps) {

    return (    
        <div className={(type && state) ? 'alert show alert-' + type : 'alert'}> 
            <div className="alert-col"><i className={icon}></i></div>
            <div className="alert-col"><p>{message}</p></div>
        </div>
    )
}