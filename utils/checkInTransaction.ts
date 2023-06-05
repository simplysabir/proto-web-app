import {
  clusterApiUrl,
  ConfirmOptions,
  Connection,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';

import { utils, Program, AnchorProvider } from '@project-serum/anchor';

import { latLngToCell } from 'h3-js';
import axios from 'axios';

const opts: ConfirmOptions = {
  preflightCommitment: 'processed',
};

// let baseUrl = 'https://proto-api.onrender.com';
let baseUrl = 'http://ec2-44-198-54-124.compute-1.amazonaws.com:3000/v1';
const API_KEY = '8d3c6697-0ba1-42d4-b5c7-6727c04adce7';

const network =
  'https://solana-devnet.g.alchemy.com/v2/6nOSXYNw7tWYjDzvQ2oLBVBfMg6Gj9Ho';

const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  let provider;
  if (window.solana) {
    provider = new AnchorProvider(connection, window.solana, opts);
  } else if (window.solflare) {
    provider = new AnchorProvider(connection, window.solflare, opts);
  } else if (window.backpack) {
    provider = new AnchorProvider(connection, window.backpack, opts);
  }
  return provider;
};

const getProgram = async () => {
  const provider = getProvider();
  // Get metadata about your solana program
  const idl = await Program.fetchIdl(
    process.env.NEXT_PUBLIC_PROGRAM_ID,
    provider
  );
  // Create a program that you can call
  return new Program(idl, process.env.NEXT_PUBLIC_PROGRAM_ID, provider);
};

export async function CheckInTransaction(
  mongoId: string,
  lat,
  lng,
  checkInMessage,
  setPdl,
  setcheckIn,
  setCheckInSignature,
  checkInSignature
) {
  const provider = getProvider();
  const hindex = latLngToCell(lat, lng, 7);

  const program = await getProgram();

  console.log(provider);

  const [checkInPDA, _] = PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode('check-in-data'),
      provider.wallet.publicKey.toBuffer(),
      Buffer.from(mongoId),
      Buffer.from(hindex),
    ],
    program.programId
  );

  try {
    const sig = await program.methods
      .checkIn(hindex, mongoId, checkInMessage)
      .accounts({
        user: provider.wallet.publicKey,
        checkIn: checkInPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log(sig);
    // save generated pdl for this checkin
    // setCheckInSignature(sig);

    //url: `${baseUrl}/checkins/${mongoId}/pdls`

    const checkinPdlResponse = await axios({
      method: 'post',
      url: `${baseUrl}/checkin/${mongoId}/pdls`,
      data: {
        pdl: checkInPDA,
        signature: sig,
      },
      headers: { authorization: API_KEY },
    });
    setPdl(checkInPDA.toString());
    setcheckIn(checkinPdlResponse.data);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
