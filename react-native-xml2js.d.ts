// app/react-native-xml2js.d.ts

declare module 'react-native-xml2js' {
    import { Parser } from 'xml2js';
  
    export function parseString(
      str: string,
      callback: (err: Error | null, result: any) => void
    ): void;
  
    export class Parser {
      parseString(
        str: string,
        callback: (err: Error | null, result: any) => void
      ): void;
    }
  }
  