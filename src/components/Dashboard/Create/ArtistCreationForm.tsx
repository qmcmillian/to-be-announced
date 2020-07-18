import * as React from 'react';
import { useState } from 'react';
import { LineUpProps } from '../../../@types/types';
import axios from 'axios';

interface TicketingProps {
  addArtist: any;
  updateArtist: any;
  removeArtist: any;
  artist: LineUpProps;
}

export const ArtistCreationForm: React.FunctionComponent<TicketingProps> = ({
  addArtist,
  updateArtist,
  artist,
  removeArtist,
}) => {
  const [igHandle, setIgHandle] = useState<string>(
    artist ? artist.igHandle : '',
  );
  const [imageURL, setImageURL] = useState<string>(
    artist ? artist.imageURL : '',
  );
  const [igPost, setigPost] = useState<string>(artist ? artist.igPost : '');
  const [artistName, setArtistName] = useState<string>(
    artist ? artist.artistName : '',
  );
  const [artistError, setArtistError] = useState<any>({
    artistName: '',
    igPost: '',
  });
  const updatedArtist: LineUpProps = {
    igHandle: `@${igHandle.split('@')[igHandle.split('@').length - 1]}`,
    igPost,
    imageURL,
    artistName,
  };

  const fetchIgLink = (url: string) => {
    if (
      url.substring(0, 8) === 'https://' ||
      url.substring(0, 7) === 'http://' ||
      url.substring(0, 13) === 'instagram.com' ||
      url.substring(0, 4) === 'www.'
    ) {
      const meta = url.split('/').filter((word) => word.length === 11)[0];
      if (!meta) {
        return setArtistError({
          ...artistError,
          igPost: 'Invalid URL. Please try again',
        });
      } else {
        setArtistError({
          ...artistError,
          igPost: '',
        });
        return axios
          .get(`/api/insta/${meta}`)
          .then((res) => setImageURL(res.data))
          .catch((error) =>
            setArtistError({ ...artistError, igPost: error.response.data }),
          );
      }
    } else {
      setArtistError({
        ...artistError,
        igPost: 'Invalid URL. Please try again',
      });
    }
  };

  // const checkForErrors = async () => {
  //   setArtistError({
  //     ...artistError,
  //     igPost: 'Invalid URL',
  //   });
  // };
  return (
    <div className="mw6 center w-75-ns w-100">
      <div className="mv3  tl ba">
        <label className="f6-ns f7 fw6-ns db pl2 pt2 pb1">Artist Name</label>

        <input
          value={artistName}
          onChange={async (event) => {
            setArtistName(event.currentTarget.value);
          }}
          className="pl2 pb2 bn input-reset  mr3  w-90"
        />
      </div>
      <div className="mv3  tl ba">
        <label className="f6-ns f7 fw6-ns db pl2 pt2 pb1">
          Instagram Handle
        </label>

        <input
          value={igHandle}
          onChange={async (event) => {
            setIgHandle(event.currentTarget.value);
          }}
          className="pl2 pb2 bn input-reset  mr3  w-90"
        />
      </div>
      <div className="mt3 mb1 tl ba">
        <label className="f6-ns f7 fw6-ns db pl2 pt2 pb1">IG Post URL</label>
        <input
          value={igPost}
          onChange={(event) => {
            setigPost(event.currentTarget.value);
            fetchIgLink(event.currentTarget.value.replace(/\s/g, ''));
          }}
          className="pl2 pb2 bn input-reset  mr3  w-90"
        />
      </div>
      <small className="hljs-strong tl f6 db mb1 red">
        {artistError.igPost}
      </small>

      {!artist && (
        <div
          onClick={() => addArtist(updatedArtist)}
          className="mt4 b--black hover-bg-white hover-black dib noselect br-100 b--solid pa1 ph3 f5 fw5 mr3 "
        >
          Add
        </div>
      )}
      {artist && (
        <>
          <div
            onClick={() => updateArtist(updatedArtist)}
            className="mt4 b--black hover-bg-white hover-black dib noselect br-100 b--solid pa1 ph3 f5 fw5 mr3 "
          >
            Update
          </div>
          <div
            onClick={() => removeArtist(updatedArtist)}
            className="mt4 b--black hover-bg-white hover-black dib noselect br-100 b--solid pa1 ph3 f5 fw5 mr3 "
          >
            Remove
          </div>
        </>
      )}
    </div>
  );
};
