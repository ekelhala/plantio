export interface Email {
    sender: {
        email: string,
        name: string
    },
    to: [{email: string}],
    subject: string,
    htmlContent: string
}