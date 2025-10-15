
export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function deleteAllImagesExceptGitkeep() {
	try {
		const files = await fs.readdir("./images/");
		for (const file of files) {
			try {
				const filePath = path.join(directoryPath, file);
				const stat = await fs.stat(filePath);

				if (stat.isFile() && file !== '.gitkeep') {
					await fs.unlink(filePath, err => console.error(err));
				}
			} catch (err) {
				console.error(err)
			}
		}
		console.log('Deleted all images');
	} catch (error) {
		console.error(error);
	}
}