import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
const API_KEY = '8d3c6697-0ba1-42d4-b5c7-6727c04adce7';

let baseUrl = `http://ec2-44-198-54-124.compute-1.amazonaws.com:3000/v1`;

const getUserInfo = async (walletAddress) => {
  return axios.get(`${baseUrl}/users/`, {
    params: { wallet_address: walletAddress }, // users
    headers: { authorization: API_KEY },
  });
};

export const useGetUserInfo = (walletAddress) => {
  return useQuery({
    queryKey: ['userInfo', walletAddress],
    queryFn: () => getUserInfo(walletAddress),
    staleTime: Infinity,
  });
};
