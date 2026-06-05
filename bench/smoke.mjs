import { performance } from 'node:perf_hooks';
import { importKotlinSource } from '../dist/index.js';

const iterations = 100;
const started = performance.now();
let symbols = 0;
for (let i = 0; i < iterations; i += 1) {
  const ast = {
    kind: 'KtFile',
    packageDirective: { kind: 'KtPackageDirective', fqName: 'bench' },
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
    sourceText: `package bench\nclass Todo${i}(val title: String) { fun addTodo${i}() {} }\n`,
    ast
  });
  symbols += imported.semanticIndex.symbols.length;
}
const elapsedMs = performance.now() - started;
console.log(JSON.stringify({
  package: '@shapeshift-labs/frontier-lang-kotlin',
  iterations,
  elapsedMs: Number(elapsedMs.toFixed(3)),
  importsPerSecond: Number((iterations / (elapsedMs / 1000)).toFixed(2)),
  symbols
}, null, 2));
