import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Drawer, Grid, IconButton, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	fixInCorner: {
		position: 'fixed',
		top: '10px',
		right: '10px',
	},
}));

export default function SearchBlog(props) {
	const [searchOpen, setSearchOpen] = useState(false);
	const classes = useStyles();

	function handleSearchClick(e) {
		e.preventDefault();
		setSearchOpen(true);
	}

	function toggleDrawer(e) {
		setSearchOpen(!searchOpen);
	}

	if (!searchOpen) {
		return (
			<IconButton
				variant='outlined'
				onClick={handleSearchClick}
				className={classes.fixInCorner}
				color='primary'>
				<SearchIcon fontSize='large' />
			</IconButton>
		);
	}

	return (
		<div>
			<Drawer anchor='top' open={searchOpen} ModalProps={{ onBackdropClick: toggleDrawer }}>
				<Grid container justify='center' spacing={3}>
					<Grid item xs={10}>
						<Typography variant='h4' color='initial'>
							hope you find what you're looking for
						</Typography>
					</Grid>
					<Grid item xs={10}>
						<TextField
							label='Search for:'
                            variant='outlined'
                            size='small'
                            fullWidth={true}
                            autoFocus={true}
                            onChange={props.handleSearchInputChange}
						/>
					</Grid>
				</Grid>
			</Drawer>
		</div>
	);
}
