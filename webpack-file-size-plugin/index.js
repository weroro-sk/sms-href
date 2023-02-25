class PluginGetFileSize {

    /**
     * @param {string | null} fileName
     * @param {{pad?: number, units?:"Bytes"|"B"|"KB"|"MB"|"GB"|"TB"|"auto", callback?: (dataList: {filename: string, size: number, related: {} | undefined, units: string, dir: string}[]) => void}} [opt]
     */
    constructor(fileName, opt) {
        /**
         * @type {string|null}
         * @private
         * @readonly
         */
        this._file = fileName;

        /**
         * @description Number of decimal places
         *
         * @type {number|number}
         * @private
         * @readonly
         */
        this._pad = typeof opt?.pad !== 'number' || isNaN(opt.pad) ? 0 : Math.abs(opt.pad);

        /**
         * @type {function({filename: string, size: number, related: {}, units: string, dir: string}[]): void}
         * @private
         * @readonly
         */
        this._callback = opt?.callback;

        /**
         * @type {"Bytes"|"B"|"KB"|"MB"|"GB"|"TB"|"auto"}
         * @private
         */
        this._units = opt?.units || 'auto';
        if (this._units === 'B')
            this._units = 'Bytes';
    }

    /**
     * @param {{compilation: {compiler: {outputPath: string}, assetsInfo: Map<string, {size: number, related?: {sourceMap: string} | undefined}>}}} stats
     * @param {string} filename
     * @returns {{filename: string, size: number, related: {}, units: string, dir: string}}
     *
     * @private
     */
    _getFileSizeData(stats, filename) {

        /** @type {{size: number, related?: ({sourceMap: string}|undefined)}} */
        const info = stats.compilation.assetsInfo.get(filename);

        // Verify if file exists
        if (!info) {
            return {
                size: undefined,
                units: undefined,
                filename: 'File ' + filename + ' not exists',
                dir: undefined,
                related: undefined
            }
        }

        // Get file size
        /** @type {number} */
        const fileSizeInBytes = info.size;

        // only used to convert
        /** @type {string[]} */
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        // Get size type
        /** @type {number} */
        const definedSizeType = sizes.indexOf(this._units);
        /** @type {number} */
        let sizeType;
        if (this._units === 'auto' || definedSizeType < 0)
            sizeType = parseInt(Math.floor(Math.log(fileSizeInBytes) / Math.log(1024)).toString());
        else
            sizeType = definedSizeType;

        // Number of decimal places
        /** @type {number} */
        const decimalPlaces = Math.pow(10, this._pad);

        // Get size of file using size type
        /** @type {number} */
        const size = Math.round((fileSizeInBytes / Math.pow(1024, sizeType)) * decimalPlaces) / decimalPlaces;
        /** @type {string} */
        const units = sizes[sizeType];
        /** @type {string} */
        const dir = stats.compilation.compiler.outputPath;
        /** @type {{sourceMap: string}|undefined} */
        const related = info?.related;

        return {
            // File size (number)
            size,
            // Size units (string)
            units,
            // File Name (string)
            filename,
            // Output dir (string)
            dir,
            // Related list (object)
            related
        }

    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {{hooks: {done:{tap: (PluginName: string, callback: (stats: {compilation: {assetsInfo: Map<string, object>, compiler: {outputPath: string}}}) => void) => void}}}} compiler
     */
    apply(compiler) {
        compiler.hooks.done.tap(
            'Get File Size',
            (stats) => {

                /** @type {{filename: string, size: number, related: {}, units: string, dir: string}[]} */
                const dataList = [];

                if (!this._file?.trim()) {
                    for (const filename of stats.compilation.assetsInfo.keys())
                        dataList.push(this._getFileSizeData(stats, filename));
                } else
                    dataList.push(this._getFileSizeData(stats, this._file));

                /** @type {{filename: string, size: number, related: {}, units: string, dir: string}[]} */
                const filteredList = dataList.filter(item => !!item);

                if (typeof this._callback !== 'function')
                    return console.log(filteredList);

                this._callback?.(filteredList);
            }
        );
    }
}

module.exports.PluginGetFileSize = PluginGetFileSize;
