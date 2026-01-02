import "../styles/load.css";

const Load = ({ site }: {site: string}) => {
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
            <div className="site">{ site }</div>
            <div className="word">[Loading]</div>
            <div className="overlay"></div>
        </div>
    );
}

export default Load;