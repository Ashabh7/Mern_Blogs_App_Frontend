const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function (root) {
    root.use(
        '/api', // Adjust The Path You Want to Proxy 
        createProxyMiddleware({
            target: 'http:localhost:8000', // Specify The Address of Your Backend Server 
            changeOrigin: true,
            secure: false, // Set to false If Your Backend Doesn't Use HTTPS
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000'// Adjust The React App's Origin
            }  
        })
    )
}