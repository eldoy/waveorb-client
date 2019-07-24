<script>
	import client from '../../index.js'

	const { ajax, upload } = client('http://localhost:4000')
	const { socket, sub } = client('ws://localhost:4000')

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
	}

	async function handleActions() {
		console.log('Running actions')
		let result = await ajax('tasks/insert')({ name: 'test' })
		console.log({ result })
		result = await ajax('tasks/update')({ _id: result._id }, { name: 'test2' })
		console.log({ result })
		result = await ajax('tasks/update')({ name: 'test2' }, { name: 'test3' })
		console.log({ result })
		result = await ajax('tasks/get')({ name: 'test3' })
		console.log({ result })
	}

	async function run() {
		// AJAX
		console.log('AJAX')
		let result = await ajax('projects/find')()
		console.log({ result })

		// Websockets
		console.log('WEBSOCKET')
		result = await socket('projects/find')()
		console.log({ result })

		// Subscription
		console.log('SUBSCRIPTION')
		result = await sub(['uploads/insert'])({
			message: async function(data, event) {
				console.log('SUBSCRIPTION MESSAGE RECEIVED')
				console.log({ data })
				const result = await ajax('uploads/get')({ _id: data[0] })
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
