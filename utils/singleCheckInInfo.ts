import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

let baseUrl = 'http://ec2-44-198-54-124.compute-1.amazonaws.com:3000/v1';
const API_KEY = '8d3c6697-0ba1-42d4-b5c7-6727c04adce7';
const getSingleCheckIn = async (slug) => {
  // return axios.get(`${baseUrl}/checkin/${slug}`);
  return axios({
    method: 'get',
    url: `${baseUrl}/checkin/${slug}`,
    headers: { authorization: API_KEY },
  });
};

export const useSingleCheckIn = (slug) => {
  return useQuery({
    queryKey: ['singleCheckInData', slug],
    queryFn: () => getSingleCheckIn(slug),
  });
};
