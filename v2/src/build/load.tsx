import React from 'react';
import "../styles/load.css";

interface LoadProps {
    panelId: string;
}

export const Load: React.FC<LoadProps> = ({ panelId }) => {
    return (
        <div className="load">
            <div className="wrapper">
                <div className="box-wrap">
                    <div className="box one"></div>
                    <div className="box two"></div>
                    <div className="box three"></div>
                    <div className="box four"></div>
                    <div className="box five"></div>
                    <div className="box six"></div>
                </div>
            </div>
            <div className="panel-id">{ panelId }</div>
            <div className="word">[Loading]</div>
            <div className="overlay"></div>
        </div>
    );
}