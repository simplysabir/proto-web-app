import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import {
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Image as ChakraImage,
  Spinner,
  SkeletonCircle,
  SkeletonText,
  Skeleton,
} from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { DiscordLogo, InstagramLogo, TwitterLogo } from '../dynamic/Profile';
import axios from 'axios';
import Options from '../components/Options';
import { create } from 'ipfs-http-client';

import SEOtag from '../components/SEOtag';
import { useGetUserInfo } from '../utils/userInfo';
import { OrbisContext } from '../context/OrbisContext';

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;

const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

let baseUrl = 'http://ec2-44-198-54-124.compute-1.amazonaws.com:3000/v1';
const API_KEY = '8d3c6697-0ba1-42d4-b5c7-6727c04adce7';
export default function Profile() {
  const wallet = useWallet();
  const [userName, setUserName] = useState<string>(null);
  const [profilePic, setProfilePic] = useState<any>(null);
  const [editingUserName, setEditingUserName] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>(null);
  const [newProfilePic, setNewProfilePic] = useState<any>(null);
  const [user, setUser] = useState<string>(null);
  const [_id, set_id] = useState<string>(null);

  const { orbis } = useContext(OrbisContext);

  const { data, status, error } = useGetUserInfo(wallet.publicKey);

  useEffect(() => {
    if (status === 'success') {
      set_id(data.data[0]?._id);
      setUserName(data.data[0]?.name);
      setProfilePic(data.data[0]?.profile_picture);
    }
  }, [data, status, error]);

  const handleImageUpload = async (e: any) => {
    try {
      const file = e.target.files[0];
      console.log(file);
      const added = await client.add(file);
      console.log(added);
      if (await added) {
        setNewProfilePic({ filename: file.name, hash: added.path });
        console.log(newProfilePic);
      }

      if (newProfilePic) {
        const orbisImageUploadResponse = await orbis.updateProfile({
          username: userName,
          pfp: `https://ipfs.io/ipfs/${newProfilePic?.hash}`,
        });
        console.log(orbisImageUploadResponse);
        const imageUploadResponse = await axios.patch(
          `${baseUrl}/users/${_id}`,
          {
            profile_picture: {
              hash: newProfilePic.hash,
              filename: newProfilePic.filename,
            },
          }
        );
        console.log(imageUploadResponse);
        if (imageUploadResponse.status === 200) setProfilePic(newProfilePic);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeUserName = (e) => {
    setNewUserName(e.target.value);
    setEditingUserName(true);
  };

  const handleSaveUserName = () => {
    setUserName(newUserName);
    setEditingUserName(false);
    const updateOrbisUserName = async () => {
      try {
        await orbis.updateProfile({
          username: newUserName,
          pfp: profilePic,
        });
      } catch (e) {
        console.log(e);
      }
    };
    const updateUserName = async () => {
      try {
        const res = await axios.patch(
          `http://ec2-44-198-54-124.compute-1.amazonaws.com:3000/users/${_id}`,
          {
            name: newUserName,
          }
        );
      } catch (e) {
        console.log(e);
      }
    };
    updateUserName();
    updateOrbisUserName();
  };

  return (
    <>
      <SEOtag title="Profile | Proto" />
      <div>
        <div className=" mx-auto h-[calc(100vh-200px)] max-w-[600px] align-middle">
          <div className="p-6">
            {status == 'loading' ? (
              <>
                <SkeletonCircle
                  size="8rem"
                  startColor="gray.100"
                  endColor="gray.300"
                  mx="auto"
                />
                <Skeleton
                  width="40%"
                  h="24px"
                  maxW="800px"
                  mx="auto"
                  mt={14}
                  // spacing="4"
                  startColor="gray.100"
                  endColor="gray.300"
                />
              </>
            ) : (
              <>
                <label className="relative">
                  <ChakraImage
                    src={
                      profilePic
                        ? `https://ipfs.io/ipfs/${profilePic?.hash}`
                        : '/profileplaceholder.svg'
                    }
                    alt="/"
                    objectFit="cover"
                    className="mx-auto h-32 w-32 cursor-pointer rounded-full border border-[#b6b8b9] object-cover"
                  />
                  <p className="mt-1 cursor-pointer text-center text-xs font-medium text-[#AEB4B7]">
                    {!profilePic ? 'Add a pic' : 'Change'}
                  </p>
                  <input
                    type="file"
                    className="absolute top-0 left-0 z-0 m-auto h-36 w-32 cursor-pointer opacity-0"
                    // onChange={onImageUpload}
                    onChange={(e) => handleImageUpload(e)}
                  />
                </label>
                <div className="mt-6 flex items-center">
                  {/* <p className='font-medium'>Username</p> */}
                  {!userName ? (
                    <FormControl>
                      <FormLabel
                        fontSize="sm"
                        mb="-0.5px"
                        color="gray.500"
                        fontWeight={400}
                      >
                        Username
                      </FormLabel>
                      <InputGroup>
                        <Input
                          placeholder="Set a username..."
                          borderColor="#E2E8F0"
                          type="text"
                          onChange={handleChangeUserName}
                        />
                        <InputRightElement w="4.5rem">
                          {editingUserName &&
                          newUserName.length !== 0 &&
                          userName !== newUserName ? (
                            <Center>
                              <Button
                                h="32px"
                                mr="4px"
                                colorScheme="telegram"
                                bg="primary"
                                color="#fff"
                                onClick={handleSaveUserName}
                              >
                                Save
                              </Button>
                            </Center>
                          ) : null}
                        </InputRightElement>
                      </InputGroup>
                      <FormHelperText color="gray.400">
                        *You can only set your username once
                      </FormHelperText>
                    </FormControl>
                  ) : (
                    <p className="mx-auto text-center text-2xl font-medium text-gray-700">
                      {userName}
                    </p>
                  )}
                </div>
              </>
            )}

            <Options />
          </div>

          <div className="mx-auto flex w-1/3 items-center justify-around pb-24">
            <DiscordLogo />
            <TwitterLogo />
            <InstagramLogo />
          </div>
        </div>
      </div>
    </>
  );
}
