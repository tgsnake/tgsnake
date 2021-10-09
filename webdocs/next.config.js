const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  mdxOptions : {
    remarkPlugins : []
  }
})
module.exports = withNextra({
  i18n: {
    locales: ['en','id'],
    defaultLocale: 'en',
  }
})