const path = require('path')
const webpack = require('webpack')
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/dsj_calendar/'
        : '/',
    assetsDir: './',
    outputDir: 'docs'
}
