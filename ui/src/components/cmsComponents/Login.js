import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Cookies from 'cookies-js';

export default function Login(props) {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [errorUser, setErrorUser] = useState(false);
    const [errorPass, setErrorPass] = useState(false);
    const [errorLogin, setErrorLogin] = useState('');

    function login() {
        if(user === undefined || user === '') {
            setErrorUser(true);
            return;
        } else {
            setErrorUser(false);
        }
        if (pass === undefined || pass === '') {
            setErrorPass(true);
            return;
        } else {
            setErrorPass(false);
        }
        const opt = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            crossDomain: true,
            body: JSON.stringify({user: user, password: pass})
        }
        fetch('http://localhost:3001/login', opt)
            .then(res => res.json())
            .then(data => {
                if (data !== undefined && data.session !== undefined) {
                    Cookies.set('hfbSession', data.session);
                    props.setSession(data.session);
                } else {
                    setErrorLogin('Invalid user/password!');
                }
            })
    }

    return <form noValidate>
        <Grid container direction={"column"} alignContent={"center"} justify={"center"} spacing={5}>
            <Grid item style={{textAlign: "center", marginTop: 100}}>
                <h3>CMS Login</h3>
            </Grid>
            <Grid item>
                <TextField
                    autoComplete="username"
                    id="user"
                    label="Enter user"
                    value={user}
                    onChange={event => setUser(event.currentTarget.value)}
                    required
                    error={errorUser}
                />
            </Grid>
            <Grid item>
                <TextField
                    id="pass"
                    label="Password"
                    type="password"
                    value={pass}
                    onChange={event => setPass(event.currentTarget.value)}
                    autoComplete="current-password"
                    required
                    error={errorPass}
                />
            </Grid>
            <Grid item>
                <Button variant="contained" color="primary" onClick={login}>LogIn</Button>
            </Grid>
            <Grid item>
                <span style={{color: "red"}}>{errorLogin}</span>
            </Grid>
        </Grid>
    </form>
}
