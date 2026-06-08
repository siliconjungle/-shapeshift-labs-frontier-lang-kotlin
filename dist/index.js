import {
  NativeImportLanguageProfiles,
  createKotlinPsiNativeImporterAdapter,
  createSemanticImportSidecar,
  createUniversalCapabilityMatrix,
  runNativeImporterAdapter
} from '@shapeshift-labs/frontier-lang-compiler';

export const KotlinSourceLanguage = 'kotlin';
export const KotlinParser = 'kotlin-psi';
export const KotlinParserAstFormat = 'kotlin-psi';
export const KotlinSupportedExtensions = Object.freeze(['.kt', '.kts']);

export const KotlinLanguagePackage = Object.freeze({
  packageName: '@shapeshift-labs/frontier-lang-kotlin',
  version: '0.1.10',
  sourceLanguage: KotlinSourceLanguage,
  parser: KotlinParser,
  parserAstFormat: KotlinParserAstFormat,
  supportedExtensions: KotlinSupportedExtensions,
  compilerPackage: '@shapeshift-labs/frontier-lang-compiler',
  compilerVersion: '0.2.68'
});

export const KotlinCapabilityLanguageProfiles = Object.freeze(
  NativeImportLanguageProfiles.filter((profile) => profile.language === KotlinSourceLanguage)
);

export { createKotlinPsiNativeImporterAdapter } from '@shapeshift-labs/frontier-lang-compiler';

export function createKotlinNativeImporterAdapter(options = {}) {
  return createKotlinPsiNativeImporterAdapter(options);
}

export function createKotlinLanguageCapabilityMatrix(options = {}) {
  const languages = options.languages ?? KotlinCapabilityLanguageProfiles;
  const adapters = options.adapters ?? [createKotlinNativeImporterAdapter(options.importerOptions ?? {})];
  return createUniversalCapabilityMatrix({ ...options, languages, adapters });
}

function mergeAdapterOptions(input = {}, options = {}) {
  const adapterOptions = {
    ...(options.adapterOptions ?? {}),
    ...(input.adapterOptions ?? {})
  };
  for (const alias of ['ast', 'nativeAst', 'ktFile', 'file', 'sourceFile', 'root']) {
    if (Object.prototype.hasOwnProperty.call(input, alias)) {
      adapterOptions[alias] = input[alias];
    }
  }
  return adapterOptions;
}

function pickSidecarOptions(options = {}) {
  if (options.sidecarOptions) {
    return options.sidecarOptions;
  }
  const picked = {};
  for (const key of ['id', 'generatedAt', 'regionPrefix']) {
    if (Object.prototype.hasOwnProperty.call(options, key)) {
      picked[key] = options[key];
    }
  }
  return picked;
}

export async function importKotlinSource(input = {}, options = {}) {
  const importerOptions = {
    ...(options.importerOptions ?? {}),
    ...(input.importerOptions ?? {})
  };
  const adapter = input.adapter ?? createKotlinNativeImporterAdapter(importerOptions);
  return runNativeImporterAdapter(adapter, {
    sourceText: input.sourceText ?? '',
    sourcePath: input.sourcePath,
    sourceHash: input.sourceHash,
    language: input.language ?? options.language ?? KotlinSourceLanguage,
    parser: input.parser ?? options.parser ?? KotlinParser,
    parserVersion: input.parserVersion ?? options.parserVersion,
    adapterOptions: mergeAdapterOptions(input, options),
    adapterMetadata: {
      packageName: KotlinLanguagePackage.packageName,
      ...(options.adapterMetadata ?? {}),
      ...(input.adapterMetadata ?? {})
    },
    evidence: input.evidence,
    metadata: input.metadata
  });
}

export async function createKotlinSemanticImportSidecar(input = {}, options = {}) {
  const importResult = await importKotlinSource(input, options);
  return createSemanticImportSidecar(importResult, pickSidecarOptions(options));
}
