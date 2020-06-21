import React, {useEffect, useRef, useState} from "react";
import Cookies from 'cookies-js';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import RatingIcons from "../blogComponents/RatingIcons";
import 'react-google-places-autocomplete/src/assets/index.css';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ImageUpload from "./ImageUpload";

export default function BlogPostEditor() {
    const newPost = {
        id: 0,
        title: "",
        date: new Date(),
        url: "",
        img: [],
        tldr: "",
        location: "",
        ratings: {
            star: 0,
            price: 0,
            drinks: 0,
            food: 0
        },
        desc: "",
        published: false
    };
    const apiHost = process.env.NODE_ENV === "development" ? 'http://localhost:5000' : '';
    const [article, setArticle] = useState("0");
    const [articles, setArticles] = useState([]);
    const [articleData, setArticleData] = useState(newPost);
    const places = useRef(null);

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
        articleData.img
    ])

    useEffect(() => {
        let label = places.current.children[0];
        let div  = places.current.children[1];
        let legend = div.children[1].children[0];
        if (articleData.location !== '' && articleData.location !== undefined) {
            label.classList.add("MuiInputLabel-shrink");
            legend.classList.add("PrivateNotchedOutline-legendNotched-4");
        }
        removePlaceFocus(undefined);
    }, [articleData.location])

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
        if (articleData.title === '') {
            return;
        }
        if (articles.filter(a => a === articleData).length > 0) {
            return;
        }
        let url = articleData.title.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-");
        let newData = articleData;
        newData.url = url;
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
                    setArticle(data.articles[data.articles.length - 1].id);
                    setArticleData(data.articles[data.articles.length - 1]);
                } else {
                    setArticleData(data.articles.filter(a => a.id === +article)[0]);
                }
            });
    }

    function updateRating(icon, value) {
        let ratings = articleData.ratings;
        ratings[icon] = value;
        setArticleData({...articleData, ratings: ratings});
    }

    function updateLocation(data) {
        setArticleData( {...articleData, location: data.description, googlePlaceId: data.place_id});
    }

    function loadMap() {
        if (articleData.location === '' && articleData.googlePlaceId === '') {
            return;
        }
        //window.open("https://www.google.com/maps/place/?q=place_id:" + articleData.googlePlaceId);
        window.open("https://www.google.com/maps/search/?api=1&query="
            + articleData.location + "&query_place_id=" + articleData.googlePlaceId);
    }

    function saveCustomLocation() {
        let place = places.current.children[1].children[0].children[0].value;
        if (articleData.location !== place) {
            setArticleData({...articleData, location: place, googlePlaceId: ''});
        }
    }

    function addPlaceFocus(event) {
        let label = event.currentTarget.children[0];
        let div  = event.currentTarget.children[1];
        let legend = div.children[1].children[0];
        label.classList.add("MuiInputLabel-shrink");
        label.classList.add("Mui-focused");
        div.classList.add("Mui-focused");
        legend.classList.add("PrivateNotchedOutline-legendNotched-4");
    }

    function removePlaceFocus(event) {
        if (event === undefined || !places.current.contains(event.target)) {
            let label = places.current.children[0];
            let div  = places.current.children[1];
            let input = div.children[0].children[0];
            if (input === document.activeElement) {
                return;
            }
            let legend = div.children[1].children[0];
            if (articleData.location === '' || articleData.location === undefined) {
                label.classList.remove("MuiInputLabel-shrink");
                legend.classList.remove("PrivateNotchedOutline-legendNotched-4");
            }
            label.classList.remove("Mui-focused");
            div.classList.remove("Mui-focused");
        }
    }

    const updateImages = (images) => {
        setArticleData({...articleData, img: images});
    }

    return (
        <Grid
            container
            spacing={3}
            justify={"center"}
            alignContent={"center"}
            style={{ width: '98vw', height: '100vh', textAlign: "center" }}
            onClick={removePlaceFocus}
        >
            <Grid item xs={9} style={{ marginTop: 20 }}>
                <h1>HFB CMS</h1>
                <Button onClick={() => window.location = '/'} variant={"outlined"}>Back to site</Button>
            </Grid>
            <Grid item xs={9} style={{ marginTop: 10 }} >
                I want to edit <Select
                native
                value={article}
                onChange={changeArticle}
                style={{ marginLeft: 20, minWidth: '200px' }}
            >
                <option value="0">New Post</option>
                { articles !== undefined && articles.map(a => <option key={a.id} value={a.id}>{a.title}</option>) }
            </Select>
            </Grid>
            <Grid item xs={9}>
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
            <Grid item xs={9} style={{ textAlign: "right" }} onBlur={saveCustomLocation}>
                <TextField
                    ref={places}
                    fullWidth={true}
                    label="Place"
                    variant="outlined"
                    onClick={addPlaceFocus}
                    InputProps={{
                        inputComponent: GooglePlacesAutocomplete,
                        inputProps: {
                            initialValue: articleData.location,
                            onSelect: updateLocation,
                            placeholder: "",
                            inputStyle: {width: '100%', padding: '18.5px 14px'}
                        }
                    }}

                />
                <LocationOnIcon
                    style={{ position: "relative", top: -40, cursor: "pointer" }}
                    onClick={loadMap}
                />
            </Grid>
            <Grid item xs={9}>
                <ImageUpload articleId={articleData.id} img={articleData.img} updateImages={updateImages}/>
            </Grid>
            <Grid item xs={9}>
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
            <Grid item xs={9}>
                <RatingIcons ratings={articleData.ratings} readOnly={false} updateRating={updateRating}/>
            </Grid>
            <Grid item xs={9}>
                <TextField
                    label="Description"
                    fullWidth={true}
                    multiline={true}
                    rows={5}
                    rowsMax={100}
                    value={articleData.desc}
                    onChange={event => {
                        setArticleData({...articleData, desc: event.currentTarget.value} );
                    }}
                    onBlur={updateArticle}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={9}>
                <Button
                    variant={"outlined"}
                    color={"secondary"}
                    onClick={() => setArticleData({...articleData, published: !articleData.published})}
                >
                    {articleData.published ? "Unpublish" : "Publish"}
                </Button>
            </Grid>
        </Grid>
    )
}
