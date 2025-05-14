module.exports = {
    apps: [
      {
        name: "SMARTBILL_33009",
        script: "./server.js",
        env: {
          NODE_ENV: "production",
          PORT: 33009
        }
      }
    ]
  };