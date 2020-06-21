import React, {useEffect, useState} from "react";
import Cookies from 'cookies-js';
import Login from "./cmsComponents/Login";
import BlogPostEditor from "./cmsComponents/BlogPostEditor";
import CircularProgress from "@material-ui/core/CircularProgress";
export default function CMS() {
    const [session, setSession] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const apiHost = process.env.NODE_ENV === "dev" ? 'http://localhost:5000' : '';

    useEffect(() => {
        let cookie = Cookies.get('hfbSession');
        if (cookie !== undefined) {
            checkSession(cookie);
        } else {
            setLoading(false);
        }
    },[]);

    function checkSession(cookie) {
        const opt = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            crossDomain: true,
            body: JSON.stringify({cookie: cookie})
        }
        fetch(apiHost + '/login/cookie', opt)
            .then(res => res.json())
            .then(data => {
                if (data.valid) {
                    setSession(cookie);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));

    }

    return loading ? <CircularProgress size="50px" thickness={1} style={{ position: "absolute", top: '30%', left: '48%'}} /> : session !== undefined ? <BlogPostEditor /> : <Login setSession={setSession}/>;
}
