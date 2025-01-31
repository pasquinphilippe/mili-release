module.exports = {
  branches: [
    {
      name: 'main',
      channel: 'latest',
      prerelease: false
    },
    {
      name: 'staging',
      channel: 'next',
      prerelease: true
    }
  ],
  plugins: [
    ['@semantic-release/commit-analyzer', {
      preset: 'angular',
      releaseRules: [
        {type: 'feat', release: 'minor'},
        {type: 'fix', release: 'patch'},
        {type: 'docs', release: 'patch'},
        {type: 'style', release: 'patch'},
        {type: 'refactor', release: 'patch'},
        {type: 'perf', release: 'patch'},
        {type: 'test', release: 'patch'}
      ]
    }],
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', {
      changelogFile: 'CHANGELOG.md'
    }],
    ['@semantic-release/npm', {
      npmPublish: true,
      pkgRoot: '.',
      tarballDir: 'dist',
      distTag: process.env.BRANCH === 'staging' ? 'next' : 'latest'
    }],
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md', 'package.json'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }],
    ['@semantic-release/github', {
      assets: [
        {path: 'dist/*.tgz', label: 'NPM package'},
        {path: 'CHANGELOG.md', label: 'Changelog'}
      ],
      failComment: `🚨 Release failed due to invalid branch. Please ensure you're merging into 'staging' first.`,
      successComment: `
🎉 This PR is included in version \${nextRelease.version}

The release is available on:
- [npm package (@\${process.env.BRANCH === 'staging' ? 'next' : 'latest'} dist-tag)](https://www.npmjs.com/package/@milistack/theme-cli/v/\${nextRelease.version})
- [GitHub release](https://github.com/pasquinphilippe/mili-release/releases/tag/v\${nextRelease.version})

Your **[semantic-release]** bot :package::rocket:`
    }]
  ]
};
