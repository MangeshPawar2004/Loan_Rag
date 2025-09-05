// src/lib/rag.js (simplified)
import { loadHnswlib } from 'hnswlib-wasm';

let lib = null;
let index = null;

export async function initIndex({dim = 1536, indexName='loansIndex'} = {}) {
  lib = await loadHnswlib();
  // sync FS if you need to read an existing index saved into IDBFS
  await lib.EmscriptenFileSystemManager.syncFS(true);
  const exists = lib.EmscriptenFileSystemManager.checkFileExists(`${indexName}.idx`);
  index = new lib.HierarchicalNSW('cosine', dim);
  if (exists) {
    index.readIndex(`${indexName}.idx`, /*maxElements*/100000, true);
  } else {
    index.initIndex(10000, 48, 128, 200); // maxElements, M, efConstruction, randomSeed
    // after init, you can add items using index.addItems(...)
  }
  index.setEfSearch(32);
  return { lib, index };
}

export async function addVectors(index, vectorsArray) {
  // vectorsArray: [[float,...], ...]
  index.addItems(vectorsArray, true);
  // save
  index.writeIndex('loansIndex.idx');
  await lib.EmscriptenFileSystemManager.syncFS(false);
}

export function search(index, queryVector, k=5) {
  // returns labels and distances
  return index.searchKnn(queryVector, k, undefined);
}
