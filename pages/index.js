import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';
import { Fragment } from 'react';

function HomePage(props) {
	return (
		<Fragment>
			<Head>
				<title>ReactNext Meetups</title>
				<meta
					name='description'
					content='Browse huge list of highly active React meetups'
				/>
			</Head>
			<MeetupList meetups={props.meetups} />
		</Fragment>
	);
}

export async function getStaticProps() {
	// Fetch data from an API
	const client = await MongoClient.connect(
		'mongodb+srv://shubham:next12345@cluster0.b6rcs.mongodb.net/meetups?retryWrites=true&w=majority'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find().toArray();

	const modifiedMeetups = meetups.map((meetup) => ({
		title: meetup.title,
		address: meetup.address,
		image: meetup.image,
		id: meetup._id.toString(),
	}));

	client.close();

	return {
		props: {
			meetups: modifiedMeetups,
		},
		revalidate: 1,
	};
}

export default HomePage;
