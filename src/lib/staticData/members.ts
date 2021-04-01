import axios, { AxiosError } from 'axios';

import { staticBackendUrls } from '@/lib/urls';
import type { MemberDataType, GroupedMemberType } from '@/types/index';

export default function fetchMembersGrouped(): Promise<GroupedMemberType> {
	return axios
		.get(staticBackendUrls['members'])
		.then((response) => response.data)
		.then((data: Array<MemberDataType>) => groupMembersByDomain(data))
		.catch((err: AxiosError) => {
			console.log('Error fetching members', err.name, '\n', err.message);
			return {};
		});
}

function groupMembersByDomain(members: Array<MemberDataType>): GroupedMemberType {
	return members.reduce((groupedObj, mem) => {
		groupedObj[mem['domain']] = [...(groupedObj[mem['domain']] || []), mem];
		return groupedObj;
	}, {});
}
