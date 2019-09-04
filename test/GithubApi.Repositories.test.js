const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');
const fs = require('fs');
const assert = require('assert');


const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';


describe('Github Api Test User', () => {
  describe('Get method test', () => {
    it('Validate user, company, location', async () => {
      const response = await agent.get(`${urlBase}/users/${githubUserName}`)
        .set('User-Agent', 'agent');
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.name).equal('Alejandro Perdomo');
      expect(response.body.company).equal('PSL');
      expect(response.body.location).equal('Colombia');
    });

    it('Find repos url and repo named asmine-awesome-report ', async () => {
      const responseUsers = await agent.get(`${urlBase}/users/${githubUserName}`)
        .set('User-Agent', 'agent');

      const responseRepos = await agent.get(`${responseUsers.body.repos_url}`)
        .set('User-Agent', 'agent');

      const found = responseRepos.body.find((repo) => repo.name === 'jasmine-awesome-report');

      assert(found !== null);
      assert(found !== undefined);

      expect(found.name).to.equal('jasmine-awesome-report');
      expect(found.private).to.equal(false);
      expect(found.description).to.equal('An awesome html report for Jasmine');
    });

    it('Download a zip file with the repo and check that exists', async () => {
      const repoName = 'jasmine-awesome-report';
      const href = `https://github.com/aperdomob/${repoName}/archive`;
      const zipFile = 'master.zip';
      const source = `${href}/${zipFile}`;

      agent
        .get(source)
        .pipe(fs.createWriteStream(zipFile));

      expect(fs.existsSync(zipFile)).to.equal(true);
    });
  });
});
