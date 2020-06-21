import React, { useState, useEffect } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Drawer, Grid, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
	fixInCorner: {
		position: 'fixed',
		top: '10px',
		right: '10px',
	},
}));

export default function SearchBlog(props) {
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchInput, setSearchInput] = useState(props.searchInput);
	const classes = useStyles();

	useEffect(() => {
		setSearchInput(props.searchInput);
	}, [props.searchInput]);

	function handleKeyDown(e) {
		if (e.keyCode === 13) toggleDrawer();
	}

	function toggleDrawer(e) {
		setSearchOpen(!searchOpen);
		console.log('drawer toggled');
	}

	if (!searchOpen) {
		return (
			<IconButton
				variant='outlined'
				onClick={toggleDrawer}
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
                            value={searchInput}
                            onChange={(e) => { props.handleSearchInputChange(e.target.value)}}
							onKeyDown={handleKeyDown}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton onClick={() => { props.handleSearchInputChange(''); }}>
											<CloseIcon fontSize='small' />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Grid>
				</Grid>
			</Drawer>
		</div>
	);
}
