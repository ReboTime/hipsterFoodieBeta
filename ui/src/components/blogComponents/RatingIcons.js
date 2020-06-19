import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import LocalBarIcon from '@material-ui/icons/LocalBar';

const useStyles = makeStyles((theme) => ({
	star: {
		color: '#fcec03',
	},
	price: {
		color: '#18b800',
	},
	drinks: {
		color: '#00b87e',
	},
	food: {
		color: '#d44700',
    },
}));

const ratingIcons = [
	{
		name: 'star',
		component: <StarBorderIcon />,
	},
	{
		name: 'price',
		component: <MonetizationOnOutlinedIcon />,
	},
	{
		name: 'drinks',
		component: <RestaurantMenuIcon />,
	},
	{
		name: 'food',
		component: <LocalBarIcon />,
	},
];

export default function RatingIcons(props) {
    const classes = useStyles();
	return (
		<Grid item xs={12} alignItems='center' justify='center' container>
			{ratingIcons.map((icon) => (
				<Grid item xs={6} md={3} key={icon.name}>
					<Rating
						classes={{ iconFilled: classes[icon.name] }}
						name='stars'
						max={5}
						readOnly={true}
						defaultValue={props.ratings[icon.name]}
						precision={0.5}
						icon={icon.component}
					/>
				</Grid>
			))}
		</Grid>
	);
}
