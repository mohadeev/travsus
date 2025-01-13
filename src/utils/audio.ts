export async function loadAudio(url: string): Promise<AudioBuffer> {
	const response = await fetch(url)
	const arrayBuffer = await response.arrayBuffer()
	const audioContext = new (window.AudioContext ||
		(window as any).webkitAudioContext)()
	return await audioContext.decodeAudioData(arrayBuffer)
}

export function playAudio(buffer: AudioBuffer) {
	const audioContext = new (window.AudioContext ||
		(window as any).webkitAudioContext)()
	const source = audioContext.createBufferSource()
	source.buffer = buffer
	source.connect(audioContext.destination)
	source.start()
}
