export interface Email {
    sender: {
        email: string
    },
    to: [{email: string}],
    subject: string,
    htmlContent: string
}