import React, {useEffect, useState} from "react";
import Cookies from 'cookies-js';
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";

export default function BlogPostEditor() {
    const newPost = {
        id: 0,
        title: ""
    }

    const [article, setArticle] = useState("0");
    const [articles, setArticles] = useState([]);
    const [articleData, setArticleData] = useState(newPost);


    useEffect(() => {
        console.log("read articles");
        fetch('/articles.json')
            .then(res => res.json())
            .then(data => {
                setArticles(data.articles);
            })
    },[])

    function changeArticle(event) {
        let id = +event.currentTarget.value;
        if (id === 0) {
            setArticleData(newPost);
        } else {
            setArticleData(articles.filter(a => a.id === id)[0]);
        }
        setArticle(id + "");
    }

    function updateArticle() {
        const opt = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , session: Cookies.get('hfbSession') },
            crossDomain: true,
            body: JSON.stringify(articleData)
        }
        fetch('http://localhost:3001/article', opt)
            .then(res => res.json())
            .then(data => {
                let newArticles = articles;
                if (+article === 0) {
                    newArticles.push(data);
                } else {
                    newArticles = newArticles.map(a => a.id === +article ? data : a);
                }
                setArticles(newArticles);
                setArticle(data.id);
            });
    }

    return <Grid container direction={"column"} justify={"center"} style={{ textAlign: "center" }}>
        <Grid item style={{ marginTop: 10 }}>
            I want to edit <Select
            native
            value={article}
            onChange={changeArticle}
            style={{ marginLeft: 20 }}
        >
            <option value="0">New Post</option>
            { articles.map(a => <option key={a.id} value={a.id}>{a.title}</option>) }
        </Select>
        </Grid>
        <Grid item style={{ marginTop: 20 }}>
            <TextField
                label="Title"
                value={articleData.title}
                onChange={event => {
                    setArticleData({...articleData, title: event.currentTarget.value} );
                }}
                onBlur={updateArticle}
            />
        </Grid>

    </Grid>
}
