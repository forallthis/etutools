import JSONFormatterTool from './developer/json-formatter.js';
import RegexTesterTool from './developer/regex-tester.js';
import HashCalculatorTool from './developer/hash-calculator.js';
import ColorConverterTool from './developer/color-converter.js';
import JWTDecoderTool from './developer/jwt-decoder.js';
import JWTGeneratorTool from './developer/jwt-generator-tool.js';
import CronParserTool from './developer/cron-parser.js';
import BinaryConverterTool from './developer/binary-converter-tool.js';
import JSONDiffTool from './developer/json-diff-tool.js';
import SQLFormatterTool from './developer/sql-formatter-tool.js';
import XMLFormatterTool from './developer/xml-formatter-tool.js';
import YAMLConverterTool from './developer/yaml-converter-tool.js';
import ColorPickerTool from './developer/color-picker-tool.js';
import CronBuilderTool from './developer/cron-builder-tool.js';
import Base64Tool from './text/base64-tool.js';
import CaseConverterTool from './text/case-converter-tool.js';
import TextDedupTool from './text/text-dedup-tool.js';
import LineCounterTool from './text/line-counter-tool.js';
import CharacterFrequencyTool from './text/character-frequency-tool.js';
import HTMLEntitiesTool from './text/html-entities-tool.js';
import CSVToJSONTool from './text/csv-to-json-tool.js';
import MarkdownPreviewTool from './text/markdown-preview-tool.js';
import TextDiffTool from './text/text-diff-tool.js';
import NumberToChineseTool from './text/number-to-chinese-tool.js';
import URLTool from './text/url-tool.ts';
import LoremIpsumTool from './text/lorem-ipsum-tool.js';
import TimestampTool from './time/timestamp-tool.js';
import BatchTimestampTool from './time/batch-timestamp-tool.js';
import QRCodeTool from './image/qrcode-tool.js';
import QRCodeReaderTool from './image/qrcode-reader-tool.js';
import ImageBase64Tool from './image/image-base64-tool.js';
import PasswordGeneratorTool from './utilities/password-generator-tool.js';
import UUIDGeneratorTool from './utilities/uuid-generator-tool.js';
import IPConverterTool from './utilities/ip-converter-tool.js';
import MIMELookupTool from './utilities/mime-lookup-tool.js';
import UserAgentParserTool from './utilities/user-agent-parser-tool.js';
import URLParserTool from './utilities/url-parser-tool.js';
import AESTool from './encryption/aes-tool.js';

export const tools = [
  JSONFormatterTool,
  RegexTesterTool,
  HashCalculatorTool,
  ColorConverterTool,
  JWTDecoderTool,
  JWTGeneratorTool,
  CronParserTool,
  BinaryConverterTool,
  JSONDiffTool,
  SQLFormatterTool,
  XMLFormatterTool,
  YAMLConverterTool,
  ColorPickerTool,
  CronBuilderTool,
  Base64Tool,
  CaseConverterTool,
  TextDedupTool,
  LineCounterTool,
  CharacterFrequencyTool,
  HTMLEntitiesTool,
  CSVToJSONTool,
  MarkdownPreviewTool,
  TextDiffTool,
  NumberToChineseTool,
  URLTool,
  LoremIpsumTool,
  TimestampTool,
  BatchTimestampTool,
  QRCodeTool,
  QRCodeReaderTool,
  ImageBase64Tool,
  PasswordGeneratorTool,
  UUIDGeneratorTool,
  IPConverterTool,
  MIMELookupTool,
  UserAgentParserTool,
  URLParserTool,
  AESTool
];

export function getAllTools() {
  return tools;
}

export function getToolById(id: string) {
  return tools.find(tool => tool.id === id);
}
