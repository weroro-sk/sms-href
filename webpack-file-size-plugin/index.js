class PluginGetFileSize {

    /**
     * @param {string} fileName Receive file name to get size.
     *                          Only output file name not full path
     * @param {{pad?: number, callback?: (fileSize: number, sizeUnits: string, fileName: string, outputPath: string, fileRelated: {sourceMap?: string}) => void}} [opt]
     */
    constructor(fileName, opt) {
        this.file = fileName;
        // Number of decimal places
        this.pad = typeof opt?.pad !== 'number' || isNaN(opt.pad) ? 2 : Math.abs(opt.pad);
        this.callback = opt?.callback;
    }

    /**
     * @param {{hooks: {done:{tap: (PluginName: string, callback: (stats: {compilation: {assetsInfo: Map<string, object>, compiler: {outputPath: string}}}) => void) => void}}}} compiler
     */
    apply(compiler) {
        compiler.hooks.done.tap(
            'Get File Size',
            (stats) => {

                // Get output file
                /** @type {{size: number, related: {}} | undefined} */
                const file = stats.compilation.assetsInfo.get(this.file);

                // Verify if file exists
                if (!file)
                    return console.log('\n\n', 'File', this.file, 'not exists', '\n');

                // Get file size
                /** @type {number} */
                const fileSizeInBytes = file.size;

                // only used to convert
                /** @type {string[]} */
                const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

                // Get size type
                /** @type {number} */
                const sizeTypeIndex = parseInt(Math.floor(Math.log(fileSizeInBytes) / Math.log(1024)).toString());

                // Number of decimal places
                /** @type {number} */
                const pad = Math.pow(10, this.pad);

                // Get size of file using size type
                /** @type {number} */
                const size = Math.round((fileSizeInBytes / Math.pow(1024, sizeTypeIndex)) * pad) / pad;

                if (typeof this.callback === 'function')
                    this.callback?.(
                        // File size (number)
                        size,
                        // Size units (string)
                        sizes[sizeTypeIndex],
                        // File Name (string)
                        this.file,
                        // Output path (string)
                        stats.compilation.compiler.outputPath,
                        // File related list (object)
                        file.related
                    );
                else
                    console.log('\n\n', this.file, 'has', size, sizes[sizeTypeIndex], '\n');
            }
        );
    }
}

module.exports.PluginGetFileSize = PluginGetFileSize;
