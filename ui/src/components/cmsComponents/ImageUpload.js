import React, {forwardRef, useEffect, useState} from "react";
import ImageUploader from "react-images-upload";
import Cookies from "cookies-js";
import { ReactSortable } from "react-sortablejs";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";

const CustomComponent = forwardRef((props, ref) => {
    return <Grid container  spacing={3} ref={ref}>{props.children}</Grid>;
});

export default function ImageUpload(props) {
    const [savedImages, setSavedImages] = useState(props.img);
    const [dragImages, setDragImages] = useState(props.img.map((i, index) => ({id: index, name: i})));
    const [uploading, setUploading] = useState(false);
    const imageDir = "https://hipster-foodie-beta.s3.eu-west-1.amazonaws.com/images/";
    const apiHost = process.env.NODE_ENV === "development" ? 'http://192.168.100.32:5000' : '';

    useEffect(() => {
        setSavedImages(props.img);
        setDragImages(props.img.map((i, index) => ({id: index, name: i})));
        return () => {
            setSavedImages([]);
            setDragImages([]);
        }
    }, [props.img])

    useEffect(() => {
        let drag = dragImages.map(image => image.name);
        if (savedImages.length > 0 && !compareArrays(drag, savedImages)) {
            props.updateImages(drag);
        }
    }, [dragImages])

    const compareArrays = (a, b) => {
        let result = true;
        if (a.length !== b.length) return false;
        a.forEach((value, index) => {
            if(value !== b[index]) result = false;
        });
        return result;
    }
    const uploadPicture = (picture, fileName) => {
        let opt = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' ,
                session: Cookies.get('hfbSession'),
                fileName: fileName + '.jpg',
                articleId: props.articleId
            },
            crossDomain: true,
            body: JSON.stringify({data: picture})
        }
        return fetch(apiHost + '/article/addImage', opt);
    }

    const deletePicture = (fileName) => {
        let opt = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' ,
                session: Cookies.get('hfbSession'),
                articleId: props.articleId,
                fileName: fileName
            },
            crossDomain: true,
        }
        return fetch(apiHost + '/article/deleteImage', opt);
    }

    const onDrop = (picture, files) => {
        setUploading(true);
        let changes = 0;
        let images = [...savedImages];
        for (const fileData of files) {
            if (fileData.startsWith("data:image") && !savedImages.includes(fileData)) {
                changes++;
                let uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                uploadPicture(fileData, uuid).then(() => {
                    changes--;
                    console.log("upload complete!");
                });
                images.push( imageDir + props.articleId + '/' + uuid + '.jpg')
            }
        }

        let interval = setInterval(() => {
            console.log(changes);
            if (changes === 0) {
                props.updateImages(images);
                clearInterval(interval);
                setUploading(false);
            }
        }, 1000);
    };

    const deleteImage = (index) => {
        let image = savedImages[index];
        deletePicture(image).then(() => {
            console.log("deleted file " + image + " with index " + index);
        });
        let images = [...savedImages];
        images.splice(index, 1);
        props.updateImages(images);
    }



    return (
        <div>
            { dragImages !== undefined && dragImages.length > 0 && (
                <div>
                    <ReactSortable
                        list={dragImages}
                        setList={setDragImages}
                        tag={CustomComponent}
                    >
                        { dragImages.map(image =>
                            <Grid item key={image.id} xs={12} md={6} lg={4}>
                                <span
                                    style={{ position: 'relative',
                                        top: '10px',
                                        right: '-10px',
                                        background: 'white',
                                        float: 'right',
                                        width: '25px',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        border: 'black solid 1px'
                                    }}
                                    onClick={() => deleteImage(image.id)}
                                >
                                    X
                                </span>
                                <img alt=''  src={image.name} width="100%" height={300} style={{ objectFit: 'cover'}}/>
                            </Grid>
                            )}
                    </ReactSortable>
                    { dragImages.length > 1 && <Grid xs={12} style={{ fontSize: '0.7rem' }}>(drag images to change order)</Grid>}
                </div>
                    )
            }
                    {uploading ?
                        <CircularProgress size="50px" thickness={1} />
                        :
                        <ImageUploader
                            buttonText="Upload images"
                            withIcon={false}
                            withPreview={false}
                            defaultImages={props.img}
                            label=""
                            onChange={onDrop}
                            imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                            maxFileSize={15242880}
                        />}
        </div>

    )
}
