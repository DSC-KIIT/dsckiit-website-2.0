import request from 'supertest';

import { setUpServer, tearDownServer } from './lib';

// beforeAll and afterAll need to return a Promise or call done for a callback

describe('[STRAPI]', () => {
	describe('WHEN SERVER IS RUNNING', () => {
		beforeAll(() => {
			return setUpServer(); // returning a promise
		}, 15_000);

		afterAll((done) => {
			tearDownServer();
			done(); // explicitly use done because the above is a callback and not just a inline/linear function like inside it
		});

		it('strapi is defined', (done) => {
			expect(strapi).toBeDefined();
			done();
		});

		it('server responds', (done) => {
			request((strapi as any).server)
				.get('/_health')
				.end((err, res) => {
					expect(err).toBeNull();
					expect(res.status).toEqual(204);
					done();
				});
		});
	});
});
