import axios from 'axios';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Meta from '../components/meta';
import Page from '../components/Page';
import Player from '../components/Player';
import ShowList from '../components/ShowList';
import ShowNotes from '../components/ShowNotes';
import getBaseURL from '../lib/getBaseURL';

const IndexPage = ({ router, shows = [], baseURL }) => {
  const [currentShow, setCurrentShow] = useState(
    router.query.number || shows[0].displayNumber
  );
  const [currentPlaying, setCurrentPlaying] = useState(currentShow);

  // componentWillReceiveProps
  useEffect(() => {
    const { query } = router;
    if (query.number) {
      setCurrentShow(query.number);
    }
  }, [router]);

  // Currently Shown shownotes
  const show =
    shows.find(showItem => showItem.displayNumber === currentShow) || shows[0];
  // Currently Playing
  const current =
    shows.find(showItem => showItem.displayNumber === currentPlaying) ||
    shows[0];

  return (
    <Page>
      <Meta show={show} baseURL={baseURL} />
      <div className='wrapper'>
        <main className='show-wrap' id='main' tabIndex='-1'>
          <Player show={current} />
          <ShowList
            shows={shows}
            currentShow={currentShow}
            currentPlaying={currentPlaying}
            setCurrentPlaying={setCurrentPlaying}
          />
          <ShowNotes show={show} setCurrentPlaying={setCurrentPlaying} />
        </main>
      </div>
    </Page>
  );
};

IndexPage.getInitialProps = async ({ req }) => {
  const baseURL = getBaseURL(req);
  const { data: shows } = await axios.get(`${baseURL}/api/shows`);
  return { shows, baseURL };
};

IndexPage.propTypes = {
  router: PropTypes.object.isRequired,
  shows: PropTypes.array.isRequired,
  baseURL: PropTypes.string.isRequired,
};

export default withRouter(IndexPage);
