import Head from 'next/head';
import { MongoClient, ObjectId } from 'mongodb';

import MeetupDetail from '../../components/meetups/MeetupDetail';
import { Fragment } from 'react';

// our-domain.com/[meetup]
function MeetupDetails(props) {
	return (
		<Fragment>
			<Head>
				<title>{props.meetupData.title}</title>
				<meta name='description' content={props.meetupData.description} />
			</Head>
			<MeetupDetail
				image={props.meetupData.image}
				title={props.meetupData.title}
				address={props.meetupData.image}
				description={props.meetupData.description}
			/>
		</Fragment>
	);
}

export async function getStaticPaths() {
	const client = await MongoClient.connect(
		'mongodb+srv://shubham:next12345@cluster0.b6rcs.mongodb.net/meetups?retryWrites=true&w=majority'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

	client.close();

	return {
		fallback: false,
		paths: meetups.map((meetup) => ({ params: { meetupId: meetup._id.toString() } })),
	};
}

export async function getStaticProps(context) {
	const meetupId = context.params.meetupId;

	// Get data from API
	const client = await MongoClient.connect(
		'mongodb+srv://shubham:next12345@cluster0.b6rcs.mongodb.net/meetups?retryWrites=true&w=majority'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });
	console.log('Selected meetup ' + selectedMeetup);

	client.close();

	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				image: selectedMeetup.image,
				address: selectedMeetup.address,
				description: selectedMeetup.description,
			},
		},
	};
}

export default MeetupDetails;
