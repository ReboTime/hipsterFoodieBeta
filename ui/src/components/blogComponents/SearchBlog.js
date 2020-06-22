import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import {
	Modal,
	Slide,
	Paper,
	Grid,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
	fixInCorner: {
		padding: '0',
		[theme.breakpoints.up('xs')]: {
			position: 'fixed',
			top: '3px',
			right: '5px',
		},
		[theme.breakpoints.up('md')]: {
			position: 'fixed',
			top: '10px',
			right: '10px',
		},
	},
	paper: {
		[theme.breakpoints.up('xs')]: {
			paddingTop: '20px',
			paddingBottom: '10px',
		},
		[theme.breakpoints.up('md')]: {
			paddingTop: '30px',
			paddingBottom: '30px',
		},
		opacity: '0.9',
	},
}));

export default function SearchBlog(props) {
	const [searchOpen, setSearchOpen] = useState(false);
	const classes = useStyles();

	function handleKeyDown(e) {
		if (e.keyCode === 13) toggleDrawer();
	}

	function toggleDrawer() {
		setSearchOpen(!searchOpen);
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
			<Modal open={searchOpen} onClose={() => setSearchOpen(!searchOpen)}>
				<Slide in={searchOpen} timeout={700} direction={'down'}>
					<Paper className={classes.paper}>
						<Grid container justify='center'>
							<Grid item xs={10}>
								<Typography variant='h4' color='initial'>
									hope you find what you're looking for
								</Typography>
								<Typography variant='subtitle2' color='initial'>
									if not, well... i still have a lot of places to try
								</Typography>
							</Grid>
							<Grid item xs={10}>
								<TextField
									label='Search for:'
									variant='outlined'
									size='small'
									fullWidth={true}
									autoFocus={true}
									value={props.searchInput}
									onChange={(e) => {
										props.handleSearchInputChange(e.target.value);
									}}
									onKeyDown={handleKeyDown}
									InputProps={{
										endAdornment: (
											<InputAdornment position='end'>
												<IconButton
													onClick={() => {
														props.handleSearchInputChange('');
													}}>
													<CloseIcon fontSize='small' />
												</IconButton>
											</InputAdornment>
										),
									}}
									style={{ marginBottom: 10, marginTop: 10 }}
								/>
							</Grid>
						</Grid>
					</Paper>
				</Slide>
			</Modal>
		</div>
	);
}
