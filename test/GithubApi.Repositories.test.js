const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

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

      const responseRepos = await agent.get(responseUsers.body.repos_url)
        .set('User-Agent', 'agent');

      const found = responseRepos.body.find((repo) => repo.name === 'jasmine-awesome-report');
      expect(found.name).to.equal('jasmine-awesome-report');
      expect(found.private).to.equal(false);
      expect(found.description).to.equal('An awesome html report for Jasmine');
    });

    it('Download a zip file with the repo', async () => {
      const responseUsers = await agent.get(`${urlBase}/users/${githubUserName}`)
        .set('User-Agent', 'agent');

      const responseRepos = await agent.get(responseUsers.body.repos_url)
        .set('User-Agent', 'agent');

      const found = responseRepos.body.find((repo) => repo.name === 'jasmine-awesome-report');

      function download(url, dest, cb) {
        const file = fs.createWriteStream(dest);
        const request = https.get(url, (response) => {
          response.pipe(file);
          file.on('finish', () => {
            file.close(cb); // close() is async, call cb after close completes.
          });
        }).on('error', (err) => { // Handle errors
          fs.unlink(dest); // Delete the file async. (But we don't check the result)
          if (cb) cb(err.message);
        });
      }
      const dest = './jasmine-awesome-report.zip';
      const url = 'https://api.github.com/repos/aperdomob/jasmine-awesome-report/zipball/master';

      download(url, dest, () => {
        console.log('Done');
      });
    });
  });
});
