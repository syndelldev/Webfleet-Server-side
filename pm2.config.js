module.exports = {
    apps: [
      {
        name: 'Webfleet-backend',
        script: 'app.js', // Entry point of your Node.js application
        watch: true,
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };