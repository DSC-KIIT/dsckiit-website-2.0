import { waitFor, render, cleanup } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { api, logger, testUtils } from '../../utils';

import Questions from '@/playground/components/allQuestions';

import { getSessionAuthToken } from '@/lib/user/session';
jest.mock('@/lib/user/session');

const qids = {
	q1: 0,
	q2: 0,
	q3: 0,
	q4: 0,
};

describe('when user is not logged in', () => {
	beforeAll(async () => {
		qids.q1 = await api.createData('http://localhost:9000/quizzes', testUtils.question1);
	});

	afterAll(async () => {
		await api.deleteData('http://localhost:9000/quizzes', qids.q1);
		cleanup();
	});

	it('shows not logged', () => {
		const { getByTestId } = render(<Questions />);
		expect(getByTestId('loader')).toBeInTheDocument();

		waitFor(() => {
			expect(getByTestId('not-loggedin')).toBeInTheDocument();
		});
	});

	it('no question is available', () => {
		const { getByTestId } = render(<Questions />);
		waitFor(() => {
			expect(getByTestId('not-loggedin')).toBeInTheDocument();
			expect(getByTestId(`question-${qids.q1}`)).toBeInTheDocument();
		});
	});
});

describe('when user is logged in', () => {
	const testUser = { token: '' };
	beforeAll(async () => {
		[qids.q1, qids.q2, qids.q3] = await Promise.all([
			api.createData('http://localhost:9000/quizzes', testUtils.question1),
			api.createData('http://localhost:9000/quizzes', testUtils.question2),
			api.createData('http://localhost:9000/quizzes', testUtils.question3),
		]);
		testUser.token = await api.loginUser();
		mocked(getSessionAuthToken).mockResolvedValue(testUser.token);
	});

	afterAll(async () => {
		await Promise.all([
			api.deleteData('http://localhost:9000/quizzes', qids.q1),
			api.deleteData('http://localhost:9000/quizzes', qids.q2),
			api.deleteData('http://localhost:9000/quizzes', qids.q3),
		]);
		cleanup();
	});

	it('questions are available to the user', () => {
		const { getByTestId } = render(<Questions />);
		waitFor(() => {
			expect(getByTestId(`question-${qids.q2}`)).toBeInTheDocument();
		});
	});

	it('the three questions are available', () => {
		const { getByTestId } = render(<Questions />);
		waitFor(() => {
			expect(getByTestId(`question-${qids.q1}`)).toBeInTheDocument();
			expect(getByTestId(`question-${qids.q2}`)).toBeInTheDocument();
			expect(getByTestId(`question-${qids.q3}`)).toBeInTheDocument();
		});
		logger(
			'info',
			'ignore the overlapping act calls warning',
			'all the elements which are to be tested are present in the dom'
		);
	});
});
