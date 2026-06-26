import http from 'k6/http';

export const options = {
  vus: 200,
  iterations: 5000,
};

export default function () {
  http.post('http://172.31.100.26:31421/api/submit', null, {
    headers: {
      Host: 'service.monitor.local',
    },
  });
}
