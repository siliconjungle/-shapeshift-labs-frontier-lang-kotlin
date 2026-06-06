import {
  KotlinLanguagePackage,
  createKotlinNativeImporterAdapter,
  createKotlinLanguageCapabilityMatrix,
  importKotlinSource,
  createKotlinSemanticImportSidecar
} from '../src/index.js';
import type {
  KotlinLanguageCapabilityMatrixOptions,
  KotlinSourceImportInput,
  KotlinSourceImportOptions,
  KotlinSemanticImportSidecarOptions
} from '../src/index.js';
import type { NativeImporterAdapter, UniversalCapabilityMatrix } from '@shapeshift-labs/frontier-lang-compiler';

const adapter: NativeImporterAdapter = createKotlinNativeImporterAdapter();
const input: KotlinSourceImportInput = { sourceText: '', ast: {} };
const options: KotlinSourceImportOptions = { adapterOptions: {} };
const capabilityOptions: KotlinLanguageCapabilityMatrixOptions = { targets: ['typescript'] };
const sidecarOptions: KotlinSemanticImportSidecarOptions = {
  id: 'sidecar',
  generatedAt: 1710000000000,
  regionPrefix: 'src',
  sidecarOptions: {
    id: 'nested-sidecar',
    generatedAt: 1710000000001
  }
};
const packageName: '@shapeshift-labs/frontier-lang-kotlin' = KotlinLanguagePackage.packageName;
const capability: UniversalCapabilityMatrix = createKotlinLanguageCapabilityMatrix(capabilityOptions);

void adapter;
void input;
void options;
void capabilityOptions;
void capability;
void sidecarOptions;
void packageName;
void importKotlinSource(input, options);
void createKotlinSemanticImportSidecar(input, sidecarOptions);
