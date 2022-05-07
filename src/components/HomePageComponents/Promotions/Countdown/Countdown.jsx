import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import ButtonUI from '../../../../common/ButtonUI/ButtonUI';

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const timerProps = {
  isPlaying: true,
  size: 120,
  strokeWidth: 6,
};
const renderTime = (dimension, time) => {
  return (
    <div className="time-wrapper">
      <div style={{ fontSize: '3.2rem' }} className="time">
        {time}
      </div>
      <div>{dimension}</div>
    </div>
  );
};
const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time) => (time / daySeconds) | 0;

const Countdown = () => {
  const stratTime = Date.now() / 1000; // use UNIX timestamp in seconds
  const endTime = stratTime + 176930; // use UNIX timestamp in seconds

  const remainingTime = endTime - stratTime;
  const days = Math.ceil(remainingTime / daySeconds);
  const daysDuration = days * daySeconds;

  return (
    <div
      className="countdown"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        padding: '2rem',
        color: '#fff',
        background: `radial-gradient( circle 776px at 70.1% 102%, #14b9d5 9.1%, rgba(125,137,251,1) 76.8% )`,
      }}
    >
      <h3
        className="countdown__first-font"
        style={{
          textAlign: 'center',
          fontSize: '1.4rem',
          lineHeight: '1.4rem',
          letterSpacing: '2px',
          color: '#fff',
        }}
      >
        LAST MINUTE !
      </h3>
      <h1
        style={{
          color: '#fff',
          fontSize: '4rem',
          lineHeight: '5.5rem',
          fontWeight: 'bold',
        }}
        className="countdown__title"
      >
        Summer
        <div>
          <b
            style={{
              color: '#fff',
              position: 'relative',
              borderBottom: '1px solid #fff',
            }}
          >
            SALE
          </b>
        </div>
      </h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ padding: '2rem' }}>
          <CountdownCircleTimer
            {...timerProps}
            colors={[['#fff']]}
            duration={daysDuration}
            initialRemainingTime={remainingTime}
          >
            {({ elapsedTime }) =>
              renderTime('days', getTimeDays(daysDuration - elapsedTime))
            }
          </CountdownCircleTimer>
        </div>
        <div style={{ padding: '2rem' }}>
          <CountdownCircleTimer
            {...timerProps}
            colors={[['#fff']]}
            duration={daySeconds}
            initialRemainingTime={remainingTime % daySeconds}
            onComplete={(totalElapsedTime) => [
              remainingTime - totalElapsedTime > hourSeconds,
            ]}
          >
            {({ elapsedTime }) =>
              renderTime('hours', getTimeHours(daySeconds - elapsedTime))
            }
          </CountdownCircleTimer>
        </div>
        <div style={{ padding: '2rem' }}>
          <CountdownCircleTimer
            {...timerProps}
            colors={[['#fff']]}
            duration={hourSeconds}
            initialRemainingTime={remainingTime % hourSeconds}
            onComplete={(totalElapsedTime) => [
              remainingTime - totalElapsedTime > minuteSeconds,
            ]}
          >
            {({ elapsedTime }) =>
              renderTime('minutes', getTimeMinutes(hourSeconds - elapsedTime))
            }
          </CountdownCircleTimer>
        </div>
        <div style={{ padding: '2rem' }}>
          <CountdownCircleTimer
            {...timerProps}
            colors={[['#fff']]}
            duration={minuteSeconds}
            initialRemainingTime={remainingTime % minuteSeconds}
            onComplete={(totalElapsedTime) => [
              remainingTime - totalElapsedTime > 0,
            ]}
          >
            {({ elapsedTime }) =>
              renderTime('seconds', getTimeSeconds(elapsedTime))
            }
          </CountdownCircleTimer>
        </div>
      </div>
      <ButtonUI text="Check now" paddingButton="1rem 3rem" p="2rem 0 0" />
    </div>
  );
};

export default Countdown;
