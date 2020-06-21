import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import ImageUploader from "react-images-upload";
import Cookies from "cookies-js";
import { ReactSortable } from "react-sortablejs";

export default function ImageUpload(props) {
    const [savedImages, setSavedImages] = useState(props.img);
    const [dragImages, setDragImages] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const imageDir = "https://hipster-foodie-beta.s3.eu-west-1.amazonaws.com/images/";
    const apiHost = process.env.NODE_ENV === "development" ? 'http://192.168.100.32:5000' : '';

    useEffect(() => {
        setSavedImages(props.img);
        setDragImages(props.img.map((i, index) => {
            return {id: index, name: i}
        }));
    }, [props.img])

    useEffect(() => {
        if (savedImages !== props.img) {
            props.updateImages(savedImages);
        }
    }, [ savedImages ])

    useEffect(() => {
        let drag = dragImages.map(image => image.name);
        if (savedImages.length > 0 && !compareArrays(drag, savedImages)) {
            setSavedImages(drag);
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
    };

    const closeImageModal = () => {
        setShowImageModal(false);
    }

    return (
        <div>
            { dragImages !== undefined && dragImages.length > 0 && (
                <div>
                    <ReactSortable list={dragImages} setList={setDragImages}>
                        { dragImages.map(image => <img alt='' key={image.id} src={image.name} height={100} style={{ marginRight: 10 }}/>)}
                    </ReactSortable>
                    { dragImages.length > 1 && <p style={{ fontSize: '0.7rem' }}>(drag images to change order)</p>}
                </div>)
            }
            <Button onClick={() => setShowImageModal(true)} variant="outlined">
                Upload Images
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
