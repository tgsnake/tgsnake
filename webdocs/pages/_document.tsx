import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="id">
        <Head>
        </Head>
        <body className="leading-6 antialiased text-black bg-white font-poppins dark:bg-gray-900 dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
