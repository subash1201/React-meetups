import { MongoClient , ObjectId } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";
import MeetUpDetail from "../../components/meetups/MeetUpDetail";

const MeetUpDetails = (props) => {
  return (
    <Fragment>
    <Head>
        <title>{props.meetUpData.title}</title>
        <meta name="description" content={props.meetUpData.description}/>
    </Head>
    <MeetUpDetail
      image={props.meetUpData.image}
      title={props.meetUpData.title}
      address={props.meetUpData.address}
      description={props.meetUpData.description}
    />
    </Fragment>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://subash12:KcAn5ZoFW2P4lagy@mongodb-user.uvbao.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, {_id:1}).toArray();

  client.close();

  return {
    fallback: 'blocking',
    paths: meetups.map(meetup => ({
        params : {
            meetupId: meetup._id.toString()
        }
    }))
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://subash12:KcAn5ZoFW2P4lagy@mongodb-user.uvbao.mongodb.net/meetups?retryWrites=true&w=majority"
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({_id:ObjectId(meetupId)});

  console.log(selectedMeetup);

  client.close()
  return {
    props: {
      meetUpData: {
        id: selectedMeetup._id.toString(),
        image:selectedMeetup.image,
        title:selectedMeetup.title,
        address: selectedMeetup.address,
        description:selectedMeetup.description,
      },
    },
  };
}

export default MeetUpDetails;
