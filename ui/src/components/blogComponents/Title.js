import React, { useState, useRef, useEffect } from 'react';
import {
	Button,
	ButtonGroup,
	Card,
	CardContent,
	CardMedia,
	Grid,
	IconButton,
	Modal,
	Typography,
	CardHeader,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';

import { ReactComponent as TitleSvg } from './titleSvg.svg';
import './Title.css';

console.log(TitleSvg);

const useStyles = makeStyles((theme) => ({
	titleCard: {
		[theme.breakpoints.up('xs')]: {
			padding: '20px',
		},
		[theme.breakpoints.up('md')]: {
			padding: '40px 40px 20px',
		},
		[theme.breakpoints.up('xl')]: {
			padding: '60px 60px 30px',
		},
		marginTop: '20px',
		marginBottom: '10px',
	},
	descriptionCard: {
		[theme.breakpoints.up('xs')]: {
			padding: '20px',
		},
		[theme.breakpoints.up('md')]: {
			padding: '30px 40px 20px',
		},
		[theme.breakpoints.up('xl')]: {
			padding: '50px 60px 20px',
		},
	},
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		'&:focus': {
			outline: 'none',
		},
	},
	modalCard: {
		width: '800px',
		maxWidth: '90%',
		paddingTop: '10px',
		paddingBottom: '10px',
		'&:focus': {
			outline: 'none',
		},
	},
}));

export default function Title(props) {
	const classes = useStyles();
	const description =
		'while (awake) { if (hungry) then { function findDeliciousFood(){ if (happy) then foundIt = true } if (foundIt == true) return blogPost; }';

	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [modalContent, setModalContent] = useState();

	const svgRef = useRef(null);

	useEffect(() => {
		const svg = svgRef.current.childNodes;
		setTimeout(() => {
			let offset = 0;
			for (let i = 0; i < svg.length; i++) {
				svg[i].setAttribute('style', `animation: line-anim 4s ease forwards ${offset}s;`);
				offset += 0.2;
			}
			svgRef.current.setAttribute(
				'style',
				`animation: fillIt 2s ease forwards ${offset + 2}s;`,
			);
		}, 2500);
	}, []);

	function openModal(event) {
		setModalContent(event.currentTarget.value);
		setModalIsOpen(true);
	}
	function renderModal(content) {
		switch (content) {
			case 'about':
				return (
					<>
						<CardHeader
							title='<AboutTheHipster />'
							subheader='...and some random information too'
							titleTypographyProps={{ align: 'center' }}></CardHeader>
						<CardMedia
							component='img'
							image='images/bigPanSmallPic2.jpg'
							style={
								smallWindow
									? { width: '95%', height: 'auto' }
									: { width: '70%', height: 'auto' }
							}></CardMedia>
						<CardContent>
							<Typography variant='body2' align='center' align='justify'>
								This is Valentin. To begin with I wanted to become an inventor, but
								that never happened. Now I'm a chef.
								<br />
								And I'm a coder too. I like to combine my passions. So I coded this
								blog you see here. Hope you enjoy my honest and unfiltered reviews.
								<br />
								<cite style={{ float: 'right' }}> - I love lamp.</cite>
							</Typography>
						</CardContent>
					</>
				);
			case 'media':
				return (
					<>
						<Grid item container justify='center' alignItems='center'>
							<Typography variant='h6'>Face my book:</Typography>
							<IconButton
								href='https://www.facebook.com/Hipster-Foodie-Beta-102325544868819'
								target='_blank'>
								<FacebookIcon fontsize='large' htmlColor='#3b5998' />
							</IconButton>
						</Grid>
						<Grid item container justify='center' alignItems='center'>
							<Typography variant='h6'>Read my tweets:</Typography>
							<IconButton href='https://twitter.com/hfbblog' target='_blank'>
								<TwitterIcon fontsize='large' htmlColor='#00acee' />
							</IconButton>
						</Grid>
						<Grid item container justify='center' alignItems='center'>
							<Typography variant='h6'>Watch my pics:</Typography>
							<IconButton href='https://www.instagram.com/hfoodieb/' target='_blank'>
								<InstagramIcon fontsize='large' htmlColor='#C13584' />
							</IconButton>
						</Grid>
					</>
				);
			case 'article':
				return 'article content';
			default:
				return 'whoops... default content';
		}
	}

	function closeModal() {
		setModalIsOpen(false);
	}

	function getArticle() {
		const articles = props.articles;
		const url = `post/${
			articles[Math.floor(Math.random() * articles.length)].url
		}`;
		window.open(url, '_blank');
	}

	const smallWindow = window.innerWidth < 600;
	console.log(window.innerWidth);

	return (
		<>
			<Card variant='elevation' elevation={10} className={classes.titleCard}>
				<TitleSvg ref={svgRef} />
				<Typography variant='subtitle2' color='initial' style={{ marginTop: '10px' }}>
					Half webDev, half chef, 100% geek. You're welcome!
				</Typography>
			</Card>
			<Card variant='elevation' elevation={10} className={classes.descriptionCard}>
				<Typography variant='subtitle2' align='justify' style={{ marginBottom: '20px' }}>
					{description}
				</Typography>
				<ButtonGroup color='primary' aria-label='outlined primary button group'>
					<Button value='about' onClick={openModal}>
						{'<About />'}
					</Button>
					<Button value='media' onClick={openModal}>
						{smallWindow ? '<Media />' : '<SocialMedia />'}
					</Button>
					<Button value='article' onClick={getArticle} target='_blank'>
						{smallWindow ? '<GoRandom />' : '<RandomArticle />'}
					</Button>
				</ButtonGroup>
			</Card>
			<Modal open={modalIsOpen} onClose={closeModal} className={classes.modal}>
				<Card variant='elevation' elevation={10} className={classes.modalCard}>
					<Grid
						container
						direction='column'
						justify='space-around'
						alignItems='center'
						spacing={4}>
						{renderModal(modalContent)}
					</Grid>
				</Card>
			</Modal>
		</>
	);
}
