import React, {useEffect, useState} from "react";
import Cookies from 'cookies-js';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import RatingIcons from "../blogComponents/RatingIcons";
import 'react-google-places-autocomplete/src/assets/index.css';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ImageUpload from "./ImageUpload";
import {ContentState, convertToRaw, EditorState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import GoogleMaps from "./GooglePlaceSelector";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function BlogPostEditor() {
    const newPost = {
        id: 0,
        title: "",
        date: new Date(),
        url: "",
        img: [],
        tldr: "",
        location: "Hipster Foodie Beta",
        ratings: {
            star: 0,
            price: 0,
            drinks: 0,
            food: 0
        },
        desc: "",
        published: false
    };
    const apiHost = process.env.NODE_ENV === "development" ? 'http://192.168.100.32:5000' : '';
    const [articles, setArticles] = useState([]);
    const [articleData, setArticleData] = useState(newPost);
    const [editorState, setEditorState] = useState(EditorState.createEmpty);

    useEffect(() => {
        fetch('https://hipster-foodie-beta.s3.eu-west-1.amazonaws.com/articles.json')
            .then(res => res.json())
            .then(data => {
                setArticles(data.articles);
            })
    },[])

    useEffect(() => {
        updateArticle();
    },[
        articleData.ratings.star,
        articleData.ratings.drinks,
        articleData.ratings.food,
        articleData.ratings.price,
        articleData.published,
        articleData.location,
        articleData.googlePlaceId,
        articleData.img,
        articleData.desc
    ])

    const checkUrl = url => {
        let count = 2;
        let aTemp = articles.filter(a => a.url === url);
        if (aTemp.length > 0 && aTemp[0].id !== articleData.id) {
            let tempUrl = url + "-";
            do {
                url = tempUrl + count;
                count++;
                aTemp = articles.filter(a => a.url === url);
            } while (aTemp.length > 0 && aTemp[0].id !== articleData.id)
        }
        return url;
    };

    const updateArticle = () => {
        if (articleData.title === '') {
            return;
        }
        // no change
        if (articles.filter(a => a === articleData).length > 0) {
            return;
        }
        let url = articleData.title.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-");
        let newData = articleData;
        newData.url = checkUrl(url.toLowerCase());
        setArticleData(newData);
        const opt = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' , session: Cookies.get('hfbSession') },
            crossDomain: true,
            body: JSON.stringify(articleData)
        }
        fetch(apiHost + '/article', opt)
            .then(res => res.json())
            .then(data => {
                setArticles(data.articles);
                if (articleData.id === 0) {
                    setArticleData(data.articles[data.articles.length - 1]);
                } else {
                    setArticleData(data.articles.filter(a => a.id === articleData.id)[0]);
                }
            });
    }

    const initDescEditor = text => {
        const contentBlock = htmlToDraft(text);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
        }
    }

    const changeArticle = (event, value) => {
        let article =  value;
        if (typeof value === 'string') {
            article = {...newPost, title: value, id: articles.length + 1};
            setArticles([...articles, article]);
        }
        setArticleData(article);
        initDescEditor(article.desc);
    }

    const updateRating = (icon, value) => {
        let ratings = articleData.ratings;
        ratings[icon] = value;
        setArticleData({...articleData, ratings: ratings});
    }

    const updateLocation = data => {
        setArticleData( {...articleData, location: data.description, googlePlaceId: data.place_id});
    }

    const loadMap = () => {
        if (articleData.location === '' && articleData.googlePlaceId === '') {
            return;
        }
        window.open("https://www.google.com/maps/search/?api=1&query="
            + articleData.location + "&query_place_id=" + articleData.googlePlaceId);
    }

    const updateImages = images => {
        setArticleData({...articleData, img: images});
    }

    const updateDescription = () => {
        setArticleData({...articleData, desc: draftToHtml(convertToRaw(editorState.getCurrentContent()))});
    }

    return (
        <Grid
            container
            spacing={3}
            justify={"center"}
            alignContent={"center"}
            style={{ width: '98vw', textAlign: "center" }}
        >
            <Grid item xs={11} md={9} style={{ marginTop: 20 }}>
                <h1>HFB CMS</h1>
                <Button onClick={() => window.location = '/'} variant={"outlined"}>Back to site</Button>
            </Grid>
            <Grid item xs={11} md={9} style={{ marginTop: 10 }} >
                <Autocomplete
                    freeSolo={true}
                    getOptionLabel={(option) => option.title}
                    options={articles.sort((a, b) => b.id - a.id)}
                    value={newPost}
                    onChange={changeArticle}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select existing post or create a new one"
                            margin="normal"
                            variant="outlined"
                            InputProps={{ ...params.InputProps, type: 'search' }}
                        />)}/>
            </Grid>
            <Grid item xs={11} md={9}>
                <TextField
                    label="Title"
                    fullWidth={true}
                    value={articleData.title}
                    onChange={event => {
                        setArticleData({...articleData, title: event.currentTarget.value} );
                    }}
                    onBlur={updateArticle}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={11} md={9} style={{ textAlign: "right" }}>
                <GoogleMaps
                    location={articleData.location}
                    updateLocation={updateLocation}
                />
                <LocationOnIcon
                    style={{ position: "relative", cursor: "pointer", top: '-36px', right: '-20px' }}
                    onClick={loadMap}
                />
            </Grid>
            <Grid item xs={11} md={9}>
                { articleData.id > 0
                && <ImageUpload articleId={articleData.id} img={articleData.img} updateImages={updateImages}/> }
            </Grid>
            <Grid item xs={11} md={9}>
                <TextField
                    label="TLDR"
                    fullWidth={true}
                    multiline={true}
                    rows={3}
                    rowsMax={5}
                    value={articleData.tldr}
                    onChange={event => {
                        setArticleData({...articleData, tldr: event.currentTarget.value} );
                    }}
                    onBlur={updateArticle}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={11} md={9}>
                <RatingIcons ratings={articleData.ratings} readOnly={false} updateRating={updateRating}/>
            </Grid>
            <Grid item xs={11} md={9}>
                <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName MuiOutlinedInput-notchedOutline postEditor"
                    editorClassName="editorClassName postEditorContent"
                    onEditorStateChange={setEditorState}
                    onBlur={updateDescription}
                    hashtag={{
                        separator: ' ',
                        trigger: '#',
                    }}
                    toolbar={{
                        options: ['list', 'emoji', 'inline', 'history' ],
                        inline: {
                            inDropdown: false,
                            className: undefined,
                            component: undefined,
                            dropdownClassName: undefined,
                            options: ['bold', 'italic', 'underline'],
                        },
                    }}
                />
            </Grid>
            <Grid item xs={11} md={9}>
                <Button
                    variant={"outlined"}
                    color={"secondary"}
                    onClick={() => setArticleData({...articleData, published: !articleData.published, date: new Date()})}
                    style={{ marginBottom: 30, marginTop: 20 }}
                >
                    {articleData.published ? "Unpublish" : "Publish"}
                </Button>
            </Grid>
        </Grid>
    )
}
