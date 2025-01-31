export default {
  branches: [
    'main',
    {name: 'staging', prerelease: true, channel: 'next'}
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
      tarballDir: 'dist'
    }],
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md', 'package.json'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }],
    ['@semantic-release/github', {
      assets: 'dist/*.tgz'
    }]
  ]
}
