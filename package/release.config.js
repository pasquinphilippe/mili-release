module.exports = {
  branches: [
    'main',
    {name: 'staging', prerelease: true}
  ],
  plugins: [
    ['@semantic-release/commit-analyzer', {
      preset: 'angular',
      releaseRules: [
        {type: 'feat', release: 'minor'},
        {type: 'fix', release: 'patch'},
        {type: 'chore', release: 'patch'},
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
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md', 'package.json'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }],
    ['@semantic-release/exec', {
      prepareCmd: 'echo ${nextRelease.version} > version.txt',
      publishCmd: 'shopify theme push -t ${nextRelease.version}'
    }],
    ['@semantic-release/github', {
      assets: [
        {path: 'version.txt', label: 'Theme Version'},
        {path: 'CHANGELOG.md', label: 'Changelog'}
      ]
    }]
  ]
}
