import React, { useState} from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Modal, Slide, Paper, Grid, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
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
			<Modal
				open={searchOpen}
				onClose={() => setSearchOpen(!searchOpen)}
			>
				<Slide
					in={searchOpen}
					timeout={1000}
					direction={"down"}
				>
					<Paper>
						<Grid container justify='center'>
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
									value={props.searchInput}
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
