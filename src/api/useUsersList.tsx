import { useQuery, UseQueryResult } from 'react-query';

import { apiClient } from './api-client';

export type User = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street: string;
  state: string;
  country: string;
  longitude: number;
  id: number;
  gender: string;
  date_of_birth: string;
  job: string;
  city: string;
  zipcode: string;
  latitude: number;
  profile_picture: string;
};

type UsersListResponse = {
  success: boolean;
  time: string;
  message: string;
  total_users: number;
  offset: number;
  limit: number;
  users: User[];
};

const apiURL =
  'https://api.slingacademy.com/v1/sample-data/users?offset=10&limit=10';

function getUsers() {
  return apiClient.get<UsersListResponse>({
    url: apiURL,
  });
}

export function useUsersList(): UseQueryResult<UsersListResponse, Error> {
  return useQuery({
    enabled: true,
    queryFn: () => getUsers(),
    queryKey: ['users'],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
