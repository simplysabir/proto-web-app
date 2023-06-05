import axios from 'axios';
import { CheckInTransaction } from './checkInTransaction';

// let baseUrl = 'https://proto-api.onrender.com';
let baseUrl = 'http://ec2-44-198-54-124.compute-1.amazonaws.com:3000/v1';
const API_KEY = '8d3c6697-0ba1-42d4-b5c7-6727c04adce7';

export async function handleCheckInSubmit(
  e: any,
  wallet,
  setcheckIn,
  setLoading,
  setSuccess,
  checkInMessage,
  files,
  selectedTag,
  orbisTag,
  orbisFiles,
  orbis,
  setPdl,
  checkInSignature,
  setCheckInSignature,
  lat,
  lng
) {
  e.preventDefault();
  setSuccess();
  try {
    setLoading(true);
    if (!wallet.publicKey) {
      alert('Wallet Not Connected');
      setLoading(false);
      return;
    }

    const usersResponse = await axios({
      method: 'get',
      url: `${baseUrl}/users/:userId`, // users
      params: { wallet_address: wallet.publicKey.toString() },
      headers: { authorization: API_KEY },
    });

    if (usersResponse.data.length) {
      const orbisCheckinResponse = await orbis.createPost({
        body: checkInMessage,
        data: {
          latitude: lat,
          longitude: lng,
        },
        tags: orbisTag,
        files: orbisFiles,
      });
      console.log(orbisCheckinResponse);

      // url: `${baseUrl}/checkins`,
      const checkinResponse = await axios({
        method: 'post',
        url: `${baseUrl}/checkin/`,
        data: {
          user_wallet_address: wallet.publicKey.toString(),
          message: checkInMessage,
          latitude: lat,
          longitude: lng,
          ...(files && { files }),
          tag: selectedTag,
        },
        headers: { authorization: API_KEY },
      });
      console.log(checkinResponse);
      if (checkinResponse.data) {
        await CheckInTransaction(
          checkinResponse.data._id,
          lat,
          lng,
          checkInMessage,
          setPdl,
          setcheckIn,
          checkInSignature,
          setCheckInSignature
        );
        setcheckIn(checkinResponse);
        setLoading(false);
        setSuccess(true);
      }
    } else {
      await axios({
        method: 'post',
        url: `${baseUrl}/users/:userId`,
        data: {
          wallet_address: wallet.publicKey.toString(),
        },
        headers: { authorization: API_KEY },
      });
      const orbisCheckinResponse = await orbis.createPost({
        body: checkInMessage,
        data: {
          latitude: lat,
          longitude: lng,
        },
        tags: orbisTag,
        files: orbisFiles,
      });
      console.log(orbisCheckinResponse);

      // url: `${baseUrl}/checkins`,
      const checkinResponse = await axios({
        method: 'post',
        url: `${baseUrl}/checkin/`,
        data: {
          user_wallet_address: wallet.publicKey.toString(),
          message: checkInMessage,
          latitude: lat,
          longitude: lng,
          ...(files && { files }),
          tag: selectedTag,
        },
        headers: { authorization: API_KEY },
      });
      await CheckInTransaction(
        checkinResponse.data._id,
        lat,
        lng,
        checkInMessage,
        setPdl,
        setcheckIn,
        setCheckInSignature,
        checkInSignature
      );
      setcheckIn(checkinResponse.data);
      setLoading(false);
      setSuccess(true);
    }
  } catch (error) {
    console.log(error);
    setLoading(false);
    setSuccess(false);
  }
}
