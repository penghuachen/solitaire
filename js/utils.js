export const formateTime = timeRecords => {
  let seconds = timeRecords % 60;
  let minutes = Math.floor(timeRecords / 60);
  
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return minutes + ":" + seconds;
}