// react-native-html-to-pdf.d.ts
declare module 'react-native-html-to-pdf' {
  interface Options {
    html: string;
    fileName?: string;
    directory?: string;
    base64?: boolean;
  }

  interface PDFResponse {
    filePath?: string;
    base64?: string;
    uri?: string;
  }

  export default function RNHTMLtoPDF(options: Options): Promise<PDFResponse>;
}
