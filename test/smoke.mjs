import assert from 'node:assert/strict';
import {
  KotlinLanguagePackage,
  KotlinParserAstFormat,
  KotlinSourceLanguage,
  createKotlinNativeImporterAdapter,
  createKotlinLanguageCapabilityMatrix,
  importKotlinSource,
  createKotlinSemanticImportSidecar
} from '../dist/index.js';

const ast = {
  kind: 'KtFile',
  packageDirective: { kind: 'KtPackageDirective', fqName: 'demo', startLine: 1, startColumn: 1 },
  imports: [{ kind: 'KtImportDirective', importedFqName: 'kotlinx.coroutines.flow.Flow', startLine: 2, startColumn: 1 }],
  declarations: [{
    kind: 'KtClass',
    name: 'Todo',
    classKind: 'class',
    modifiers: ['data'],
    annotationEntries: [{ kind: 'KtAnnotationEntry', shortName: 'Serializable' }],
    declarations: [{
      kind: 'KtPrimaryConstructor',
      parameters: [{
        kind: 'KtParameter',
        name: 'title',
        typeReference: { text: 'String' },
        valOrVarKeyword: 'val'
      }]
    }, {
      kind: 'KtNamedFunction',
      name: 'addTodo',
      modifiers: ['suspend'],
      valueParameters: [{ kind: 'KtParameter', name: 'title', typeReference: { text: 'String' } }],
      bodyExpression: { kind: 'KtBlockExpression' }
    }]
  }, {
    kind: 'KtClass',
    name: 'PlatformStore',
    modifiers: ['expect'],
    classKind: 'class'
  }]
};

const adapter = createKotlinNativeImporterAdapter();
assert.equal(adapter.language, KotlinSourceLanguage);
assert.equal(KotlinLanguagePackage.parserAstFormat, KotlinParserAstFormat);
assert.equal(KotlinLanguagePackage.version, '0.1.10');
assert.equal(KotlinLanguagePackage.compilerVersion, '0.2.68');

const imported = await importKotlinSource({
  sourcePath: 'src/Todo.kt',
  sourceText: 'package demo\nimport kotlinx.coroutines.flow.Flow\n@Serializable data class Todo(val title: String) { suspend fun addTodo(title: String) {} }\nexpect class PlatformStore\n',
  ast
}, {
  importerOptions: {
    kotlinVersion: '2.1',
    analysisApiEvidence: { hash: 'kotlin-analysis-api-fixture', symbols: ['Todo'] },
    multiplatformEvidence: { hash: 'kotlin-mpp-fixture', targetPlatform: 'common' }
  }
});

assert.equal(imported.adapter.parser, 'kotlin-psi');
assert.equal(imported.metadata.astFormat, 'kotlin-psi');
assert.equal(imported.metadata.kotlinVersion, '2.1');
assert.equal(imported.semanticIndex.symbols.some((symbol) => symbol.name === 'demo' && symbol.kind === 'namespace'), true);
assert.equal(imported.semanticIndex.symbols.some((symbol) => symbol.name === 'Todo' && symbol.kind === 'class'), true);
assert.equal(imported.semanticIndex.symbols.some((symbol) => symbol.name === 'title' && symbol.kind === 'property'), true);
assert.equal(imported.semanticIndex.symbols.some((symbol) => symbol.name === 'addTodo' && symbol.kind === 'method'), true);
assert.equal(imported.losses.some((loss) => loss.kind === 'metaprogramming'), true);
assert.equal(imported.losses.some((loss) => loss.kind === 'unsupportedSemantic' && loss.metadata?.feature === 'coroutine'), true);
assert.equal(imported.metadata.nativeImportLossSummary.semanticMergeReadiness, 'needs-review');

const capability = createKotlinLanguageCapabilityMatrix({ imports: [imported], targets: ['typescript', 'rust'] });
assert.equal(capability.kind, 'frontier.lang.universalCapabilityMatrix');
assert.equal(capability.languages.length, 1);
assert.equal(capability.languages[0].language, KotlinSourceLanguage);
assert.equal(capability.summary.imports, 1);
assert.equal(capability.summary.targetEntries, 2);

const scriptImport = await importKotlinSource({
  sourcePath: 'scripts/setup.main.kts',
  sourceText: 'println("setup")\n',
  ast: { kind: 'KtScript', statements: [{ kind: 'KtCallExpression', calleeExpression: { text: 'println' } }] }
});
assert.equal(scriptImport.metadata.script, true);
assert.equal(scriptImport.losses.some((loss) => loss.metadata?.feature === 'script'), true);

const sidecar = await createKotlinSemanticImportSidecar({
  sourcePath: 'src/Todo.kt',
  sourceText: 'package demo\nclass Todo(val title: String) { fun addTodo(title: String) {} }\n',
  ast
}, { id: 'kotlin-sidecar', regionPrefix: 'kotlin' });

assert.equal(sidecar.id, 'kotlin-sidecar');
assert.equal(sidecar.symbols.some((symbol) => symbol.name === 'addTodo'), true);
console.log('@shapeshift-labs/frontier-lang-kotlin smoke ok');
