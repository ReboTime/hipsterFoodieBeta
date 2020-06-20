import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import ImageUploader from "react-images-upload";
import Cookies from "cookies-js";

export default function ImageUpload(props) {
    const [img, setImg] = useState(props.img);
    const [showImageModal, setShowImageModal] = useState(false);
    const [pictures, setPictures] = useState([]);
    const imageDir = "/images/";
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        console.log(props.img);
        setImg(props.img);
        setHasChanges(false);
    }, [props.img])

    const uploadPicture = (picture, id) => {
        let opt = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' ,
                session: Cookies.get('hfbSession'),
                fileName: id + '.jpg',
                articleId: props.articleId
            },
            crossDomain: true,
            body: JSON.stringify({data: picture})
        }
        fetch('http://localhost:3001/article/addImage', opt);
    }

    const deletePictures = () => {
        let opt = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' ,
                session: Cookies.get('hfbSession'),
                articleId: props.articleId
            },
            crossDomain: true,
        }
        return fetch('http://localhost:3001/article/clearImages', opt);
    }

    const onDrop = (picture, files) => {
        setHasChanges(true);
        setPictures(files);
    };

    const closeImageModal = () => {
        if (hasChanges) {
            let id = 1;
            let images = [];
            deletePictures().then(() => {
                pictures.forEach(picture => {
                    uploadPicture(picture, id);
                    images.push(imageDir + props.articleId + '/' + id + '.jpg');
                    id++;
                });
                props.updateImages(images);
            });
            setHasChanges(false);
        }
        setShowImageModal(false);
    }

    return (
        <div>
            <Button onClick={() => setShowImageModal(true)}>
                Edit Images
            </Button>
            <Dialog
                open={showImageModal}
                onClose={closeImageModal}
                onEscapeKeyDown={closeImageModal}
                fullWidth={true}
            >
                <DialogTitle id="dialog-title" style={{ textAlign: "center"}}>
                    Post images
                </DialogTitle>
                <DialogContent>
                    <ImageUploader
                        withIcon={true}
                        withPreview={true}
                        defaultImages={props.img}
                        label="Baga poze"
                        onChange={onDrop}
                        imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                        maxFileSize={15242880}
                    />
                </DialogContent>
            </Dialog>
        </div>

    )
}
