export default [
	{
		input: 'public/Potree/src/Potree.js',
		treeshake: false,
		output: {
			file: 'public/build/potree/potree.js',
			format: 'umd',
			name: 'Potree',
			sourcemap: true,
		}
	},{
		input: 'public/Potree/src/workers/BinaryDecoderWorker.js',
		output: {
			file: 'public/build/potree/workers/BinaryDecoderWorker.js',
			format: 'es',
			name: 'Potree',
			sourcemap: false
		}
	},{
		input: 'public/Potree/src/modules/loader/2.0/DecoderWorker.js',
		output: {
			file: 'public/build/potree/workers/2.0/DecoderWorker.js',
			format: 'es',
			name: 'Potree',
			sourcemap: false
		}
	},{
		input: 'public/Potree/src/modules/loader/2.0/DecoderWorker_brotli.js',
		output: {
			file: 'public/build/potree/workers/2.0/DecoderWorker_brotli.js',
			format: 'es',
			name: 'Potree',
			sourcemap: false
		}
	}
]