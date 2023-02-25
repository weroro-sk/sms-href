const fs = require('fs');
const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

/** @type {PluginGetFileSize} */
const {PluginGetFileSize} = require("./webpack-file-size-plugin");

module.exports = {
    entry: {
        "demo": path.resolve(__dirname, 'demo', 'src', 'index.js'),
        // Minimal build
        "size_measuring": path.resolve(__dirname, 'demo', 'src', 'do_not_edit_this_file.js')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'demo', 'dist'),
        clean: true
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: []
            },
        ]
    },
    plugins: [
        new PluginGetFileSize('size_measuring.js', {
            pad: 2,
            callback: (dataList) => {

                console.log('\n\n');
                console.table(dataList);
                console.log('\n');

                // Remove file/s
                dataList.forEach(file => {

                    const {filename, dir, related} = file;

                    /** @type {string} */
                    const filePath = path.resolve(dir, filename);
                    /** @type {string} */
                    const sourceMap = related?.sourceMap;

                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        if (!!sourceMap)
                            fs.unlinkSync(path.resolve(dir, sourceMap));
                    }
                });

            }
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    sourceMap: true,
                    format: {comments: false},
                    mangle: {
                        properties: {regex: /^[_#]/},
                    }
                }
            }),
        ],
    },
};
