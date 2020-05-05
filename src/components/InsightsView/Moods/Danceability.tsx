import Color from 'color'
import Vibrant from 'node-vibrant'
import React, { useEffect, useState } from 'react'
import Marquee from 'react-double-marquee'
import styled from 'styled-components'

interface HappyProps {
  features: IUserAudioFeatures
  loaded: boolean
  track: { track: SpotifyApi.TrackObjectFull; score: number }
  averages: { hasRegion: boolean; data: INationalAverage }
  emoji: string
}
const Happy = ({ features, loaded, track, averages, emoji }: HappyProps) => {
  const [artistBackgroundURL, setArtistBackgroundURL] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('#c7ecee')
  const [textColor, setTextColor] = useState(['#c7ecee', '#c7ecee'])
  const [altTextColor, setAltTextColor] = useState([['#c7ecee'], [1, 1, 1]])
  const [altBackgroundColor, setAltBackgroundColor] = useState('#dff9fb')
  const [score, setScore] = useState(0)
  const [averageScore, setAverageScore] = useState(0)
  const handleClick = () => {
    window.open(track.track.uri)
  }
  const OverlayDiv = styled.div`
    position: absolute;
    background-image: linear-gradient(
      to right,
      ${altTextColor[0][0]},
      rgba(${altTextColor[1].join(', ')}, 0.5),
      ${altTextColor[0][0]}
    );
  `
  useEffect(() => {
    const setColors = async (image: any) => {
      await Vibrant.from(image)
        .getPalette()
        .then((palette) => {
          if (
            palette.LightVibrant &&
            palette.DarkMuted &&
            palette.Vibrant &&
            palette.LightMuted
          ) {
            let c = Color(palette.LightVibrant.hex)
            const t = Color(palette.DarkMuted.hex)
            let d = Color(palette.LightMuted.hex)
            const u = Color(palette.Vibrant.hex)
            if (c.contrast(t) < 4) {
              c = c.lighten(0.4)
            } else if (c.contrast(t) < 7) {
              c = c.lighten(0.2)
            }
            if (d.contrast(u) < 4) {
              d = d.lighten(0.4)
            } else if (d.contrast(u) < 7) {
              d = d.lighten(0.2)
            }
            if (d.contrast(u) < 4) {
              d = Color('#ecf0f1')
            }
            setTextColor([t.hex(), t.darken(0.5).hex()])
            setAltTextColor([[u.hex()], [u.red(), u.green(), u.blue()]])
            setAltBackgroundColor(d.hex())
            setBackgroundColor(c.hex())
          }
        })
    }
    if (artistBackgroundURL !== '') {
      setColors(artistBackgroundURL)
    }
  }, [artistBackgroundURL])
  if (loaded && track && artistBackgroundURL === '' && averages) {
    setScore(features.danceability)
    setAverageScore(averages.data.features.danceability)
    setArtistBackgroundURL(track.track.album.images[0].url)
  }
  return (
    <div
      className="mood"
      style={{
        backgroundColor: textColor[0],
        backgroundImage: `linear-gradient(45deg, ${altTextColor[0][0]}, ${altTextColor[0][0]})`,
      }}
    >
      <div className="container">
        {loaded && track ? (
          <>
            <OverlayDiv className="marquee-overlay">
              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex flex-column justify-content-center">
                    <div
                      className="mood-score"
                      style={{ color: backgroundColor }}
                    >
                      <span style={{ color: altBackgroundColor }}>
                        {Math.round(score * 100)}%{' '}
                      </span>
                      Danceable
                    </div>
                    <div
                      className="mood-score-average"
                      style={{ color: backgroundColor }}
                    >
                      {Math.round(score - averageScore) < 3 ? (
                        'On Average'
                      ) : (
                        <span>
                          {Math.abs(Math.round(score - averageScore))}%{' '}
                          {score > averageScore ? 'lower' : 'higher'} than
                          others{' '}
                          {averages.hasRegion
                            ? 'in your region'
                            : 'in the world'}
                          .
                        </span>
                      )}
                    </div>
                    <div
                      className="mood-description"
                      style={{ color: backgroundColor }}
                    >
                      The danceability of tracks is judged by musical elements
                      such as tempo, rhythm stability, and beat strength. Your
                      top tracks are {Math.round(score * 100)}% danceable on
                      average.
                    </div>
                  </div>
                </div>
                <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="track-label"
                    style={{ color: backgroundColor }}
                  >
                    Your Dance Anthem
                  </div>
                  <div
                    className="spotify-container shadow-lg"
                    style={{ backgroundColor }}
                    key={track.track.id}
                    onClick={handleClick}
                  >
                    <img
                      src={track.track.album.images[0].url}
                      className="top-image"
                      alt=""
                    />
                    <p className="artist-name" style={{ color: textColor[0] }}>
                      {track.track.name}
                      <br />
                      {track.track.artists.map((a) => a.name).join(', ')}
                      <br />
                      {Math.round(track.score * 100)}% Danceable
                    </p>
                  </div>
                </div>
              </div>
            </OverlayDiv>
            <div className="marquee-container">
              <Marquee childMargin={0} delay={0} speed={0.02}>
                {Array.from({ length: 10 })
                  .map(() => emoji + ' ')
                  .join('')}
              </Marquee>
            </div>
          </>
        ) : (
          <div className="col">Loading...</div>
        )}
      </div>
    </div>
  )
}
export default Happy
