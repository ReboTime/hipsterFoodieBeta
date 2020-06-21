import React, {useState, useEffect} from 'react';
import {Snackbar} from '@material-ui/core';


export default function CopyLinkSnackbar(props) {
    const [open, setOpen] = useState(props.open);

    useEffect(()=>{
        setOpen(props.open);
    },[props.open]);

    return (
        <Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				open={open}
				autoHideDuration={2000}
				onClose={props.toggleSnackbar}
				message='Link copied.'
			/>
    )
}