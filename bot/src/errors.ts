

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err)
})

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection:', reason, promise)
})