const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('First Api Tests', () => {
  const urlAPI = 'https://httpbin.org';

  it('Consume GET Service', async () => {
    const response = await agent.get(`${urlAPI}/ip`);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('origin');
  });


  it('Consume GET Service with query parameters', async () => {
    const requestBody = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await agent.get(`${urlAPI}/get`).query(requestBody);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.args).to.eql(requestBody);
  });


  it('HEAD request', async () => {
    const response = await agent.head(`${urlAPI}/get`);

    expect(response.status).to.equal(statusCode.OK);
  });


  it('PUT request', async () => {
    const requestBody = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await agent.put(`${urlAPI}/put`).query(requestBody);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.args).to.eql(requestBody);
  });


  it('DELETE request', async () => {
    const response = await agent.delete(`${urlAPI}/delete`);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('origin');
  });


  it('PATCH request', async () => {
    const requestBody = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await agent.patch(`${urlAPI}/patch`).query(requestBody);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.args).to.eql(requestBody);
  });
});
