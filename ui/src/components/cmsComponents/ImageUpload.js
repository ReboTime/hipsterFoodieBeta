import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import ImageUploader from "react-images-upload";
import Cookies from "cookies-js";

export default function ImageUpload(props) {
    const [savedImages, setSavedImages] = useState(props.img);
    const [showImageModal, setShowImageModal] = useState(false);
    const imageDir = "https://hipster-foodie-beta.s3.eu-west-1.amazonaws.com/images/";
    const apiHost = process.env.NODE_ENV === "development" ? 'http://localhost:5000' : '';

    useEffect(() => {
        setSavedImages(props.img);
    }, [props.img])

    useEffect(() => {
        if (savedImages !== props.img) {
            props.updateImages(savedImages);
        }
    }, [ savedImages ])

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
        let images = [...savedImages];
        files.forEach(fileData => {
            if (fileData.startsWith("data:image") && !savedImages.includes(fileData)) {
                let uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                uploadPicture(fileData, uuid).then(() => {
                    console.log("upload complete!");
                });
                images.push( imageDir + props.articleId + '/' + uuid + '.jpg')
            }
        });
        savedImages.forEach(savedImage => {
           if (!files.includes(savedImage)) {
                deletePicture(savedImage).then(() => {
                   console.log("deleted file " + savedImage + " with index " + (images.indexOf(savedImage)));
               });
               images.splice(savedImages.indexOf(savedImage), 1);
           }
        });
        setSavedImages(images);
        console.log(images);
    };

    const closeImageModal = () => {
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
