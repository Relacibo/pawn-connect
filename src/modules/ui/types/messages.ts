type UIMessage = {
    type: 'error',
    message: string
} | {
    type: 'success',
    message: string
}