<script>
	import client from '../../index.js'

	const { http, ws, upload, sub } = client()

	async function handleUpload() {
		// Upload
		console.log('UPLOAD')
		const result = await upload('uploads/insert')({
			multiple: true,
			progress: function(event) {
				console.log('EVENT:', event)
			}
		})
		console.log({ result })
		const ul = await http('uploads/get')({ _id: result._id })
		console.log({ ul })
	}

	async function handleActions() {
		console.log('Running actions')
		let result = await http('tasks/insert')({ name: 'test' })
		console.log({ result })
		result = await http('tasks/update')({ _id: result._id }, { name: 'test2' })
		console.log({ result })
		result = await http('tasks/update')({ name: 'test2' }, { name: 'test3' })
		console.log({ result })
		result = await http('tasks/get')({ name: 'test3' })
		console.log({ result })
	}

	async function run() {
		// HTTP
		console.log('http')
		let result = await http('projects/find')()
		console.log({ result })

		// Websockets
		console.log('WEBSOCKET')
		result = await ws('projects/find')()
		console.log({ result })

		// Subscription
		console.log('SUBSCRIPTION')
		result = await sub(['uploads/insert'])({
			message: async function(data, event) {
				console.log('SUBSCRIPTION MESSAGE RECEIVED')
				console.log({ data })
				const result = await http('uploads/get')({ _id: data[0] })
				console.log(result)
			}
		})
		console.log({ result })
	}

	run()
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Waveorb client demo!</h1>
<button on:click="{handleUpload}">Upload</button>
<button on:click="{handleActions}">Actions</button>
