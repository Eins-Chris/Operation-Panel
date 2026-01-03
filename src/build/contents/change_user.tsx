export const change_user = () => {
    return (
        /* Button: Do you really want to leave this session? */
        /* Es müsste noch die session gelöscht werden, bevor das Fenster neu geladen wird */
        <>
            <p className="alert">Do you really want to leave this session?</p>
            <button onClick={() => location.reload()}></button> {/* Irgendwie in main connected auf false setzen */}
        </>
    );
}
