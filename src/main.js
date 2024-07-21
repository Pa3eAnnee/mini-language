import {crawl} from './getting/crawler.js';
import {parser} from './language/grammar.js';
import {evalBloc} from './language/evaluation/evalBloc.js';
import {readFileSync} from 'fs';

const parsed = parser.parse(readFileSync(process.argv[2], 'utf8'));
evalBloc(parsed);