import {build} from 'esbuild';await build({entryPoints:['src/search-worker.js'],bundle:true,platform:'browser',format:'iife',outfile:'public/worker.js',minify:true,legalComments:'eof'});
