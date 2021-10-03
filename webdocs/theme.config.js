export default {
  github: 'https://github.com/butthx/tgsnake', // GitHub link in the navbar
  docsRepositoryBase: 'https://github.com/butthx/tgsnake/blob/dev/webdocs', // base URL for the docs repository
  titleSuffix: ' | tgsnake',
  nextLinks: true,
  prevLinks: true,
  search: true,
  customSearch: null, // customizable, you can use algolia for example
  darkMode: true,
  footer: true,
  footerText: `MIT ${new Date().getFullYear()} © butthx.`,
  footerEditLink: `Edit this page on GitHub`,
  logo: (
    <span className="font-extrabold text-lg">Tgsnake</span>
  ),
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
    </>
  ),
  i18n: [
    { locale: 'en', text: 'English' },
  ],
  unstable_staticImage: true
}