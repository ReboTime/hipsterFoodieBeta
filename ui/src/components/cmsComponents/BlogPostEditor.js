import React, {useEffect, useState} from "react";
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
        console.log(id);
        if (id === 0) {
            setArticleData(newPost);
        } else {
            setArticleData(articles.filter(a => a.id === id)[0]);
        }
        setArticle(id + "");
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
                    let data = articleData;
                    data.title = event.currentTarget.value;
                    console.log(data);
                    setArticleData(data);
                }}
            />
        </Grid>

    </Grid>
}
