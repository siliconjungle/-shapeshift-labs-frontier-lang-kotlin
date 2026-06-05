import assert from 'node:assert/strict';
import { importKotlinSource, createKotlinSemanticImportSidecar } from '../dist/index.js';

for (let i = 0; i < 40; i += 1) {
  const ast = {
    kind: 'KtFile',
    packageDirective: { kind: 'KtPackageDirective', fqName: 'fuzz' },
    declarations: [{
      kind: 'KtClass',
      name: `Todo${i}`,
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
        name: `addTodo${i}`,
        bodyExpression: { kind: 'KtBlockExpression' }
      }]
    }]
  };
  const imported = await importKotlinSource({
    sourcePath: `src/Todo${i}.kt`,
    sourceText: `package fuzz\nclass Todo${i}(val title: String) { fun addTodo${i}() {} }\n`,
    ast
  });
  assert.equal(imported.metadata.astFormat, 'kotlin-psi');
  assert.equal(imported.semanticIndex.symbols.some((symbol) => symbol.name === `Todo${i}`), true);
  assert.equal(imported.semanticIndex.symbols.some((symbol) => symbol.name === `addTodo${i}`), true);
  const sidecar = await createKotlinSemanticImportSidecar({
    sourcePath: `src/Todo${i}.kt`,
    sourceText: `package fuzz\nclass Todo${i}(val title: String) { fun addTodo${i}() {} }\n`,
    ast
  }, { id: `kotlin-fuzz-${i}` });
  assert.equal(sidecar.imports.length, 1);
}

console.log('@shapeshift-labs/frontier-lang-kotlin fuzz ok');
