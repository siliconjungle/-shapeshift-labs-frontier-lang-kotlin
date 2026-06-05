import type {
  KotlinPsiNativeImporterAdapterOptions,
  NativeImporterAdapter,
  NativeImporterAdapterImportResult,
  SemanticImportSidecar,
  SemanticImportSidecarOptions
} from '@shapeshift-labs/frontier-lang-compiler';

export declare const KotlinSourceLanguage: 'kotlin';
export declare const KotlinParser: 'kotlin-psi';
export declare const KotlinParserAstFormat: 'kotlin-psi';
export declare const KotlinSupportedExtensions: readonly string[];

export interface KotlinLanguagePackageMetadata {
  readonly packageName: '@shapeshift-labs/frontier-lang-kotlin';
  readonly version: '0.1.0';
  readonly sourceLanguage: 'kotlin';
  readonly parser: 'kotlin-psi';
  readonly parserAstFormat: 'kotlin-psi';
  readonly supportedExtensions: readonly string[];
  readonly compilerPackage: '@shapeshift-labs/frontier-lang-compiler';
  readonly compilerVersion: '0.2.33';
}

export declare const KotlinLanguagePackage: KotlinLanguagePackageMetadata;

export { createKotlinPsiNativeImporterAdapter } from '@shapeshift-labs/frontier-lang-compiler';

export interface KotlinSourceImportInput {
  readonly sourceText?: string;
  readonly sourcePath?: string;
  readonly sourceHash?: string;
  readonly language?: string;
  readonly parser?: string;
  readonly parserVersion?: string;
  readonly adapter?: NativeImporterAdapter;
  readonly importerOptions?: KotlinPsiNativeImporterAdapterOptions;
  readonly adapterOptions?: Record<string, unknown>;
  readonly adapterMetadata?: Record<string, unknown>;
  readonly evidence?: readonly unknown[];
  readonly metadata?: Record<string, unknown>;
  readonly ast?: unknown;
  readonly nativeAst?: unknown;
  readonly ktFile?: unknown;
  readonly file?: unknown;
  readonly sourceFile?: unknown;
  readonly root?: unknown;
}

export interface KotlinSourceImportOptions {
  readonly language?: string;
  readonly parser?: string;
  readonly parserVersion?: string;
  readonly importerOptions?: KotlinPsiNativeImporterAdapterOptions;
  readonly adapterOptions?: Record<string, unknown>;
  readonly adapterMetadata?: Record<string, unknown>;
}

export interface KotlinSemanticImportSidecarOptions extends KotlinSourceImportOptions {
  readonly sidecarOptions?: SemanticImportSidecarOptions;
  readonly id?: string;
  readonly generatedAt?: number;
  readonly regionPrefix?: string;
}

export declare function createKotlinNativeImporterAdapter(options?: KotlinPsiNativeImporterAdapterOptions): NativeImporterAdapter;
export declare function importKotlinSource(input?: KotlinSourceImportInput, options?: KotlinSourceImportOptions): Promise<NativeImporterAdapterImportResult>;
export declare function createKotlinSemanticImportSidecar(input?: KotlinSourceImportInput, options?: KotlinSemanticImportSidecarOptions): Promise<SemanticImportSidecar>;
