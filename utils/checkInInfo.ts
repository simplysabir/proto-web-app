import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_KEY = '8d3c6697-0ba1-42d4-b5c7-6727c04adce7';

let baseUrl = 'http://ec2-44-198-54-124.compute-1.amazonaws.com:3000/v1';
// https://proto-api.onrender.com/checkins
const getTimelineData = async (walletAddress) => {
  return axios.get(`${baseUrl}/checkin/`, {
    params: { user_wallet_address: walletAddress }, // / get
    headers: { authorization: API_KEY },
  });
};

export const useTimelineData = (walletAddress) => {
  return useQuery({
    queryKey: ['timelineData', walletAddress],
    queryFn: () => getTimelineData(walletAddress),
  });
};
