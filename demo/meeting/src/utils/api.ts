// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import routes from '../constants/routes';

export const BASE_URL = routes.HOME;

export const BASE_URL_MAIN_ROOM =
  'https://life.boosttecnologia.com/gateway/teleatendimento/mainRoom/v1';
export const BASE_URL_ACCESS_ROOM =
  'https://life.boosttecnologia.com/gateway/teleatendimento/accessRoom/v1';

// interface MeetingResponse {
//   JoinInfo: {
//     attendee: { externalUserId: string; attendeeId: string; joinToken: string };
//     meeting: {
//       meetingId: string;
//       mediaPlacement: {
//         audioHostUrl: string;
//         screenDataUrl: string;
//         screenSharingUrl: string;
//         screenViewingUrl: string;
//         signalingUrl: string;
//         turnControlUrl: string;
//       };
//     };
//   };
// }

interface MeetingResponse {
  attendee: any;
  meeting: any;
}

export async function fetchMeeting(
  meetingId: string,
  name: string,
  region: string
): Promise<MeetingResponse> {
  //   const requestOptions = {

  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ meetingId:meetingId, name:name }),
  //     mode: 'cors',
  //     redirect: 'follow'
  // };

  const response = await fetch(
    `${BASE_URL_MAIN_ROOM}  
    `,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientRequestToken: meetingId,
        ExternalUserId: name
      }),
      mode: 'cors',
      redirect: 'follow'
    }
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(`Server error: ${data.error}`);
    console.log('Erro de dados vindo do fetch');
  } else {
    console.log('data Fetch!');
    console.log(data);

    const dataAttendee = data.attendee.attendeeId;
    const datameeting = data.meeting;

    console.log('dataAttendee');
    console.log(dataAttendee);
    console.log('datameeting');
    console.log(datameeting);
  }

  return data;
}
//POST  URL_GATEWAY/teleatendimento/accessRoom/v1
export function createGetAttendeeCallback(meetingId: string) {
  return async (chimeAttendeeId: string, externalUserId?: string) => {
    const attendeeUrl = `${BASE_URL}attendee?title=${encodeURIComponent(
      meetingId
    )}&attendee=${encodeURIComponent(chimeAttendeeId)}`;
    const res = await fetch(attendeeUrl, {
      method: 'POST'
    });

    console.log('createGetAttendeeCallback');
    if (!res.ok) {
      throw new Error('Invalid server response');
    }

    const data = await res.json();

    return {
      name: data.AttendeeInfo.Name
    };
  };
}

export async function endMeeting(meetingId: string) {
  const res = await fetch(
    `${BASE_URL}end?title=${encodeURIComponent(meetingId)}`,
    {
      method: 'POST'
    }
  );

  if (!res.ok) {
    throw new Error('Server error ending meeting');
  }
}

// ${
//   region ? `&region=${encodeURIComponent(region)}` : ''
// }

// &clientRequestToken=${encodeURIComponent(
//   meetingId
// )}&ExternalUserId=${encodeURIComponent(name)}
