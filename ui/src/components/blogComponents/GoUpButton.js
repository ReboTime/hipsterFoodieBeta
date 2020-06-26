import React, {useState, useEffect, useRef} from 'react';
import {IconButton} from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";

export default function GoUpButton() {
    const [goUp, _setGoUp] = useState(false);
    const goUpRef = useRef(goUp);
    const setGoUp = data => {
        goUpRef.current = data;
        _setGoUp(data);
    };

    const scrollListenerGoUp = () => {
        if (window.pageYOffset > 160 && !goUpRef.current) {
            setGoUp(true);
        }
        if (window.pageYOffset <= 160 && goUpRef.current) {
            setGoUp(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', scrollListenerGoUp);
        return () => {
            window.removeEventListener('scroll', scrollListenerGoUp);
        }
    });

    return (
        <>
        {goUp && <IconButton
            onClick={() => window.scrollTo(0, 0)}
            style={{zIndex: 5, float: 'right', bottom: 20, position: 'sticky' }}>
            <NavigationIcon />
        </IconButton>}
        </>
    );
}
