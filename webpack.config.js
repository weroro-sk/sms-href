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
            callback: (fileSize, sizeUnits, fileName, outputPath, fileRelated) => {

                console.log('\n\n');
                console.table({fileName, fileSize, sizeUnits});
                console.log('\n');

                // Remove file/s
                /** @type {string} */
                const filePath = path.resolve(outputPath, fileName);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    if (fileRelated?.sourceMap)
                        fs.unlinkSync(path.resolve(outputPath, fileRelated?.sourceMap));
                }

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
